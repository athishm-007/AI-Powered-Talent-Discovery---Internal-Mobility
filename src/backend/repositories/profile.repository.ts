import { SupabaseClient } from '@supabase/supabase-js';

export function createProfileRepository(client: SupabaseClient) {
  return {
    async getProfileByUserId(userId: string) {
      const { data: profile, error } = await client
        .from('profiles')
        .select(`
          *,
          departments(name),
          employee_skills(*, skills(name, category)),
          experiences(*),
          projects(*),
          learning_activities(*),
          profile_snapshots(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return profile;
    },

    async updateProfile(userId: string, updates: Record<string, any>) {
      const { data, error } = await client
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async upsertEmployeeSkill(skillData: Record<string, any>) {
      const { data, error } = await client
        .from('employee_skills')
        .upsert(skillData, { onConflict: 'profile_id,skill_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async createSnapshot(snapshot: { profile_id: string; version: number; skills_summary: any; trigger: string }) {
      const { data, error } = await client
        .from('profile_snapshots')
        .insert(snapshot)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async getSnapshots(profileId: string) {
      const { data, error } = await client
        .from('profile_snapshots')
        .select('*')
        .eq('profile_id', profileId)
        .order('version', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async addExperience(exp: Record<string, any>) {
      const { data, error } = await client.from('experiences').insert(exp).select().single();
      if (error) throw error;
      return data;
    },

    async addProject(proj: Record<string, any>) {
      const { data, error } = await client.from('projects').insert(proj).select().single();
      if (error) throw error;
      return data;
    },

    async addLearningActivity(act: Record<string, any>) {
      const { data, error } = await client.from('learning_activities').insert(act).select().single();
      if (error) throw error;
      return data;
    },
  };
}
