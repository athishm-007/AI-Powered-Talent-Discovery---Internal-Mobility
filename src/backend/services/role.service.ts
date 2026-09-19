import { SupabaseClient } from '@supabase/supabase-js';
import { createRoleRepository } from '../repositories/role.repository';
import { LLMProvider } from '../ai/llm_provider';

export function createRoleService(userClient: SupabaseClient, adminClient: SupabaseClient, llm: LLMProvider) {
  const userRoleRepo = createRoleRepository(userClient);
  const adminRoleRepo = createRoleRepository(adminClient);

  return {
    async getAllOpenRoles() {
      return userRoleRepo.getAllOpenRoles();
    },

    async getRoleById(roleId: string) {
      return userRoleRepo.getRoleById(roleId);
    },

    async createRole(roleData: Record<string, any>, skills: Array<Record<string, any>>) {
      const newRole = await userRoleRepo.createRole(roleData, skills);

      // Generate embedding using admin client
      const textToEmbed = `${newRole.title} ${newRole.description}`;
      const vector = await llm.generateEmbedding(textToEmbed);

      await adminRoleRepo.updateRole(newRole.id, {
        embedding: vector,
        embedding_model: 'text-embedding-3-small',
        embedding_updated_at: new Date().toISOString(),
      });

      return newRole;
    },
  };
}
