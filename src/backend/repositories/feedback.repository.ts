import { SupabaseClient } from '@supabase/supabase-js';

export function createFeedbackRepository(client: SupabaseClient) {
  return {
    async submitFeedback(feedbackData: Record<string, any>) {
      const { data, error } = await client
        .from('recommendation_feedback')
        .upsert(feedbackData, { onConflict: 'profile_id,item_type,item_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async logOutcome(outcomeData: Record<string, any>) {
      const { data, error } = await client
        .from('career_outcomes')
        .insert(outcomeData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async getFeedbackForRole(roleId: string) {
      const { data, error } = await client
        .from('recommendation_feedback')
        .select('*')
        .eq('item_type', 'match')
        .eq('item_id', roleId);

      if (error) throw error;
      return data || [];
    },

    async getFeedbackForResource(resourceId: string) {
      const { data, error } = await client
        .from('recommendation_feedback')
        .select('*')
        .eq('item_type', 'resource')
        .eq('item_id', resourceId);

      if (error) throw error;
      return data || [];
    },

    async getOutcomesForTarget(targetId: string) {
      const { data, error } = await client
        .from('career_outcomes')
        .select('*')
        .eq('target_id', targetId);

      if (error) throw error;
      return data || [];
    },

    async updateRoleSkillModifier(roleId: string, skillId: string, modifier: number) {
      const { error } = await client
        .from('role_skills')
        .update({ feedback_modifier: modifier })
        .eq('role_id', roleId)
        .eq('skill_id', skillId);

      if (error) throw error;
    },

    async updateResourceModifier(resourceId: string, modifier: number) {
      const { error } = await client
        .from('learning_resources')
        .update({ weight_modifier: modifier })
        .eq('id', resourceId);

      if (error) throw error;
    },
  };
}
