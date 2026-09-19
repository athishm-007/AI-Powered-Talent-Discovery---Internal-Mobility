import { SupabaseClient } from '@supabase/supabase-js';

export function createInitiativeRepository(client: SupabaseClient) {
  return {
    async getAllInitiatives() {
      const { data, error } = await client
        .from('initiatives')
        .select(`
          *,
          departments(name),
          initiative_skills(*, skills(name, category))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async createInitiative(initiativeData: Record<string, any>, skills: Array<Record<string, any>>) {
      const { data: newInit, error: initErr } = await client
        .from('initiatives')
        .insert(initiativeData)
        .select()
        .single();

      if (initErr) throw initErr;

      if (skills.length > 0) {
        const initSkills = skills.map((s) => ({ ...s, initiative_id: newInit.id }));
        const { error: skillsErr } = await client.from('initiative_skills').insert(initSkills);
        if (skillsErr) throw skillsErr;
      }

      return newInit;
    },
  };
}
