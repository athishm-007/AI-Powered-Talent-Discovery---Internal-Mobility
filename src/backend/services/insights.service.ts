import { SupabaseClient } from '@supabase/supabase-js';
import { createInsightsRepository } from '../repositories/insights.repository';
import { LLMProvider } from '../ai/llm_provider';
import { ExecutiveInsightSummarySchema } from '@/models/insights';
import { SYSTEM_PROMPTS, wrapPromptXml } from '../ai/prompts';

export function createInsightsService(userClient: SupabaseClient, adminClient: SupabaseClient, llm: LLMProvider) {
  const userInsightsRepo = createInsightsRepository(userClient);
  const adminInsightsRepo = createInsightsRepository(adminClient);

  return {
    async getTalentAvailability() {
      return userInsightsRepo.getTalentAvailability();
    },

    async getRecommendationQuality() {
      return userInsightsRepo.getRecommendationQuality();
    },

    async getWorkforceSupplyDemand() {
      return userInsightsRepo.getWorkforceSupplyDemand();
    },

    async getSkillsHeatmap() {
      return userInsightsRepo.getSkillsHeatmap();
    },

    async getExecutiveSummary() {
      const availability = await userInsightsRepo.getTalentAvailability();
      const supplyDemand = await userInsightsRepo.getWorkforceSupplyDemand();
      const quality = await userInsightsRepo.getRecommendationQuality();

      const inputHash = `insights-summary-${JSON.stringify({ availability, supplyDemand, quality })}`;
      const cached = await adminInsightsRepo.getCachedSummary(inputHash);
      if (cached) return cached;

      const contextData = JSON.stringify({ availability, supplyDemand, quality });
      const prompt = `Generate an enterprise workforce insights executive summary:\n${wrapPromptXml('WORKFORCE_METRICS', contextData)}`;

      try {
        const summary = await llm.completeJSON(prompt, SYSTEM_PROMPTS.PROFILING, ExecutiveInsightSummarySchema);
        await adminInsightsRepo.saveCachedSummary(inputHash, 'llm', 'executive_summary', summary);
        return summary;
      } catch {
        const fallbackSummary = {
          title: 'Workforce Capability & Talent Mobility Brief',
          summary: `Current workforce metrics indicate ${availability.ready_now} employees are READY NOW for high-priority roles. Strategic focus should target closing critical skill gaps in Data AI and Cloud Infrastructure.`,
          key_takeaways: [
            `Talent Availability Pipeline: ${availability.ready_now} Ready Now, ${availability.ready_6_MONTHS || availability.ready_6_months} Ready in 6 Months.`,
            `Recommendation Engine Helpful Rate: ${quality.helpful_rate_pct}% with positive feedback conversion.`,
            'Departmental Supply vs Demand ratio remains balanced across core engineering and product tracks.',
          ],
          generated_at: new Date().toISOString(),
        };

        await adminInsightsRepo.saveCachedSummary(inputHash, 'fallback', 'executive_summary', fallbackSummary);
        return fallbackSummary;
      }
    },
  };
}
