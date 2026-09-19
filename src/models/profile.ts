import { z } from 'zod';

export const ExplicitInferredSourceSchema = z.enum(['explicit', 'inferred']);
export type ExplicitInferredSource = z.infer<typeof ExplicitInferredSourceSchema>;

export const EmployeeSkillSchema = z.object({
  id: z.string().uuid().optional(),
  profile_id: z.string().uuid(),
  skill_id: z.string().uuid(),
  skill_name: z.string().optional(),
  category: z.string().optional(),
  proficiency_level: z.number().int().min(1).max(5),
  source: ExplicitInferredSourceSchema,
  confidence_score: z.number().min(0).max(1),
  evidence_snippets: z.array(z.string()).default([]),
  created_at: z.string().optional(),
});
export type EmployeeSkill = z.infer<typeof EmployeeSkillSchema>;

export const ExperienceSchema = z.object({
  id: z.string().uuid().optional(),
  profile_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  description: z.string(),
  skills_used: z.array(z.string()).default([]),
});
export type Experience = z.infer<typeof ExperienceSchema>;

export const ProjectSchema = z.object({
  id: z.string().uuid().optional(),
  profile_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  role_name: z.string().min(1, 'Role name is required'),
  description: z.string(),
  outcomes: z.string().optional(),
  technologies: z.array(z.string()).default([]),
});
export type Project = z.infer<typeof ProjectSchema>;

export const LearningActivitySchema = z.object({
  id: z.string().uuid().optional(),
  profile_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  activity_type: z.string(),
  status: z.enum(['planned', 'in_progress', 'completed']).default('completed'),
  completion_date: z.string().optional(),
  skills_acquired: z.array(z.string()).default([]),
});
export type LearningActivity = z.infer<typeof LearningActivitySchema>;

export const ProfileSnapshotSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  version: z.number().int(),
  skills_summary: z.record(z.any()),
  trigger: z.enum(['resume', 'experience', 'project', 'learning', 'manual']),
  created_at: z.string(),
});
export type ProfileSnapshot = z.infer<typeof ProfileSnapshotSchema>;

export const ProfileSchema = z.object({
  user_id: z.string().uuid(),
  department_id: z.string().uuid().nullable().optional(),
  department_name: z.string().optional(),
  full_name: z.string(),
  email: z.string().email(),
  role_title: z.string(),
  bio: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  future_potential_summary: z.string().nullable().optional(),
  embedding: z.array(z.number()).optional(),
  embedding_model: z.string().optional(),
  embedding_updated_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  skills: z.array(EmployeeSkillSchema).optional(),
  experiences: z.array(ExperienceSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  learning_activities: z.array(LearningActivitySchema).optional(),
  snapshots: z.array(ProfileSnapshotSchema).optional(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const UpdateProfileSchema = z.object({
  full_name: z.string().min(2).optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  role_title: z.string().optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
