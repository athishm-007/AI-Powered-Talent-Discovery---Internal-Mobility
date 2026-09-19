import { SupabaseClient } from '@supabase/supabase-js';
import { createMatchRepository } from '../repositories/match.repository';
import { createProfileRepository } from '../repositories/profile.repository';
import { createRoleRepository } from '../repositories/role.repository';
import { MATCH_WEIGHTS } from '../../lib/constants';
import { LLMProvider } from '../ai/llm_provider';
import { SYSTEM_PROMPTS, wrapPromptXml } from '../ai/prompts';
import { LLMMatchExplanationSchema } from '../ai/schemas';

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function calculateHybridMatchScore(params: {
  coverageScore: number;
  vectorSimilarity: number;
  transferableScore: number;
  experienceScore: number;
}): number {
  const w1 = MATCH_WEIGHTS.SKILL_COVERAGE; // 0.35
  const w2 = MATCH_WEIGHTS.VECTOR_SIMILARITY; // 0.25
  const w3 = MATCH_WEIGHTS.TRANSFERABLE_CREDIT; // 0.20
  const w4 = MATCH_WEIGHTS.EXPERIENCE_RELEVANCE; // 0.20

  const total =
    (params.coverageScore * w1) +
    (params.vectorSimilarity * w2) +
    (params.transferableScore * w3) +
    (params.experienceScore * w4);

  return Math.min(100, Math.max(0, Math.round(total * 100) / 100));
}


export function createMatchingService(userClient: SupabaseClient, adminClient: SupabaseClient, llm: LLMProvider) {
  const userMatchRepo = createMatchRepository(userClient);
  const adminMatchRepo = createMatchRepository(adminClient);
  const adminProfileRepo = createProfileRepository(adminClient);
  const adminRoleRepo = createRoleRepository(adminClient);

  return {
    async getMatchesForEmployee(profileId: string) {
      return userMatchRepo.getMatchesForProfile(profileId);
    },

    async getMatchDetail(profileId: string, roleId: string) {
      let match = await userMatchRepo.getMatchDetail(profileId, roleId);
      if (!match || match.is_stale) {
        match = await this.computeAndSaveMatch(profileId, roleId);
      }
      return match;
    },

    async computeAndSaveMatch(profileId: string, roleId: string) {
      const profile = await adminProfileRepo.getProfileByUserId(profileId);
      const role = await adminRoleRepo.getRoleById(roleId);

      if (!profile || !role) {
        throw new Error('Profile or Role not found for match computation');
      }

      const roleSkills = role.role_skills || [];
      const userSkillsMap = new Map<string, any>((profile.employee_skills || []).map((es: any) => [es.skill_id, es]));

      let totalEffectiveWeight = 0;
      let weightedCoverageSum = 0;

      const matchedSkillsList: any[] = [];
      const missingSkillsList: any[] = [];

      for (const rs of roleSkills) {
        const effectiveWeight = (rs.importance_weight || 0.5) * (rs.feedback_modifier || 1.0);
        totalEffectiveWeight += effectiveWeight;

        const userSkill = userSkillsMap.get(rs.skill_id);
        const userProficiency = userSkill?.proficiency_level || 0;
        const requiredProficiency = rs.required_proficiency || 1;

        const coverageRatio = Math.min(userProficiency / requiredProficiency, 1.0);
        weightedCoverageSum += effectiveWeight * coverageRatio;

        const item = {
          skill_id: rs.skill_id,
          skill_name: rs.skills?.name || 'Required Skill',
          user_proficiency: userProficiency,
          required_proficiency: requiredProficiency,
          coverage_score: Math.round(coverageRatio * 100) / 100,
          is_transferable: userSkill?.source === 'inferred',
        };

        if (userProficiency >= requiredProficiency) {
          matchedSkillsList.push(item);
        } else {
          missingSkillsList.push(item);
        }
      }

      // Normalized Coverage Score with Zero Denominator Guard
      let sCoverage = 0.0;
      if (totalEffectiveWeight > 0) {
        sCoverage = weightedCoverageSum / totalEffectiveWeight;
      }

      // Vector Cosine Similarity with Model Check
      let sVector = 0.0;
      if (
        profile.embedding &&
        role.embedding &&
        profile.embedding_model === role.embedding_model
      ) {
        sVector = Math.max(0.0, cosineSimilarity(profile.embedding, role.embedding));
      }

      // Transferable Credit Score
      const inferredCount = (profile.employee_skills || []).filter((s: any) => s.source === 'inferred').length;
      const sTransferable = Math.min(1.0, 0.5 + inferredCount * 0.1);

      // Experience Relevance Score
      const totalExpYears = (profile.experiences || []).length * 2;
      const sExperience = Math.min(1.0, totalExpYears / Math.max(1, role.min_years_exp || 3));

      // Overall Score Formula
      const overallScore =
        MATCH_WEIGHTS.SKILL_COVERAGE * sCoverage +
        MATCH_WEIGHTS.VECTOR_SIMILARITY * sVector +
        MATCH_WEIGHTS.TRANSFERABLE_CREDIT * sTransferable +
        MATCH_WEIGHTS.EXPERIENCE_RELEVANCE * sExperience;

      const roundedOverall = Math.min(1.0, Math.max(0.0, Math.round(overallScore * 100) / 100));

      const matchData = {
        profile_id: profileId,
        role_id: roleId,
        overall_score: roundedOverall,
        skill_coverage_score: Math.round(sCoverage * 100) / 100,
        vector_similarity_score: Math.round(sVector * 100) / 100,
        transferable_credit_score: Math.round(sTransferable * 100) / 100,
        experience_relevance_score: Math.round(sExperience * 100) / 100,
        explanation_text: `Candidate demonstrates ${Math.round(roundedOverall * 100)}% overall compatibility based on skill overlap and technical domain experience.`,
        cited_evidence_ids: profile.experiences?.[0] ? [{ type: 'experience', id: profile.experiences[0].id, description: profile.experiences[0].title }] : [],
        matched_skills: matchedSkillsList,
        missing_skills: missingSkillsList,
        is_stale: false,
      };

      return adminMatchRepo.upsertMatchResult(matchData);
    },
  };
}
