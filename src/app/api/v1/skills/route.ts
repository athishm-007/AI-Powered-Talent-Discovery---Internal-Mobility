import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/backend/middleware/withAuth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSkillRepository } from '@/backend/repositories/skill.repository';
import { handleApiError } from '@/backend/middleware/withErrorHandler';

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const userClient = createSupabaseServerClient();
    const repo = createSkillRepository(userClient);

    const skills = await repo.getAllSkills();
    return Response.json({ data: skills, error: null, meta: { count: skills.length } });
  } catch (err) {
    return handleApiError(err);
  }
}
