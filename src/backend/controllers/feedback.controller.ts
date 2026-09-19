import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createFeedbackService } from '../services/feedback.service';
import { handleApiError } from '../middleware/withErrorHandler';
import { validateRequestBody } from '../middleware/withValidation';
import { SubmitFeedbackSchema } from '@/models/feedback';

export async function handleSubmitFeedback(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, SubmitFeedbackSchema);
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createFeedbackService(userClient, adminClient);

    const feedback = await service.submitFeedback(
      user!.id,
      data!.item_type,
      data!.item_id,
      data!.is_helpful,
      data!.reason
    );

    return Response.json({ data: feedback, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
