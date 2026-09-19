import { SupabaseClient } from '@supabase/supabase-js';
import { createRoadmapRepository } from '../repositories/roadmap.repository';
import { createGapAnalysisService } from './gap_analysis.service';
import { LLMProvider } from '../ai/llm_provider';
import { SYSTEM_PROMPTS, wrapPromptXml } from '../ai/prompts';
import { LLMRoadmapGenerationSchema } from '../ai/schemas';

export function createRoadmapService(userClient: SupabaseClient, adminClient: SupabaseClient, llm: LLMProvider) {
  const userRoadmapRepo = createRoadmapRepository(userClient);
  const adminRoadmapRepo = createRoadmapRepository(adminClient);
  const gapService = createGapAnalysisService(userClient, adminClient);

  return {
    async getRoadmapForEmployee(profileId: string) {
      return userRoadmapRepo.getRoadmapForProfile(profileId);
    },

    async generateRoadmapForTargetRole(profileId: string, targetRoleId: string) {
      const gap = await gapService.getGapAnalysis(profileId, targetRoleId);
      const resources = await adminRoadmapRepo.getAllLearningResources();

      const prompt = `Create a phased career roadmap for target role:\n${wrapPromptXml('SKILL_GAPS', JSON.stringify(gap.missing_skills))}`;
      const llmRoadmap = await llm.completeJSON(prompt, SYSTEM_PROMPTS.ROADMAP, LLMRoadmapGenerationSchema);

      const items: any[] = [];
      for (const phaseObj of llmRoadmap.phases) {
        for (const item of phaseObj.items) {
          const matchedResource = resources.find((r: any) => r.title.toLowerCase().includes((item.resource_title || '').toLowerCase()));
          items.push({
            phase: phaseObj.phase,
            title: item.title,
            description: item.description,
            resource_id: matchedResource?.id || resources[0]?.id || null,
            status: 'pending',
          });
        }
      }

      const roadmapData = {
        profile_id: profileId,
        target_role_id: targetRoleId,
        status: 'in_progress',
        overall_progress_pct: 0.0,
      };

      return adminRoadmapRepo.createRoadmap(roadmapData, items);
    },

    async updateItemStatus(profileId: string, itemId: string, status: 'pending' | 'in_progress' | 'completed') {
      return userRoadmapRepo.updateRoadmapItemStatus(itemId, status);
    },

    async getAllLearningResources() {
      return userRoadmapRepo.getAllLearningResources();
    },
  };
}
