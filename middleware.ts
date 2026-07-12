import { NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE, HOME_ROUTE, OTP_ROUTE, PENDING_OTP_COOKIE, PROTECTED_ROUTE_PREFIXES, PUBLIC_AUTH_ROUTES } from '@/lib/auth';

function isProtectedPath(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isPublicAuthPath(pathname: string) {
  return PUBLIC_AUTH_ROUTES.includes(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get(AUTH_COOKIE)?.value;
  const pendingOtpEmail = request.cookies.get(PENDING_OTP_COOKIE)?.value;

  const redirectTo = (target: string) => NextResponse.redirect(new URL(target, request.url));

  if (authToken) {
    if (pathname === '/' || isPublicAuthPath(pathname) || pathname === OTP_ROUTE) {
      return redirectTo(HOME_ROUTE);
    }

    return NextResponse.next();
  }

  if (pendingOtpEmail) {
    if (pathname === '/') {
      return redirectTo(OTP_ROUTE);
    }

    if (pathname === OTP_ROUTE) {
      return NextResponse.next();
    }

    return redirectTo(OTP_ROUTE);
  }

  if (pathname === '/') {
    return redirectTo('/login');
  }

  if (isProtectedPath(pathname) || pathname === OTP_ROUTE) {
    return redirectTo('/login');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
