import {
  clearAuthSession,
  getAccessToken,
  getStoredSession,
  saveSession,
} from '@/lib/auth-client';
import { AuthService } from '@/services/Auth';
import { ApiClientError } from '@/services/api';
import type { AuthSession } from '@/services/contracts';

function shouldInvalidateSession(error: unknown) {
  return (
    error instanceof ApiClientError &&
    (error.status === 401 || error.status === 403)
  );
}

function clearMatchingSession(accessToken: string) {
  if (getAccessToken() === accessToken) clearAuthSession();
}

export async function establishSession(session: AuthSession) {
  if (!session.access_token) {
    throw new Error('La API no devolvió una sesión válida.');
  }

  saveSession(session, { notify: false });

  try {
    const user = await AuthService.getMe();
    const verifiedSession = { ...session, user };
    saveSession(verifiedSession);
    return verifiedSession;
  } catch (error) {
    if (shouldInvalidateSession(error)) {
      clearMatchingSession(session.access_token);
    }
    throw error;
  }
}

export async function restoreStoredSession() {
  if (!getAccessToken()) return null;

  const currentSession = getStoredSession();
  if (!currentSession) return null;

  try {
    const user = await AuthService.getMe();
    return saveSession({ ...currentSession, user }, { notify: false });
  } catch (error) {
    if (shouldInvalidateSession(error)) {
      clearMatchingSession(currentSession.access_token);
    }
    throw error;
  }
}
