import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { authorizeRole } from '../middleware/withRole';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getLLMProvider } from '../ai/openai_provider';
import { createInsightsService } from '../services/insights.service';
import { handleApiError } from '../middleware/withErrorHandler';

export async function handleGetTalentAvailability(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const roleErr = authorizeRole(user!, ['hr_admin']);
    if (roleErr) return roleErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createInsightsService(userClient, adminClient, getLLMProvider());

    const availability = await service.getTalentAvailability();
    return Response.json({ data: availability, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleGetRecommendationQuality(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const roleErr = authorizeRole(user!, ['hr_admin']);
    if (roleErr) return roleErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createInsightsService(userClient, adminClient, getLLMProvider());

    const quality = await service.getRecommendationQuality();
    return Response.json({ data: quality, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleGetWorkforceSupplyDemand(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const roleErr = authorizeRole(user!, ['hr_admin']);
    if (roleErr) return roleErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createInsightsService(userClient, adminClient, getLLMProvider());

    const data = await service.getWorkforceSupplyDemand();
    return Response.json({ data, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleGetSkillsHeatmap(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const roleErr = authorizeRole(user!, ['hr_admin']);
    if (roleErr) return roleErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createInsightsService(userClient, adminClient, getLLMProvider());

    const heatmap = await service.getSkillsHeatmap();
    return Response.json({ data: heatmap, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleGenerateExecutiveSummary(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const roleErr = authorizeRole(user!, ['hr_admin']);
    if (roleErr) return roleErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createInsightsService(userClient, adminClient, getLLMProvider());

    const summary = await service.getExecutiveSummary();
    return Response.json({ data: summary, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
