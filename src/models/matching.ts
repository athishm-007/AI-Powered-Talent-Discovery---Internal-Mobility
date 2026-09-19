import { z } from 'zod';

export const CitedEvidenceSchema = z.object({
  type: z.enum(['experience', 'project', 'skill', 'learning']),
  id: z.string(),
  description: z.string().optional(),
});
export type CitedEvidence = z.infer<typeof CitedEvidenceSchema>;

export const MatchedSkillDetailSchema = z.object({
  skill_id: z.string(),
  skill_name: z.string(),
  user_proficiency: z.number(),
  required_proficiency: z.number(),
  coverage_score: z.number(),
  is_transferable: z.boolean().default(false),
});
export type MatchedSkillDetail = z.infer<typeof MatchedSkillDetailSchema>;

export const MatchResultSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  role_id: z.string().uuid(),
  role_title: z.string().optional(),
  department_name: z.string().optional(),
  opportunity_type: z.string().optional(),
  location: z.string().optional(),
  overall_score: z.number().min(0).max(1),
  skill_coverage_score: z.number().min(0).max(1),
  vector_similarity_score: z.number().min(0).max(1),
  transferable_credit_score: z.number().min(0).max(1),
  experience_relevance_score: z.number().min(0).max(1),
  explanation_text: z.string(),
  cited_evidence_ids: z.array(CitedEvidenceSchema).default([]),
  matched_skills: z.array(MatchedSkillDetailSchema).default([]),
  missing_skills: z.array(MatchedSkillDetailSchema).default([]),
  is_stale: z.boolean().default(false),
  created_at: z.string().optional(),
});
export type MatchResult = z.infer<typeof MatchResultSchema>;
