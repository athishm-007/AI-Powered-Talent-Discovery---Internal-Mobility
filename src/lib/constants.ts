export const MATCH_WEIGHTS = {
  SKILL_COVERAGE: 0.35,      // w1
  VECTOR_SIMILARITY: 0.30,   // w2
  TRANSFERABLE_CREDIT: 0.20,  // w3
  EXPERIENCE_RELEVANCE: 0.15 // w4
} as const;

export const MIN_FEEDBACK_SAMPLES = 5;
export const SMOOTHING_FACTOR_M = 2; // m
export const SCALING_FACTOR_K = 0.5;   // k

export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';
export const VECTOR_DIMENSION = 1536;

export const DEMO_ACCOUNTS = {
  HR_ADMIN: {
    email: 'admin@talentlens.ai',
    name: 'HR Admin (Enterprise)',
    role: 'hr_admin' as const,
  },
  EMPLOYEE_1: {
    email: 'alex.chen@talentlens.ai',
    name: 'Alex Chen',
    role: 'employee' as const,
  },
  EMPLOYEE_2: {
    email: 'sarah.jenkins@talentlens.ai',
    name: 'Sarah Jenkins',
    role: 'employee' as const,
  },
};
