import { AUTH_COOKIE, PENDING_OTP_COOKIE } from '@/lib/auth';

const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function setCookie(name: string, value: string, maxAge = DEFAULT_COOKIE_MAX_AGE) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function storePendingOtpEmail(email: string) {
    setCookie(PENDING_OTP_COOKIE, email);
    sessionStorage.setItem(PENDING_OTP_COOKIE, email);
}

export function storeAuthToken(token: string) {
    setCookie(AUTH_COOKIE, token);
}

export function clearAuthSession() {
    deleteCookie(AUTH_COOKIE);
    deleteCookie(PENDING_OTP_COOKIE);
    sessionStorage.removeItem(PENDING_OTP_COOKIE);
}

export function clearPendingOtpSession() {
    deleteCookie(PENDING_OTP_COOKIE);
    sessionStorage.removeItem(PENDING_OTP_COOKIE);
}

export function getPendingOtpEmail() {
    const cookieValue = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${PENDING_OTP_COOKIE}=`))
        ?.split('=')[1];

    if (cookieValue) {
        return decodeURIComponent(cookieValue);
    }

    return sessionStorage.getItem(PENDING_OTP_COOKIE) ?? '';
}
