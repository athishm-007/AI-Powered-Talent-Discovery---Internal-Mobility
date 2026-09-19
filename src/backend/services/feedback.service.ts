import { SupabaseClient } from '@supabase/supabase-js';
import { createFeedbackRepository } from '../repositories/feedback.repository';
import { createMatchRepository } from '../repositories/match.repository';
import { calculateFeedbackModifierFromSignals, UserSignal } from './feedback.math';
import { AppError } from '../middleware/withErrorHandler';

export function createFeedbackService(userClient: SupabaseClient, adminClient: SupabaseClient) {
  const userFeedbackRepo = createFeedbackRepository(userClient);
  const adminFeedbackRepo = createFeedbackRepository(adminClient);
  const adminMatchRepo = createMatchRepository(adminClient);

  return {
    async submitFeedback(profileId: string, itemType: 'match' | 'gap' | 'resource' | 'roadmap', itemId: string, isHelpful: boolean, reason?: string) {
      // Ownership and existence verification
      if (itemType === 'match') {
        const { data: match } = await adminClient.from('match_results').select('id, role_id, profile_id').eq('id', itemId).maybeSingle();
        if (!match || match.profile_id !== profileId) {
          throw new AppError('NOT_FOUND', 'Match record not found or access denied', 404);
        }
      } else if (itemType === 'gap') {
        const { data: gap } = await adminClient.from('skill_gap_analyses').select('id, profile_id').eq('id', itemId).maybeSingle();
        if (!gap || gap.profile_id !== profileId) {
          throw new AppError('NOT_FOUND', 'Skill gap analysis not found or access denied', 404);
        }
      } else if (itemType === 'roadmap') {
        const { data: item } = await adminClient.from('roadmap_items').select('id, roadmaps(profile_id)').eq('id', itemId).maybeSingle();
        if (!item || (item.roadmaps as any)?.profile_id !== profileId) {
          throw new AppError('NOT_FOUND', 'Roadmap item not found or access denied', 404);
        }
      } else if (itemType === 'resource') {
        const { data: resource } = await adminClient.from('learning_resources').select('id').eq('id', itemId).maybeSingle();
        if (!resource) {
          throw new AppError('NOT_FOUND', 'Learning resource not found', 404);
        }
      }

      const feedback = await userFeedbackRepo.submitFeedback({
        profile_id: profileId,
        item_type: itemType,
        item_id: itemId,
        is_helpful: isHelpful,
        reason,
      });

      // Trigger background re-weighting using service-role client
      await this.recomputeModifiers(itemType, itemId);

      return feedback;
    },

    async logOutcome(profileId: string, outcomeType: 'applied' | 'promoted' | 'moved' | 'completed_course', targetId: string, details: Record<string, any> = {}) {
      // Verify target ID existence
      if (outcomeType === 'completed_course') {
        const { data: res } = await adminClient.from('learning_resources').select('id').eq('id', targetId).maybeSingle();
        if (!res) throw new AppError('NOT_FOUND', 'Target learning resource not found', 404);
      } else {
        const { data: role } = await adminClient.from('roles').select('id').eq('id', targetId).maybeSingle();
        if (!role) throw new AppError('NOT_FOUND', 'Target role not found', 404);
      }

      const outcome = await userFeedbackRepo.logOutcome({
        profile_id: profileId,
        outcome_type: outcomeType,
        target_id: targetId,
        details,
      });

      // Trigger background re-weighting
      if (outcomeType === 'completed_course') {
        await this.recomputeModifiers('resource', targetId);
      } else {
        await this.recomputeModifiers('match', targetId);
      }

      return outcome;
    },

    async recomputeModifiers(itemType: string, targetId: string) {
      if (itemType === 'match') {
        // Find role_id and matched/missing skills
        const { data: match } = await adminClient.from('match_results').select('role_id, matched_skills, missing_skills').eq('id', targetId).maybeSingle();
        const roleId = match?.role_id || targetId;

        const { data: rawFeedback } = await adminClient.from('recommendation_feedback').select('profile_id, is_helpful').eq('item_id', targetId);
        const { data: rawOutcomes } = await adminClient.from('career_outcomes').select('profile_id, outcome_type').eq('target_id', roleId);

        const userSignalsMap = new Map<string, UserSignal>();

        for (const fb of rawFeedback || []) {
          const entry = userSignalsMap.get(fb.profile_id) || { userId: fb.profile_id, helpfulCount: 0, unhelpfulCount: 0 };
          if (fb.is_helpful) entry.helpfulCount += 1;
          else entry.unhelpfulCount += 1;
          userSignalsMap.set(fb.profile_id, entry);
        }

        for (const out of rawOutcomes || []) {
          const entry = userSignalsMap.get(out.profile_id) || { userId: out.profile_id, helpfulCount: 0, unhelpfulCount: 0 };
          entry.helpfulCount += 1; // Career outcome acts as positive signal
          userSignalsMap.set(out.profile_id, entry);
        }

        const modifier = calculateFeedbackModifierFromSignals(Array.from(userSignalsMap.values()));

        // Update ONLY skills cited in matched_skills or missing_skills
        const citedSkillIds = new Set<string>();
        for (const s of match?.matched_skills || []) citedSkillIds.add(s.skill_id);
        for (const s of match?.missing_skills || []) citedSkillIds.add(s.skill_id);

        for (const skillId of Array.from(citedSkillIds)) {
          await adminFeedbackRepo.updateRoleSkillModifier(roleId, skillId, modifier);
        }

        // Mark match_results as stale for this role
        await adminMatchRepo.markMatchesStaleForRole(roleId);
      } else if (itemType === 'resource') {
        const { data: rawFeedback } = await adminClient.from('recommendation_feedback').select('profile_id, is_helpful').eq('item_id', targetId);
        const { data: rawOutcomes } = await adminClient.from('career_outcomes').select('profile_id').eq('target_id', targetId);

        const userSignalsMap = new Map<string, UserSignal>();
        for (const fb of rawFeedback || []) {
          const entry = userSignalsMap.get(fb.profile_id) || { userId: fb.profile_id, helpfulCount: 0, unhelpfulCount: 0 };
          if (fb.is_helpful) entry.helpfulCount += 1;
          else entry.unhelpfulCount += 1;
          userSignalsMap.set(fb.profile_id, entry);
        }

        for (const out of rawOutcomes || []) {
          const entry = userSignalsMap.get(out.profile_id) || { userId: out.profile_id, helpfulCount: 0, unhelpfulCount: 0 };
          entry.helpfulCount += 1;
          userSignalsMap.set(out.profile_id, entry);
        }

        const modifier = calculateFeedbackModifierFromSignals(Array.from(userSignalsMap.values()));
        await adminFeedbackRepo.updateResourceModifier(targetId, modifier);
      }
    },
  };
}
