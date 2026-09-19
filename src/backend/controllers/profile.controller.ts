import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getLLMProvider } from '../ai/openai_provider';
import { createProfilingService } from '../services/profiling.service';
import { handleApiError } from '../middleware/withErrorHandler';
import { validateRequestBody } from '../middleware/withValidation';
import { UpdateProfileSchema, ExperienceSchema, ProjectSchema, LearningActivitySchema } from '@/models/profile';

export async function handleGetProfile(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createProfilingService(userClient, adminClient, getLLMProvider());

    const profile = await service.getProfile(user!.id);
    return Response.json({ data: profile, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleUpdateProfile(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, UpdateProfileSchema);
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createProfilingService(userClient, adminClient, getLLMProvider());

    const updated = await service.updateProfile(user!.id, data!);
    return Response.json({ data: updated, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleAddExperience(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, ExperienceSchema.omit({ profile_id: true }));
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createProfilingService(userClient, adminClient, getLLMProvider());

    const exp = await service.addExperienceAndReanalyze(user!.id, data!);
    return Response.json({ data: exp, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleAddProject(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, ProjectSchema.omit({ profile_id: true }));
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createProfilingService(userClient, adminClient, getLLMProvider());

    const proj = await service.addProjectAndReanalyze(user!.id, data!);
    return Response.json({ data: proj, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleAddLearning(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const { data, errorResponse: valErr } = await validateRequestBody(req, LearningActivitySchema.omit({ profile_id: true }));
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createProfilingService(userClient, adminClient, getLLMProvider());

    const act = await service.addLearningAndReanalyze(user!.id, data!);
    return Response.json({ data: act, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
