import { z } from 'zod';

export const InitiativeSkillSourceSchema = z.enum(['hr_defined', 'ai_predicted']);
export type InitiativeSkillSource = z.infer<typeof InitiativeSkillSourceSchema>;

export const InitiativeSkillSchema = z.object({
  id: z.string().uuid().optional(),
  initiative_id: z.string().uuid(),
  skill_id: z.string().uuid(),
  skill_name: z.string().optional(),
  category: z.string().optional(),
  required_count: z.number().int().positive(),
  target_proficiency: z.number().int().min(1).max(5),
  source: InitiativeSkillSourceSchema.default('hr_defined'),
  rationale: z.string().optional(),
});
export type InitiativeSkill = z.infer<typeof InitiativeSkillSchema>;

export const InitiativeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2, 'Title is required'),
  description: z.string(),
  target_quarter: z.string(),
  status: z.enum(['planned', 'active', 'completed']).default('active'),
  department_id: z.string().uuid(),
  department_name: z.string().optional(),
  embedding: z.array(z.number()).optional(),
  embedding_model: z.string().optional(),
  created_at: z.string().optional(),
  initiative_skills: z.array(InitiativeSkillSchema).optional(),
});
export type Initiative = z.infer<typeof InitiativeSchema>;

export const CreateInitiativeSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  target_quarter: z.string().min(2, 'Target quarter (e.g. Q4 2026) is required'),
  department_id: z.string().uuid('Department is required'),
  skills: z.array(
    z.object({
      skill_id: z.string().uuid(),
      required_count: z.number().int().positive(),
      target_proficiency: z.number().int().min(1).max(5),
      source: InitiativeSkillSourceSchema.default('hr_defined'),
      rationale: z.string().optional(),
    })
  ).min(1, 'At least one skill requirement is required'),
});
export type CreateInitiativeInput = z.infer<typeof CreateInitiativeSchema>;
