import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_URL is required'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().default('http://localhost:3000'),
  ALLOWED_EMAIL_DOMAINS: z.string().default('talentlens.ai,company.com'),
  DEMO_MODE: z.string().optional().default('true'),
  NEXT_PUBLIC_DEMO_MODE: z.string().optional().default('true'),
  SEED_ADMIN_PASSWORD: z.string().optional().default('hradmin123'),
  SEED_EMPLOYEE_PASSWORD: z.string().optional().default('employee123'),
  AI_PROVIDER: z.enum(['openai', 'anthropic', 'openrouter', 'fallback']).optional().default('fallback'),
  OPENAI_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.warn('⚠️ Environment Validation Warning:', result.error.flatten().fieldErrors);
  }
  return result.success ? result.data : envSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  });
}
