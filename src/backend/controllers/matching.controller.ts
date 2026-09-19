import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getLLMProvider } from '../ai/openai_provider';
import { createMatchingService } from '../services/matching.service';
import { handleApiError } from '../middleware/withErrorHandler';

export async function handleGetMatches(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createMatchingService(userClient, adminClient, getLLMProvider());

    const matches = await service.getMatchesForEmployee(user!.id);
    return Response.json({ data: matches, error: null, meta: { count: matches.length } });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleGetMatchDetail(req: NextRequest, roleId: string) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createMatchingService(userClient, adminClient, getLLMProvider());

    const matchDetail = await service.getMatchDetail(user!.id, roleId);
    return Response.json({ data: matchDetail, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
