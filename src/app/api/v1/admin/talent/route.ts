import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/backend/middleware/withAuth';
import { authorizeRole } from '@/backend/middleware/withRole';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { handleApiError } from '@/backend/middleware/withErrorHandler';

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await authenticateRequest(req);
    if (errorResponse) return errorResponse;

    const roleErr = authorizeRole(user!, ['hr_admin']);
    if (roleErr) return roleErr;

    const { searchParams } = new URL(req.url);
    const roleId = searchParams.get('roleId');

    const admin = createSupabaseAdminClient();

    let query = admin
      .from('match_results')
      .select(`
        *,
        profiles(*, departments(name), employee_skills(*, skills(name, category))),
        roles(title, departments(name))
      `)
      .order('overall_score', { ascending: false });

    if (roleId) {
      query = query.eq('role_id', roleId);
    }

    const { data: candidates, error } = await query;
    if (error) throw error;

    // Fetch interest outcomes to append "Interested" badge to candidates
    const { data: interestOutcomes } = await admin
      .from('career_outcomes')
      .select('profile_id, target_id')
      .eq('outcome_type', 'applied');

    const interestMap = new Set(
      (interestOutcomes || []).map((o) => `${o.profile_id}_${o.target_id}`)
    );

    const enrichedCandidates = (candidates || []).map((c) => ({
      ...c,
      is_interested: interestMap.has(`${c.profile_id}_${c.role_id}`),
    }));

    return Response.json({ data: enrichedCandidates, error: null, meta: { count: enrichedCandidates.length } });
  } catch (err) {
    return handleApiError(err);
  }
}
