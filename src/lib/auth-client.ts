import { AUTH_COOKIE, PENDING_OTP_COOKIE } from '@/lib/auth';

const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const PENDING_OTP_MAX_AGE = 60 * 15;
const USER_ID_COOKIE = 'user_id';

function isValidUserId(value: unknown): value is string {
    if (typeof value !== 'string') return false;

    const normalizedValue = value.trim().toLowerCase();
    return Boolean(normalizedValue) && normalizedValue !== 'undefined' && normalizedValue !== 'null';
}

function setCookie(name: string, value: string, maxAge = DEFAULT_COOKIE_MAX_AGE) {
    const secure = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax${secure}`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function storePendingOtpEmail(email: string) {
    setCookie(PENDING_OTP_COOKIE, email, PENDING_OTP_MAX_AGE);
    sessionStorage.setItem(PENDING_OTP_COOKIE, email);
}

export function storeAuthToken(token: string, maxAge?: number) {
    setCookie(AUTH_COOKIE, token, maxAge);
}

export function storeUserId(userId?: string | null) {
    if (!isValidUserId(userId)) {
        deleteCookie(USER_ID_COOKIE);
        return;
    }

    setCookie(USER_ID_COOKIE, userId);
}

export function getUserId() {
    const cookieValue = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${USER_ID_COOKIE}=`))
        ?.split('=')[1];

    if (!cookieValue) {
        return '';
    }

    const decodedValue = decodeURIComponent(cookieValue);
    if (isValidUserId(decodedValue)) {
        return decodedValue;
    }

    deleteCookie(USER_ID_COOKIE);
    return '';
}

export function getAuthToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${AUTH_COOKIE}=`))
        ?.split('=')[1];

    if (cookieValue) {
        return decodeURIComponent(cookieValue);
    }

    return '';
}

export function clearAuthSession() {
    deleteCookie(AUTH_COOKIE);
    deleteCookie(PENDING_OTP_COOKIE);
    deleteCookie(USER_ID_COOKIE);
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
