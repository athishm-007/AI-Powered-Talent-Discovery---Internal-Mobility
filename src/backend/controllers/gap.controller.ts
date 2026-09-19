import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createGapAnalysisService } from '../services/gap_analysis.service';
import { handleApiError } from '../middleware/withErrorHandler';

export async function handleGetGapAnalysis(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const targetRoleId = searchParams.get('roleId');

    if (!targetRoleId) {
      return Response.json(
        { data: null, error: { code: 'MISSING_PARAM', message: 'roleId parameter is required' }, meta: {} },
        { status: 400 }
      );
    }

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createGapAnalysisService(userClient, adminClient);

    const gap = await service.getGapAnalysis(user!.id, targetRoleId);
    return Response.json({ data: gap, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
