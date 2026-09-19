import { LLMProvider } from './llm_provider';
import { ZodSchema } from 'zod';

export class FallbackProvider implements LLMProvider {
  async completeJSON<T>(prompt: string, systemPrompt: string, schema: ZodSchema<T>): Promise<T> {
    const promptLower = prompt.toLowerCase();

    // Profiling fallback
    if (systemPrompt.includes('profiler') || promptLower.includes('experience') || promptLower.includes('resume')) {
      const fallbackProfile = {
        explicit_skills: [
          { name: 'TypeScript', category: 'Software Engineering', proficiency_level: 4, source: 'explicit', confidence_score: 1.0, evidence_snippets: ['Derived from technical project history'] },
          { name: 'React & Next.js', category: 'Frontend Architecture', proficiency_level: 4, source: 'explicit', confidence_score: 0.95, evidence_snippets: ['Verified in Web App modernization project'] },
        ],
        inferred_skills: [
          { name: 'Vector Embeddings & RAG', category: 'Artificial Intelligence', proficiency_level: 3, source: 'inferred', confidence_score: 0.85, evidence_snippets: ['Transferable from data pipeline and backend design experience'] },
          { name: 'SQL & Postgres Database Tuning', category: 'Data Infrastructure', proficiency_level: 3, source: 'inferred', confidence_score: 0.80, evidence_snippets: ['Inferred from relational schema design'] },
        ],
        future_potential_summary: 'High potential for transition into Staff Leadership, Strategic AI Systems Architecture, and Enterprise Technical Product Leadership.',
      };
      return schema.parse(fallbackProfile);
    }

    // Matching fallback
    if (systemPrompt.includes('matching engine')) {
      const fallbackMatch = {
        explanation_text: 'The employee demonstrates strong technical alignment across core requirements, backed by verified experience in frontend architecture and backend data systems.',
        cited_evidence_ids: [
          { type: 'experience', id: 'exp-1', description: 'Enterprise Platform Modernization' },
          { type: 'project', id: 'proj-1', description: 'Next.js App Router Architecture' },
        ],
      };
      return schema.parse(fallbackMatch);
    }

    // Roadmap fallback
    if (systemPrompt.includes('career development strategist')) {
      const fallbackRoadmap = {
        phases: [
          {
            phase: '0-3_months',
            items: [
              { title: 'Complete Vector Search & RAG Systems Course', description: 'Focus on embedding models and pgvector similarity tuning.', resource_title: 'Advanced Vector Search & RAG Systems' },
            ],
          },
          {
            phase: '3-6_months',
            items: [
              { title: 'Lead AI Feature Prototype in Sprint', description: 'Apply RAG knowledge to real internal mobility feature.' },
            ],
          },
          {
            phase: '6-12_months',
            items: [
              { title: 'Shadow Lead Systems Architect', description: 'Participate in architectural review meetings for enterprise deployment.' },
            ],
          },
        ],
      };
      return schema.parse(fallbackRoadmap);
    }

    // Generic JSON fallback
    const genericObj = { status: 'success', fallback: true };
    return schema.parse(genericObj as any);
  }

  async streamText(prompt: string, systemPrompt: string, onChunk: (text: string) => void): Promise<string> {
    const text = `Based on your profile experience and skill portfolio, you are well-positioned for internal mobility opportunities. 

Key Strengths Identified:
- Strong proficiency in Component Architecture and Frontend Systems
- Proven track record of cross-functional enterprise project delivery

Recommended Action Items:
1. Review the recommended learning resources on your Mobility Roadmap.
2. Express Interest in the Staff AI Systems Architect or Full-Stack Tech Lead opportunity.`;

    const chunks = text.split(' ');
    let fullText = '';
    for (const chunk of chunks) {
      fullText += chunk + ' ';
      onChunk(chunk + ' ');
      await new Promise((res) => setTimeout(res, 25));
    }

    return fullText.trim();
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Generate exact 1536-dimensional deterministic vector
    const vector = new Array(1536);
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    for (let i = 0; i < 1536; i++) {
      vector[i] = Math.sin(hash + i) * 0.05;
    }

    return vector;
  }
}
