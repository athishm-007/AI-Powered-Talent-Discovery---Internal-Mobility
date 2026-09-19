import { SupabaseClient } from '@supabase/supabase-js';

export function createRoleRepository(client: SupabaseClient) {
  return {
    async getAllOpenRoles() {
      const { data, error } = await client
        .from('roles')
        .select(`
          *,
          departments(name),
          role_skills(*, skills(name, category))
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async getRoleById(roleId: string) {
      const { data, error } = await client
        .from('roles')
        .select(`
          *,
          departments(name),
          role_skills(*, skills(name, category))
        `)
        .eq('id', roleId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async createRole(role: Record<string, any>, skills: Array<Record<string, any>>) {
      const { data: newRole, error: roleErr } = await client.from('roles').insert(role).select().single();
      if (roleErr) throw roleErr;

      if (skills.length > 0) {
        const roleSkills = skills.map((s) => ({ ...s, role_id: newRole.id }));
        const { error: skillsErr } = await client.from('role_skills').insert(roleSkills);
        if (skillsErr) throw skillsErr;
      }

      return newRole;
    },

    async updateRole(roleId: string, updates: Record<string, any>) {
      const { data, error } = await client.from('roles').update(updates).eq('id', roleId).select().single();
      if (error) throw error;
      return data;
    },
  };
}
