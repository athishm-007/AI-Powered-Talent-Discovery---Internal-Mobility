import { z } from 'zod';

export const RecommendationItemTypeSchema = z.enum(['match', 'gap', 'resource', 'roadmap']);
export type RecommendationItemType = z.infer<typeof RecommendationItemTypeSchema>;

export const RecommendationFeedbackSchema = z.object({
  id: z.string().uuid().optional(),
  profile_id: z.string().uuid(),
  item_type: RecommendationItemTypeSchema,
  item_id: z.string().uuid(),
  is_helpful: z.boolean(),
  reason: z.string().optional(),
  created_at: z.string().optional(),
});
export type RecommendationFeedback = z.infer<typeof RecommendationFeedbackSchema>;

export const SubmitFeedbackSchema = z.object({
  item_type: RecommendationItemTypeSchema,
  item_id: z.string().uuid(),
  is_helpful: z.boolean(),
  reason: z.string().optional(),
});
export type SubmitFeedbackInput = z.infer<typeof SubmitFeedbackSchema>;

export const OutcomeTypeSchema = z.enum(['applied', 'promoted', 'moved', 'completed_course']);
export type OutcomeType = z.infer<typeof OutcomeTypeSchema>;

export const CareerOutcomeSchema = z.object({
  id: z.string().uuid().optional(),
  profile_id: z.string().uuid(),
  outcome_type: OutcomeTypeSchema,
  target_id: z.string().uuid(), // role_id or learning_resource_id
  details: z.record(z.any()).default({}),
  logged_at: z.string().optional(),
});
export type CareerOutcome = z.infer<typeof CareerOutcomeSchema>;

export const LogOutcomeSchema = z.object({
  outcome_type: OutcomeTypeSchema,
  target_id: z.string().uuid(),
  details: z.record(z.any()).optional().default({}),
});
export type LogOutcomeInput = z.infer<typeof LogOutcomeSchema>;
