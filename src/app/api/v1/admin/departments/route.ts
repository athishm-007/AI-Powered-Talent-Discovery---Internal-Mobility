import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/backend/middleware/withAuth';
import { authorizeRole } from '@/backend/middleware/withRole';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { handleApiError } from '@/backend/middleware/withErrorHandler';
import { z } from 'zod';

const UpdateDepartmentSchema = z.object({
  user_id: z.string().uuid(),
  department_id: z.string().uuid(),
});

export async function PATCH(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const roleErr = authorizeRole(user!, ['hr_admin']);
    if (roleErr) return roleErr;

    const body = await req.json();
    const data = UpdateDepartmentSchema.parse(body);

    const admin = createSupabaseAdminClient();
    const { data: updated, error } = await admin
      .from('profiles')
      .update({ department_id: data.department_id })
      .eq('user_id', data.user_id)
      .select()
      .single();

    if (error) throw error;
    return Response.json({ data: updated, error: null, meta: {} });
  } catch (err) {
    return handleApiError(err);
  }
}
