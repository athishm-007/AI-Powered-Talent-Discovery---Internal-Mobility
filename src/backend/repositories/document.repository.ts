import { SupabaseClient } from '@supabase/supabase-js';

export function createDocumentRepository(client: SupabaseClient) {
  return {
    async confirmDocument(documentData: { id: string; profile_id: string; file_name: string; r2_object_key: string; mime_type: string }) {
      const { data, error } = await client
        .from('documents')
        .insert(documentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async updateExtractedText(documentId: string, text: string) {
      const { data, error } = await client
        .from('documents')
        .update({ extracted_text: text, parsed_at: new Date().toISOString() })
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async deleteDocument(documentId: string) {
      const { error } = await client.from('documents').delete().eq('id', documentId);
      if (error) throw error;
    },

    async getDocumentsByProfile(profileId: string) {
      const { data, error } = await client
        .from('documents')
        .select('id, profile_id, file_name, mime_type, r2_object_key, parsed_at')
        .eq('profile_id', profileId);

      if (error) throw error;
      return data || [];
    },
  };
}
