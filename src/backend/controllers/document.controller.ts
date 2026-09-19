import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createDocumentService } from '../services/document.service';
import { handleApiError } from '../middleware/withErrorHandler';
import { validateRequestBody } from '../middleware/withValidation';
import { ConfirmDocumentUploadSchema } from '@/models/document';
import { z } from 'zod';

const RequestUploadSchema = z.object({
  file_name: z.string(),
  mime_type: z.string(),
});

export async function handleRequestUploadUrl(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, RequestUploadSchema);
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createDocumentService(userClient, adminClient);

    const uploadInfo = await service.getPresignedUploadUrl(user!.id, data!.file_name, data!.mime_type);
    return Response.json({ data: uploadInfo, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleConfirmUpload(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, ConfirmDocumentUploadSchema);
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createDocumentService(userClient, adminClient);

    const doc = await service.confirmUpload(
      user!.id,
      data!.document_id,
      data!.file_name,
      data!.mime_type,
      data!.r2_object_key
    );

    return Response.json({ data: doc, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
