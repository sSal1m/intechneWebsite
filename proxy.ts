import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './src/utils/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. If it's an admin path, handle Supabase Auth session & redirection
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const isForbiddenPage = pathname === '/admin/forbidden';
    if (isForbiddenPage) {
      const { response } = await updateSession(request);
      return response;
    }

    const { user, response } = await updateSession(request);
    const isLoginPage = pathname === '/admin/login';

    if (!user) {
      if (!isLoginPage) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
      return response;
    } else {
      const role = user.app_metadata?.role;
      const allowedRoles = ['super_admin', 'admin', 'operations_manager'];
      const hasAllowedRole = role && allowedRoles.includes(role);

      if (!hasAllowedRole) {
        const forbiddenUrl = new URL('/admin/forbidden', request.url);
        return NextResponse.redirect(forbiddenUrl);
      }

      if (isLoginPage) {
        const dashboardUrl = new URL('/admin', request.url);
        return NextResponse.redirect(dashboardUrl);
      }

      const isOpsManagerRestricted = 
        pathname.startsWith('/admin/sliders') ||
        pathname.startsWith('/admin/brands') ||
        pathname.startsWith('/admin/news') ||
        pathname.startsWith('/admin/team') ||
        pathname.startsWith('/admin/i-talks') ||
        pathname.startsWith('/admin/identity') ||
        pathname.startsWith('/admin/trash');

      const isAdminRestricted = 
        pathname.startsWith('/admin/identity') ||
        pathname.startsWith('/admin/messages') ||
        pathname.startsWith('/admin/volunteers');

      if (role === 'operations_manager' && isOpsManagerRestricted) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      if (role === 'admin' && isAdminRestricted) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      return response;
    }
  }

  // 2. Otherwise run next-intl middleware for public paths
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
