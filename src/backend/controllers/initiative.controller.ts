import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { authorizeRole } from '../middleware/withRole';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createInitiativeService } from '../services/initiative.service';
import { handleApiError } from '../middleware/withErrorHandler';
import { validateRequestBody } from '../middleware/withValidation';
import { CreateInitiativeSchema } from '@/models/initiative';

export async function handleGetAllInitiatives(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const roleErr = authorizeRole(user!, ['hr_admin']);
    if (roleErr) return roleErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createInitiativeService(userClient, adminClient);

    const initiatives = await service.getAllInitiatives();
    return Response.json({ data: initiatives, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleCreateInitiative(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const roleErr = authorizeRole(user!, ['hr_admin']);
    if (roleErr) return roleErr;

    const { data, errorResponse: valErr } = await validateRequestBody(req, CreateInitiativeSchema);
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createInitiativeService(userClient, adminClient);

    const { skills, ...initFields } = data!;
    const newInit = await service.createInitiative(initFields, skills);

    return Response.json({ data: newInit, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
