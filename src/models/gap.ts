import { z } from 'zod';

export const GapSeveritySchema = z.enum(['CRITICAL', 'MODERATE', 'MINOR']);
export type GapSeverity = z.infer<typeof GapSeveritySchema>;

export const MissingSkillGapSchema = z.object({
  skill_id: z.string().uuid(),
  skill_name: z.string(),
  category: z.string(),
  user_proficiency: z.number().int().min(0).max(5),
  required_proficiency: z.number().int().min(1).max(5),
  severity: GapSeveritySchema,
  estimated_time_to_close: z.string(), // e.g. "2-4 weeks"
  recommended_resource_ids: z.array(z.string().uuid()).default([]),
});
export type MissingSkillGap = z.infer<typeof MissingSkillGapSchema>;

export const SkillGapAnalysisSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  target_role_id: z.string().uuid(),
  target_role_title: z.string().optional(),
  gap_score: z.number().min(0).max(1),
  missing_skills: z.array(MissingSkillGapSchema).default([]),
  created_at: z.string().optional(),
});
export type SkillGapAnalysis = z.infer<typeof SkillGapAnalysisSchema>;
