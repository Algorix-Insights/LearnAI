import type {
  AuthSession,
  OtpVerificationType,
} from '@/services/contracts';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  AUTH_SESSION_EVENT,
  AUTH_SESSION_STORAGE_KEY,
  PENDING_AUTH_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from '@/lib/auth';

const PENDING_AUTH_TTL_MS = 15 * 60 * 1_000;
const LEGACY_COOKIE_NAMES = [
  'learnai_auth_token',
  'learnai_pending_otp_email',
] as const;

export type PendingAuthIntent = 'login' | 'register' | 'recovery';

export type PendingAuthChallenge = {
  email: string;
  intent: PendingAuthIntent;
  type: OtpVerificationType;
  expiresAt: number;
};

export type StoredAuthSession = AuthSession & {
  expiresAt: number | null;
};

type SaveSessionOptions = {
  notify?: boolean;
};

type ClearSessionOptions = SaveSessionOptions & {
  clearPending?: boolean;
};

function getStorage() {
  if (typeof window === 'undefined') return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function notifySessionChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
  }
}

export function clearLegacyAuthCookies() {
  if (typeof document === 'undefined') return;

  for (const name of LEGACY_COOKIE_NAMES) {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
  }
}

function removeSessionValues(storage: Storage) {
  storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  storage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  storage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function saveSession(
  session: AuthSession | StoredAuthSession,
  { notify = true }: SaveSessionOptions = {},
) {
  if (!session.access_token) {
    throw new Error('La API no devolvió una sesión válida.');
  }

  const storage = getStorage();
  if (!storage) {
    throw new Error('El navegador no permitió guardar la sesión.');
  }

  const storedSession: StoredAuthSession = {
    ...session,
    expiresAt: 'expiresAt' in session
      ? session.expiresAt
      : session.expires_in && session.expires_in > 0
        ? Date.now() + session.expires_in * 1_000
        : null,
  };

  try {
    clearLegacyAuthCookies();
    removeSessionValues(storage);
    storage.setItem(ACCESS_TOKEN_STORAGE_KEY, session.access_token);
    if (session.refresh_token) {
      storage.setItem(REFRESH_TOKEN_STORAGE_KEY, session.refresh_token);
    }
    storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(storedSession));
  } catch {
    removeSessionValues(storage);
    throw new Error('El navegador no permitió guardar la sesión.');
  }

  if (notify) notifySessionChanged();
  return storedSession;
}

export function getStoredSession(): StoredAuthSession | null {
  const storage = getStorage();
  if (!storage) return null;

  const serialized = storage.getItem(AUTH_SESSION_STORAGE_KEY);
  const accessToken = storage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (!serialized || !accessToken) return null;

  try {
    const session = JSON.parse(serialized) as StoredAuthSession;
    if (!session.access_token || session.access_token !== accessToken) {
      removeSessionValues(storage);
      return null;
    }

    if (session.expiresAt !== null && session.expiresAt <= Date.now()) {
      clearAuthSession();
      return null;
    }

    return session;
  } catch {
    removeSessionValues(storage);
    return null;
  }
}

export function getAccessToken() {
  return getStoredSession()?.access_token ?? null;
}

export function getRefreshToken() {
  const session = getStoredSession();
  if (!session) return null;
  return getStorage()?.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? null;
}

export function clearAuthSession({
  notify = true,
  clearPending = true,
}: ClearSessionOptions = {}) {
  clearLegacyAuthCookies();
  const storage = getStorage();
  if (storage) {
    removeSessionValues(storage);
    if (clearPending) storage.removeItem(PENDING_AUTH_STORAGE_KEY);
  }

  if (notify) notifySessionChanged();
}

export const clearSession = clearAuthSession;

export function storePendingAuthChallenge(
  challenge: Omit<PendingAuthChallenge, 'expiresAt'>,
) {
  const storage = getStorage();
  if (!storage) {
    throw new Error('El navegador no permitió guardar la verificación pendiente.');
  }

  storage.setItem(
    PENDING_AUTH_STORAGE_KEY,
    JSON.stringify({
      ...challenge,
      email: challenge.email.trim().toLowerCase(),
      expiresAt: Date.now() + PENDING_AUTH_TTL_MS,
    } satisfies PendingAuthChallenge),
  );
}

export function getPendingAuthChallenge(): PendingAuthChallenge | null {
  const storage = getStorage();
  if (!storage) return null;

  const serialized = storage.getItem(PENDING_AUTH_STORAGE_KEY);
  if (!serialized) return null;

  try {
    const challenge = JSON.parse(serialized) as PendingAuthChallenge;
    if (
      !challenge.email ||
      !challenge.intent ||
      !challenge.type ||
      challenge.expiresAt <= Date.now()
    ) {
      storage.removeItem(PENDING_AUTH_STORAGE_KEY);
      return null;
    }

    return challenge;
  } catch {
    storage.removeItem(PENDING_AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearPendingOtpSession() {
  getStorage()?.removeItem(PENDING_AUTH_STORAGE_KEY);
}

export function storePendingOtpEmail(
  email: string,
  intent: PendingAuthIntent = 'login',
  type: OtpVerificationType = 'email',
) {
  storePendingAuthChallenge({ email, intent, type });
}
