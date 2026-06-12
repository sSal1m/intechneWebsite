import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './src/utils/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. If it's an admin path, handle Supabase Auth session & redirection
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const { user, response } = await updateSession(request);
    const isLoginPage = pathname === '/admin/login';

    if (!user) {
      if (!isLoginPage) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
      return response;
    } else {
      if (isLoginPage) {
        const dashboardUrl = new URL('/admin', request.url);
        return NextResponse.redirect(dashboardUrl);
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
