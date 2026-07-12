export const AUTH_COOKIE = 'learnai_auth_token';
export const PENDING_OTP_COOKIE = 'learnai_pending_otp_email';

export const PUBLIC_AUTH_ROUTES = ['/login', '/register'];
export const OTP_ROUTE = '/otp';
export const HOME_ROUTE = '/home';

export const PROTECTED_ROUTE_PREFIXES = [
    '/home',
    '/dashboard',
    '/biblioteca',
    '/salas-de-estudio',
];
