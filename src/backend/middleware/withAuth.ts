import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'employee' | 'hr_admin';
}

export async function authenticateRequest(req: NextRequest): Promise<{ user: AuthenticatedUser | null; errorResponse?: Response }> {
  const supabase = createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      errorResponse: Response.json(
        { data: null, error: { code: 'UNAUTHORIZED', message: 'Authentication required' }, meta: {} },
        { status: 401 }
      ),
    };
  }

  const role = (user.app_metadata?.role as 'employee' | 'hr_admin') || 'employee';

  return {
    user: {
      id: user.id,
      email: user.email || '',
      role,
    },
  };
}
