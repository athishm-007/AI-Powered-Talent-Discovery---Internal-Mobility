import { NextRequest } from 'next/server';
import { authenticateRequest } from '../middleware/withAuth';
import { authorizeRole } from '../middleware/withRole';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getLLMProvider } from '../ai/openai_provider';
import { createRoleService } from '../services/role.service';
import { handleApiError } from '../middleware/withErrorHandler';
import { validateRequestBody } from '../middleware/withValidation';
import { CreateRoleSchema } from '@/models/role';

export async function handleGetAllRoles(req: NextRequest) {
  try {
    const { errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createRoleService(userClient, adminClient, getLLMProvider());

    const roles = await service.getAllOpenRoles();
    return Response.json({ data: roles, error: null, meta: { count: roles.length } });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function handleCreateRole(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const roleErr = authorizeRole(user!, ['hr_admin']);
    if (roleErr) return roleErr;

    const { data, errorResponse: valErr } = await validateRequestBody(req, CreateRoleSchema);
    if (valErr) return valErr;

    const userClient = createSupabaseServerClient();
    const adminClient = createSupabaseAdminClient();
    const service = createRoleService(userClient, adminClient, getLLMProvider());

    const { skills, ...roleFields } = data!;
    const newRole = await service.createRole(roleFields, skills);

    return Response.json({ data: newRole, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
