import { SupabaseClient } from '@supabase/supabase-js';

export function createAuditRepository(client: SupabaseClient) {
  return {
    async logAuditEvent(actorId: string | null, action: string, resourceType: string, resourceId: string, metadata: Record<string, any> = {}) {
      // Ensure NO PII is written to audit logs
      const cleanMetadata = { ...metadata };
      delete cleanMetadata.email;
      delete cleanMetadata.full_name;
      delete cleanMetadata.password;

      const { error } = await client.from('audit_logs').insert({
        actor_id: actorId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        metadata: cleanMetadata,
      });

      if (error) console.error('Failed to log audit event:', error);
    },

    async getAuditLogs() {
      const { data, error } = await client
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
  };
}
