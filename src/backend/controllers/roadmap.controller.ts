import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getLLMProvider } from '../ai/openai_provider';
import { createRoadmapService } from '../services/roadmap.service';
import { handleApiError } from '../middleware/withErrorHandler';
import { validateRequestBody } from '../middleware/withValidation';
import { UpdateRoadmapItemStatusSchema } from '@/models/roadmap';
import { z } from 'zod';

const GenerateRoadmapSchema = z.object({
  target_role_id: z.string().uuid(),
});

export async function handleGetRoadmap(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createRoadmapService(userClient, adminClient, getLLMProvider());

    const roadmap = await service.getRoadmapForEmployee(user!.id);
    return Response.json({ data: roadmap, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleGenerateRoadmap(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, GenerateRoadmapSchema);
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createRoadmapService(userClient, adminClient, getLLMProvider());

    const roadmap = await service.generateRoadmapForTargetRole(user!.id, data!.target_role_id);
    return Response.json({ data: roadmap, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleUpdateRoadmapItemStatus(req: NextRequest, itemId: string) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, UpdateRoadmapItemStatusSchema);
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createRoadmapService(userClient, adminClient, getLLMProvider());

    const updatedItem = await service.updateItemStatus(user!.id, itemId, data!.status);
    return Response.json({ data: updatedItem, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
