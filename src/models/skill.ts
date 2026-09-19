import { z } from 'zod';

export const SkillRelationTypeSchema = z.enum(['transferable', 'prerequisite', 'related']);
export type SkillRelationType = z.infer<typeof SkillRelationTypeSchema>;

export const SkillRelationSchema = z.object({
  id: z.string().uuid().optional(),
  source_skill_id: z.string().uuid(),
  target_skill_id: z.string().uuid(),
  target_skill_name: z.string().optional(),
  relation_type: SkillRelationTypeSchema,
  transferability_score: z.number().min(0).max(1),
});
export type SkillRelation = z.infer<typeof SkillRelationSchema>;

export const SkillSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Skill name is required'),
  category: z.string(),
  description: z.string().optional(),
  created_at: z.string().optional(),
  relations: z.array(SkillRelationSchema).optional(),
});
export type Skill = z.infer<typeof SkillSchema>;
