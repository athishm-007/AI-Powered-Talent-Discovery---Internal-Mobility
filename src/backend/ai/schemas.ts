import { z } from 'zod';

export const ExtractedSkillSchema = z.object({
  name: z.string(),
  category: z.string(),
  proficiency_level: z.number().int().min(1).max(5),
  source: z.enum(['explicit', 'inferred']),
  confidence_score: z.number().min(0).max(1),
  evidence_snippets: z.array(z.string()),
});

export const ExtractedProfileAnalysisSchema = z.object({
  explicit_skills: z.array(ExtractedSkillSchema),
  inferred_skills: z.array(ExtractedSkillSchema),
  future_potential_summary: z.string(),
});
export type ExtractedProfileAnalysis = z.infer<typeof ExtractedProfileAnalysisSchema>;

export const LLMMatchExplanationSchema = z.object({
  explanation_text: z.string(),
  cited_evidence_ids: z.array(
    z.object({
      type: z.enum(['experience', 'project', 'skill', 'learning']),
      id: z.string(),
      description: z.string().optional(),
    })
  ),
});

export const LLMRoadmapGenerationSchema = z.object({
  phases: z.array(
    z.object({
      phase: z.enum(['0-3_months', '3-6_months', '6-12_months']),
      items: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          resource_title: z.string().optional(),
        })
      ),
    })
  ),
});
