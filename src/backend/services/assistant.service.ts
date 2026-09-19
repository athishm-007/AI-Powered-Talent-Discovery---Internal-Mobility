import { SupabaseClient } from '@supabase/supabase-js';
import { createAssistantRepository } from '../repositories/assistant.repository';
import { createProfileRepository } from '../repositories/profile.repository';
import { createMatchRepository } from '../repositories/match.repository';
import { LLMProvider } from '../ai/llm_provider';
import { SYSTEM_PROMPTS, wrapPromptXml } from '../ai/prompts';

export function createAssistantService(userClient: SupabaseClient, adminClient: SupabaseClient, llm: LLMProvider) {
  const userAssistantRepo = createAssistantRepository(userClient);
  const userProfileRepo = createProfileRepository(userClient);
  const userMatchRepo = createMatchRepository(userClient);

  return {
    async getSession(profileId: string) {
      return userAssistantRepo.getOrCreateSession(profileId);
    },

    async handleUserMessage(profileId: string, messageText: string, onChunk: (chunk: string) => void) {
      const session = await userAssistantRepo.getOrCreateSession(profileId);
      await userAssistantRepo.saveMessage(session.id, 'user', messageText);

      // Fetch user context (Strictly profileId from verified JWT)
      const profile = await userProfileRepo.getProfileByUserId(profileId);
      const matches = await userMatchRepo.getMatchesForProfile(profileId);

      const userContext = JSON.stringify({
        profile: { full_name: profile?.full_name, role_title: profile?.role_title, skills: profile?.employee_skills },
        topMatches: (matches || []).slice(0, 3).map((m: any) => ({ role: m.roles?.title, score: m.overall_score })),
      });

      const prompt = `User Question: "${messageText}"\n${wrapPromptXml('USER_CONTEXT', userContext)}`;
      const reply = await llm.streamText(prompt, SYSTEM_PROMPTS.ASSISTANT, onChunk);

      const citedSources = (matches || []).slice(0, 2).map((m: any) => ({
        type: 'match' as const,
        id: m.role_id,
        title: m.roles?.title || 'Matched Role',
      }));

      await userAssistantRepo.saveMessage(session.id, 'assistant', reply, citedSources);

      return { sessionId: session.id, reply, citedSources };
    },
  };
}
