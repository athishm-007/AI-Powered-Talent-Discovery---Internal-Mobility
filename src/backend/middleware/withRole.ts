import { AuthenticatedUser } from './withAuth';

export function authorizeRole(user: AuthenticatedUser, allowedRoles: Array<'employee' | 'hr_admin'>): Response | null {
  if (!allowedRoles.includes(user.role)) {
    return Response.json(
      { data: null, error: { code: 'FORBIDDEN', message: 'Insufficient privileges' }, meta: {} },
      { status: 403 }
    );
  }
  return null;
}
