import { SupabaseClient } from '@supabase/supabase-js';
import { createInitiativeRepository } from '../repositories/initiative.repository';

export function createInitiativeService(userClient: SupabaseClient, adminClient: SupabaseClient) {
  const userInitRepo = createInitiativeRepository(userClient);

  return {
    async getAllInitiatives() {
      return userInitRepo.getAllInitiatives();
    },

    async createInitiative(initiativeData: Record<string, any>, skills: Array<Record<string, any>>) {
      return userInitRepo.createInitiative(initiativeData, skills);
    },

    async getAggregatedDemandHintsForEmployees() {
      // Returns ONLY aggregated skill names and demand levels for employee view
      const { data, error } = await adminClient
        .from('initiative_skills')
        .select('skill_id, required_count, target_proficiency, skills(name)');

      if (error) throw error;
      return data || [];
    },
  };
}
