import { SupabaseClient } from '@supabase/supabase-js';

export function createInsightsRepository(client: SupabaseClient) {
  return {
    async getTalentAvailability() {
      const { data, error } = await client.rpc('get_talent_availability');
      if (error) throw error;
      return data?.[0] || { ready_now: 0, ready_6_months: 0, developing: 0 };
    },

    async getRecommendationQuality() {
      const { data, error } = await client.rpc('get_recommendation_quality');
      if (error) throw error;
      return data?.[0] || { helpful_rate_pct: 0, outcome_conversion_pct: 0, total_feedback_count: 0, trend: 'stable' };
    },

    async getWorkforceSupplyDemand() {
      const { data, error } = await client.rpc('get_workforce_supply_demand');
      if (error) throw error;
      return data || [];
    },

    async getSkillsHeatmap() {
      const { data, error } = await client.rpc('get_skills_heatmap');
      if (error) throw error;
      return data || [];
    },

    async getCachedSummary(inputHash: string) {
      const { data, error } = await client
        .from('ai_cache')
        .select('response_json')
        .eq('input_hash', inputHash)
        .maybeSingle();

      if (error) throw error;
      return data?.response_json || null;
    },

    async saveCachedSummary(inputHash: string, provider: string, promptType: string, responseJson: any) {
      const { error } = await client.from('ai_cache').upsert({
        input_hash: inputHash,
        provider,
        prompt_type: promptType,
        response_json: responseJson,
      }, { onConflict: 'input_hash' });

      if (error) throw error;
    },
  };
}
