import { SupabaseClient } from '@supabase/supabase-js';

export function createGapRepository(client: SupabaseClient) {
  return {
    async getGapAnalysis(profileId: string, targetRoleId: string) {
      const { data, error } = await client
        .from('skill_gap_analyses')
        .select(`
          *,
          roles(title, description, departments(name))
        `)
        .eq('profile_id', profileId)
        .eq('target_role_id', targetRoleId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async saveGapAnalysis(gapData: Record<string, any>) {
      const { data, error } = await client
        .from('skill_gap_analyses')
        .insert(gapData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  };
}
