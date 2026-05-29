import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /dashboard and redirect logged-in users away from /login
  const isDashboardPath = path.startsWith('/dashboard');
  const isAuthPath = path === '/login';

  const token = request.cookies.get('token')?.value || '';
  const payload = token ? await verifyJWT(token) : null;

  if (isDashboardPath && !payload) {
    // Redirect to login if unauthorized
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPath && payload) {
    // Redirect to dashboard if already logged in
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Config matching rules
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
