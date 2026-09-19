import { SupabaseClient } from '@supabase/supabase-js';

export function createRoadmapRepository(client: SupabaseClient) {
  return {
    async getRoadmapForProfile(profileId: string) {
      const { data, error } = await client
        .from('roadmaps')
        .select(`
          *,
          roles(title, departments(name)),
          roadmap_items(*, learning_resources(*))
        `)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async createRoadmap(roadmapData: Record<string, any>, items: Array<Record<string, any>>) {
      const { data: roadmap, error: rErr } = await client
        .from('roadmaps')
        .insert(roadmapData)
        .select()
        .single();

      if (rErr) throw rErr;

      if (items.length > 0) {
        const roadmapItems = items.map((i) => ({ ...i, roadmap_id: roadmap.id }));
        const { error: iErr } = await client.from('roadmap_items').insert(roadmapItems);
        if (iErr) throw iErr;
      }

      return roadmap;
    },

    async updateRoadmapItemStatus(itemId: string, status: 'pending' | 'in_progress' | 'completed') {
      const { data, error } = await client
        .from('roadmap_items')
        .update({ status })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async getAllLearningResources() {
      const { data, error } = await client
        .from('learning_resources')
        .select('*, skills(name)');

      if (error) throw error;
      return data || [];
    },
  };
}
