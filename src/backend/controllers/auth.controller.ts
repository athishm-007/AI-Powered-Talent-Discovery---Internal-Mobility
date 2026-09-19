import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { validateRequestBody } from '../middleware/withValidation';
import { LoginSchema, RegisterSchema, DemoLoginSchema } from '@/models/auth';

export async function handleLogin(req: NextRequest) {
  const { data, errorResponse } = await validateRequestBody(req, LoginSchema);
  if (errorResponse) return errorResponse;

  const supabase = createSupabaseServerClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data!.email,
    password: data!.password,
  });

  if (error) {
    return Response.json(
      { data: null, error: { code: 'AUTH_FAILED', message: error.message }, meta: {} },
      { status: 400 }
    );
  }

  return Response.json({
    data: { user: authData.user, session: authData.session },
    error: null,
    meta: {},
  });
}

export async function handleRegister(req: NextRequest) {
  const { data, errorResponse } = await validateRequestBody(req, RegisterSchema);
  if (errorResponse) return errorResponse;

  // Server-side ALLOWED_EMAIL_DOMAINS validation
  const allowedDomains = (process.env.ALLOWED_EMAIL_DOMAINS || 'talentlens.ai,company.com').split(',').map((d) => d.trim().toLowerCase());
  const userDomain = data!.email.split('@')[1]?.toLowerCase();

  if (!userDomain || !allowedDomains.includes(userDomain)) {
    return Response.json(
      {
        data: null,
        error: { code: 'DOMAIN_REJECTED', message: `Registration is restricted to domains: ${allowedDomains.join(', ')}` },
        meta: {},
      },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email: data!.email,
    password: data!.password,
    options: {
      data: {
        full_name: data!.full_name,
        role_title: data!.role_title || 'Team Member',
      },
    },
  });

  if (error) {
    return Response.json(
      { data: null, error: { code: 'REGISTRATION_FAILED', message: error.message }, meta: {} },
      { status: 400 }
    );
  }

  return Response.json({
    data: { user: authData.user, session: authData.session },
    error: null,
    meta: {},
  });
}

export async function handleDemoLogin(req: NextRequest) {
  if (process.env.DEMO_MODE !== 'true') {
    return Response.json(
      { data: null, error: { code: 'NOT_FOUND', message: 'Demo mode is disabled' }, meta: {} },
      { status: 404 }
    );
  }

  const { data, errorResponse } = await validateRequestBody(req, DemoLoginSchema);
  if (errorResponse) return errorResponse;

  const password = data!.role === 'hr_admin'
    ? process.env.SEED_ADMIN_PASSWORD || 'hradmin123'
    : process.env.SEED_EMPLOYEE_PASSWORD || 'employee123';

  const supabase = createSupabaseServerClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data!.email,
    password,
  });

  if (error) {
    return Response.json(
      { data: null, error: { code: 'DEMO_AUTH_FAILED', message: error.message }, meta: {} },
      { status: 400 }
    );
  }

  return Response.json({
    data: { user: authData.user, session: authData.session },
    error: null,
    meta: {},
  });
}
