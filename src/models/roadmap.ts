import { z } from 'zod';

export const LearningResourceTypeSchema = z.enum(['course', 'certification', 'project', 'learning_activity']);
export type LearningResourceType = z.infer<typeof LearningResourceTypeSchema>;

export const LearningResourceSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  provider: z.string(),
  resource_url: z.string().url(),
  type: LearningResourceTypeSchema,
  estimated_hours: z.number().int().positive(),
  target_skill_id: z.string().uuid(),
  target_skill_name: z.string().optional(),
  difficulty_level: z.string(),
  weight_modifier: z.number().min(0.5).max(1.5).default(1.0),
});
export type LearningResource = z.infer<typeof LearningResourceSchema>;

export const RoadmapPhaseSchema = z.enum(['0-3_months', '3-6_months', '6-12_months']);
export type RoadmapPhase = z.infer<typeof RoadmapPhaseSchema>;

export const RoadmapItemSchema = z.object({
  id: z.string().uuid(),
  roadmap_id: z.string().uuid(),
  phase: RoadmapPhaseSchema,
  title: z.string(),
  description: z.string(),
  resource_id: z.string().uuid().nullable().optional(),
  resource: LearningResourceSchema.optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  completed_at: z.string().nullable().optional(),
});
export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;

export const RoadmapSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  target_role_id: z.string().uuid(),
  target_role_title: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed']).default('in_progress'),
  overall_progress_pct: z.number().min(0).max(100).default(0),
  created_at: z.string().optional(),
  items: z.array(RoadmapItemSchema).default([]),
});
export type Roadmap = z.infer<typeof RoadmapSchema>;

export const UpdateRoadmapItemStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed']),
});
export type UpdateRoadmapItemStatusInput = z.infer<typeof UpdateRoadmapItemStatusSchema>;
