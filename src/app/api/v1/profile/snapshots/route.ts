import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/backend/middleware/withAuth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createProfileRepository } from '@/backend/repositories/profile.repository';
import { handleApiError } from '@/backend/middleware/withErrorHandler';

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const userClient = createSupabaseServerClient();
    const repo = createProfileRepository(userClient);

    const snapshots = await repo.getSnapshots(user!.id);
    return Response.json({ data: snapshots, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
