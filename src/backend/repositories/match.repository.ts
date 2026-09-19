import { SupabaseClient } from '@supabase/supabase-js';

export function createMatchRepository(client: SupabaseClient) {
  return {
    async getMatchesForProfile(profileId: string) {
      const { data, error } = await client
        .from('match_results')
        .select(`
          *,
          roles(title, location, opportunity_type, departments(name))
        `)
        .eq('profile_id', profileId)
        .order('overall_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async getMatchDetail(profileId: string, roleId: string) {
      const { data, error } = await client
        .from('match_results')
        .select(`
          *,
          roles(*, departments(name), role_skills(*, skills(name, category)))
        `)
        .eq('profile_id', profileId)
        .eq('role_id', roleId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async upsertMatchResult(matchData: Record<string, any>) {
      const { data, error } = await client
        .from('match_results')
        .upsert(matchData, { onConflict: 'profile_id,role_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async markMatchesStaleForRole(roleId: string) {
      const { error } = await client
        .from('match_results')
        .update({ is_stale: true })
        .eq('role_id', roleId);

      if (error) throw error;
    },
  };
}
