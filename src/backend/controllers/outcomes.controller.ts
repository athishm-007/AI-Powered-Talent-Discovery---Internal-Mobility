import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createFeedbackService } from '../services/feedback.service';
import { handleApiError } from '../middleware/withErrorHandler';
import { validateRequestBody } from '../middleware/withValidation';
import { LogOutcomeSchema } from '@/models/feedback';

export async function handleLogOutcome(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, LogOutcomeSchema);
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createFeedbackService(userClient, adminClient);

    const outcome = await service.logOutcome(
      user!.id,
      data!.outcome_type,
      data!.target_id,
      data!.details
    );

    return Response.json({ data: outcome, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
