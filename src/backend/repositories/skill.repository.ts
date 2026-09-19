import { SupabaseClient } from '@supabase/supabase-js';

export function createSkillRepository(client: SupabaseClient) {
  return {
    async getAllSkills() {
      const { data, error } = await client
        .from('skills')
        .select(`
          *,
          relations:skill_relations!source_skill_id(*, target_skill:skills!target_skill_id(name))
        `)
        .order('category');

      if (error) throw error;
      return data || [];
    },
  };
}
