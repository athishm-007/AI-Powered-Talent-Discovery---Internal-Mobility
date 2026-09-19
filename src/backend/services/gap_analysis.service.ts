import { SupabaseClient } from '@supabase/supabase-js';
import { createGapRepository } from '../repositories/gap.repository';
import { createProfileRepository } from '../repositories/profile.repository';
import { createRoleRepository } from '../repositories/role.repository';
import { createRoadmapRepository } from '../repositories/roadmap.repository';

export function createGapAnalysisService(userClient: SupabaseClient, adminClient: SupabaseClient) {
  const userGapRepo = createGapRepository(userClient);
  const adminGapRepo = createGapRepository(adminClient);
  const adminProfileRepo = createProfileRepository(adminClient);
  const adminRoleRepo = createRoleRepository(adminClient);
  const adminRoadmapRepo = createRoadmapRepository(adminClient);

  return {
    async getGapAnalysis(profileId: string, targetRoleId: string) {
      let gap = await userGapRepo.getGapAnalysis(profileId, targetRoleId);
      if (!gap) {
        gap = await this.computeAndSaveGapAnalysis(profileId, targetRoleId);
      }
      return gap;
    },

    async computeAndSaveGapAnalysis(profileId: string, targetRoleId: string) {
      const profile = await adminProfileRepo.getProfileByUserId(profileId);
      const role = await adminRoleRepo.getRoleById(targetRoleId);
      const resources = await adminRoadmapRepo.getAllLearningResources();

      if (!profile || !role) {
        throw new Error('Profile or Target Role not found');
      }

      const roleSkills = role.role_skills || [];
      const userSkillsMap = new Map((profile.employee_skills || []).map((es: any) => [es.skill_id, es]));

      const missingGaps: any[] = [];
      let totalDiff = 0;
      let maxPossibleDiff = 0;

      for (const rs of roleSkills) {
        const userSkill = userSkillsMap.get(rs.skill_id);
        const userProf = userSkill?.proficiency_level || 0;
        const reqProf = rs.required_proficiency || 1;

        maxPossibleDiff += reqProf;

        if (userProf < reqProf) {
          const diff = reqProf - userProf;
          totalDiff += diff;

          const severity = diff >= 3 || rs.is_required ? 'CRITICAL' : diff === 2 ? 'MODERATE' : 'MINOR';
          const timeToClose = diff >= 3 ? '6-8 weeks' : diff === 2 ? '3-4 weeks' : '1-2 weeks';

          const matchingRes = resources
            .filter((r: any) => r.target_skill_id === rs.skill_id)
            .map((r: any) => r.id);

          missingGaps.push({
            skill_id: rs.skill_id,
            skill_name: rs.skills?.name || 'Required Skill',
            category: rs.skills?.category || 'General',
            user_proficiency: userProf,
            required_proficiency: reqProf,
            severity,
            estimated_time_to_close: timeToClose,
            recommended_resource_ids: matchingRes,
          });
        }
      }

      const gapScore = maxPossibleDiff > 0 ? Math.round((totalDiff / maxPossibleDiff) * 100) / 100 : 0;

      const gapData = {
        profile_id: profileId,
        target_role_id: targetRoleId,
        gap_score: Math.min(1.0, gapScore),
        missing_skills: missingGaps,
      };

      return adminGapRepo.saveGapAnalysis(gapData);
    },
  };
}
