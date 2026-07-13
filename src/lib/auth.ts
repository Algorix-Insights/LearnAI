export const ACCESS_TOKEN_STORAGE_KEY = 'access_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';
export const AUTH_SESSION_STORAGE_KEY = 'learnai_auth_session';
export const PENDING_AUTH_STORAGE_KEY = 'learnai_pending_auth';
export const AUTH_SESSION_EVENT = 'learnai:session-changed';
export const AUTH_UNAUTHORIZED_EVENT = 'learnai:unauthorized';

export const PUBLIC_AUTH_ROUTES = [
  '/login',
  '/register',
  '/otp',
  '/forgot-password',
  '/reset-password',
] as const;

export const HOME_ROUTE = '/home';

export const PROTECTED_ROUTE_PREFIXES = [
  '/home',
  '/dashboard',
  '/biblioteca',
  '/salas-de-estudio',
] as const;

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isPublicAuthRoute(pathname: string) {
  return PUBLIC_AUTH_ROUTES.some((route) => pathname === route);
}

export function getSafeProtectedRoute(
  requestedRoute: string | null,
  fallback = HOME_ROUTE,
) {
  if (
    !requestedRoute ||
    !requestedRoute.startsWith('/') ||
    requestedRoute.startsWith('//')
  ) {
    return fallback;
  }

  try {
    const baseUrl = new URL('https://learnai.local');
    const targetUrl = new URL(requestedRoute, baseUrl);
    if (
      targetUrl.origin !== baseUrl.origin ||
      !isProtectedRoute(targetUrl.pathname)
    ) {
      return fallback;
    }

    return `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
  } catch {
    return fallback;
  }
}
