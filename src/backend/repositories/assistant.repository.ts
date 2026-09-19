import { SupabaseClient } from '@supabase/supabase-js';

export function createAssistantRepository(client: SupabaseClient) {
  return {
    async getOrCreateSession(profileId: string) {
      const { data: existing } = await client
        .from('chat_sessions')
        .select('*, chat_messages(*)')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) return existing;

      const { data: newSession, error } = await client
        .from('chat_sessions')
        .insert({ profile_id: profileId, title: 'AI Career Assistant' })
        .select()
        .single();

      if (error) throw error;
      return { ...newSession, chat_messages: [] };
    },

    async saveMessage(sessionId: string, sender: 'user' | 'assistant', content: string, citedSources: any[] = []) {
      const { data, error } = await client
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          sender,
          content,
          cited_sources: citedSources,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  };
}
