import { z } from 'zod';

export const OpportunityTypeSchema = z.enum(['job', 'project', 'team', 'career_opportunity']);
export type OpportunityType = z.infer<typeof OpportunityTypeSchema>;

export const RoleSkillSchema = z.object({
  id: z.string().uuid().optional(),
  role_id: z.string().uuid(),
  skill_id: z.string().uuid(),
  skill_name: z.string().optional(),
  category: z.string().optional(),
  required_proficiency: z.number().int().min(1).max(5),
  importance_weight: z.number().min(0).max(1),
  feedback_modifier: z.number().min(0.5).max(1.5).default(1.0),
  is_required: z.boolean().default(true),
});
export type RoleSkill = z.infer<typeof RoleSkillSchema>;

export const RoleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2, 'Title is required'),
  department_id: z.string().uuid(),
  department_name: z.string().optional(),
  location: z.string(),
  opportunity_type: OpportunityTypeSchema,
  status: z.enum(['open', 'closed', 'draft']).default('open'),
  description: z.string(),
  min_years_exp: z.number().int().nonnegative().default(0),
  embedding: z.array(z.number()).optional(),
  embedding_model: z.string().optional(),
  embedding_updated_at: z.string().optional(),
  created_at: z.string().optional(),
  role_skills: z.array(RoleSkillSchema).optional(),
});
export type Role = z.infer<typeof RoleSchema>;

export const CreateRoleSchema = z.object({
  title: z.string().min(2, 'Role title is required'),
  department_id: z.string().uuid('Department is required'),
  location: z.string().min(2, 'Location is required'),
  opportunity_type: OpportunityTypeSchema,
  description: z.string().min(10, 'Description must be at least 10 characters'),
  min_years_exp: z.number().int().nonnegative().default(0),
  skills: z.array(
    z.object({
      skill_id: z.string().uuid(),
      required_proficiency: z.number().int().min(1).max(5),
      importance_weight: z.number().min(0).max(1),
      is_required: z.boolean().default(true),
    })
  ).min(1, 'At least one required skill must be defined'),
});
export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;
