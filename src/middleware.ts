import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Authenticate user via getUser() - NEVER trust getSession() for authorization
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    // Suppress connection error in DEMO_MODE or when placeholder URL is used
    user = null;
  }
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/' || path === '/login' || path === '/register';
  const isEmployeePath = path.startsWith('/dashboard') || path.startsWith('/profile') || path.startsWith('/opportunities') || path.startsWith('/skill-gaps') || path.startsWith('/roadmap') || path.startsWith('/assistant');
  const isHrPath = path.startsWith('/admin');

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || request.nextUrl.searchParams.has('demo');
  const demoRole = request.nextUrl.searchParams.get('demo');

  if (isDemoMode && isPublicPath && demoRole) {
    const url = request.nextUrl.clone();
    url.pathname = demoRole === 'hr' ? '/admin' : '/dashboard';
    return NextResponse.redirect(url);
  }

  if (!user && !isDemoMode && (isEmployeePath || isHrPath)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', path);
    return NextResponse.redirect(url);
  }

  if (user) {
    const role = user.app_metadata?.role || 'employee';

    if (isHrPath && role !== 'hr_admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (isPublicPath && (path === '/login' || path === '/register')) {
      const url = request.nextUrl.clone();
      url.pathname = role === 'hr_admin' ? '/admin' : '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard',
    '/profile',
    '/opportunities/:path*',
    '/skill-gaps',
    '/roadmap',
    '/assistant',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
