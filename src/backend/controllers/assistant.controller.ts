import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getLLMProvider } from '../ai/openai_provider';
import { createAssistantService } from '../services/assistant.service';
import { handleApiError } from '../middleware/withErrorHandler';
import { validateRequestBody } from '../middleware/withValidation';
import { SendMessageSchema } from '@/models/chat';

export async function handleAssistantChat(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, SendMessageSchema);
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createAssistantService(userClient, adminClient, getLLMProvider());

    const result = await service.handleUserMessage(user!.id, data!.message, () => {});
    return Response.json({ data: result, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleGetAssistantSession(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createAssistantService(userClient, adminClient, getLLMProvider());

    const session = await service.getSession(user!.id);
    return Response.json({ data: session, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
