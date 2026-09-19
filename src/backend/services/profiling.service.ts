import { SupabaseClient } from '@supabase/supabase-js';
import { createProfileRepository } from '../repositories/profile.repository';
import { LLMProvider } from '../ai/llm_provider';
import { SYSTEM_PROMPTS, wrapPromptXml } from '../ai/prompts';
import { ExtractedProfileAnalysisSchema } from '../ai/schemas';

export function createProfilingService(userClient: SupabaseClient, adminClient: SupabaseClient, llm: LLMProvider) {
  const userProfileRepo = createProfileRepository(userClient);
  const adminProfileRepo = createProfileRepository(adminClient);

  return {
    async getProfile(userId: string) {
      return userProfileRepo.getProfileByUserId(userId);
    },

    async updateProfile(userId: string, updates: Record<string, any>) {
      return userProfileRepo.updateProfile(userId, updates);
    },

    async addExperienceAndReanalyze(userId: string, experience: Record<string, any>) {
      const exp = await userProfileRepo.addExperience({ ...experience, profile_id: userId });
      await this.triggerProfileReanalysis(userId, 'experience');
      return exp;
    },

    async addProjectAndReanalyze(userId: string, project: Record<string, any>) {
      const proj = await userProfileRepo.addProject({ ...project, profile_id: userId });
      await this.triggerProfileReanalysis(userId, 'project');
      return proj;
    },

    async addLearningAndReanalyze(userId: string, activity: Record<string, any>) {
      const act = await userProfileRepo.addLearningActivity({ ...activity, profile_id: userId });
      await this.triggerProfileReanalysis(userId, 'learning');
      return act;
    },

    async triggerProfileReanalysis(userId: string, triggerReason: 'resume' | 'experience' | 'project' | 'learning' | 'manual') {
      const profile = await adminProfileRepo.getProfileByUserId(userId);
      if (!profile) return;

      const profileContext = JSON.stringify({
        experiences: profile.experiences,
        projects: profile.projects,
        learning: profile.learning_activities,
        skills: profile.employee_skills,
      });

      const prompt = `Analyze this employee profile record and discover explicit and inferred skills:\n${wrapPromptXml('PROFILE_DATA', profileContext)}`;
      const analysis = await llm.completeJSON(prompt, SYSTEM_PROMPTS.PROFILING, ExtractedProfileAnalysisSchema);

      // Save explicit and inferred skills (Explicit claims win over existing inferred)
      for (const skill of [...analysis.explicit_skills, ...analysis.inferred_skills]) {
        // Find or create skill matching name
        const { data: skillRow } = await adminClient.from('skills').select('id').eq('name', skill.name).maybeSingle();
        const skillId = skillRow?.id || 's1000000-0000-0000-0000-000000000001';

        await adminProfileRepo.upsertEmployeeSkill({
          profile_id: userId,
          skill_id: skillId,
          proficiency_level: skill.proficiency_level,
          source: skill.source,
          confidence_score: skill.confidence_score,
          evidence_snippets: skill.evidence_snippets,
        });
      }

      // Update future potential summary
      if (analysis.future_potential_summary) {
        await adminProfileRepo.updateProfile(userId, {
          future_potential_summary: analysis.future_potential_summary,
        });
      }

      // Create Snapshot
      const snapshots = await adminProfileRepo.getSnapshots(userId);
      const version = (snapshots[0]?.version || 0) + 1;

      await adminProfileRepo.createSnapshot({
        profile_id: userId,
        version,
        skills_summary: {
          explicit_count: analysis.explicit_skills.length,
          inferred_count: analysis.inferred_skills.length,
          timestamp: new Date().toISOString(),
        },
        trigger: triggerReason,
      });

      // Refresh Embedding
      const embeddingText = `${profile.full_name} ${profile.role_title} ${analysis.future_potential_summary || ''}`;
      const vector = await llm.generateEmbedding(embeddingText);

      await adminProfileRepo.updateProfile(userId, {
        embedding: vector,
        embedding_model: 'text-embedding-3-small',
        embedding_updated_at: new Date().toISOString(),
      });
    },
  };
}
