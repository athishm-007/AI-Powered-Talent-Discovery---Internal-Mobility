import { z } from 'zod';

export const TalentAvailabilitySchema = z.object({
  ready_now: z.number().int().nonnegative(),
  ready_6_months: z.number().int().nonnegative(),
  developing: z.number().int().nonnegative(),
});
export type TalentAvailability = z.infer<typeof TalentAvailabilitySchema>;

export const WorkforceSupplyDemandSchema = z.object({
  department_id: z.string(),
  department_name: z.string(),
  skill_supply_count: z.number().int(),
  skill_demand_count: z.number().int(),
  ratio: z.number(),
});
export type WorkforceSupplyDemand = z.infer<typeof WorkforceSupplyDemandSchema>;

export const SkillHeatmapItemSchema = z.object({
  skill_name: z.string(),
  category: z.string(),
  supply_level: z.number(),
  demand_level: z.number(),
  gap_intensity: z.enum(['CRITICAL', 'MODERATE', 'STABLE']),
});
export type SkillHeatmapItem = z.infer<typeof SkillHeatmapItemSchema>;

export const RecommendationQualitySchema = z.object({
  helpful_rate_pct: z.number(),
  outcome_conversion_pct: z.number(),
  total_feedback_count: z.number(),
  trend: z.enum(['upward', 'stable', 'downward']),
});
export type RecommendationQuality = z.infer<typeof RecommendationQualitySchema>;

export const ExecutiveInsightSummarySchema = z.object({
  title: z.string(),
  summary: z.string(),
  key_takeaways: z.array(z.string()),
  generated_at: z.string(),
});
export type ExecutiveInsightSummary = z.infer<typeof ExecutiveInsightSummarySchema>;
