"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  AUTH_SESSION_EVENT,
  getSafeProtectedRoute,
  HOME_ROUTE,
  isProtectedRoute,
  isPublicAuthRoute,
} from '@/lib/auth';
import {
  clearAuthSession,
  clearLegacyAuthCookies,
  getStoredSession,
  type StoredAuthSession,
} from '@/lib/auth-client';
import type { User } from '@/services/contracts';

import { restoreStoredSession } from './session';

type AuthStatus =
  | 'booting'
  | 'anonymous'
  | 'authenticated'
  | 'unavailable';

type AuthContextValue = {
  status: AuthStatus;
  session: StoredAuthSession | null;
  user: User | null;
  restore: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthLoadingScreen() {
  return (
    <div
      className="grid min-h-screen place-items-center bg-[color:var(--app-bg)] text-sm text-slate-500"
      role="status"
    >
      Verificando sesión…
    </div>
  );
}

function AuthUnavailableScreen({
  onRetry,
  onClear,
}: {
  onRetry: () => void;
  onClear: () => void;
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-[color:var(--app-bg)] p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl">
        <p className="text-sm font-semibold text-amber-700">Sesión sin verificar</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          API temporalmente no disponible
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          No mostramos contenido protegido hasta validar tu sesión.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-[color:var(--app-primary)] px-5 py-3 text-sm font-semibold text-white"
          >
            Reintentar
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
          >
            Cerrar sesión local
          </button>
        </div>
      </div>
    </div>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const requestVersion = useRef(0);
  const [status, setStatus] = useState<AuthStatus>('booting');
  const [session, setSession] = useState<StoredAuthSession | null>(null);

  const restore = useCallback(async () => {
    const version = ++requestVersion.current;
    setStatus('booting');

    try {
      const restored = await restoreStoredSession();
      if (version !== requestVersion.current) return;

      setSession(restored);
      setStatus(restored ? 'authenticated' : 'anonymous');
    } catch {
      if (version !== requestVersion.current) return;
      const existingSession = getStoredSession();
      setSession(existingSession);
      setStatus(existingSession ? 'unavailable' : 'anonymous');
    }
  }, []);

  useEffect(() => {
    clearLegacyAuthCookies();
    void restore();

    const syncSession = () => {
      requestVersion.current += 1;
      const nextSession = getStoredSession();
      setSession(nextSession);
      setStatus(nextSession ? 'authenticated' : 'anonymous');
    };

    window.addEventListener(AUTH_SESSION_EVENT, syncSession);
    return () => window.removeEventListener(AUTH_SESSION_EVENT, syncSession);
  }, [restore]);

  const expiresAt = session?.expiresAt;

  useEffect(() => {
    if (expiresAt === null || expiresAt === undefined) return;

    const remainingMs = expiresAt - Date.now();
    if (remainingMs <= 0) {
      clearAuthSession();
      return;
    }

    const timer = window.setTimeout(() => clearAuthSession(), remainingMs);
    return () => window.clearTimeout(timer);
  }, [expiresAt]);

  const protectedRoute = isProtectedRoute(pathname);
  const publicAuthRoute = isPublicAuthRoute(pathname);

  useEffect(() => {
    if (status === 'booting') return;

    if (status === 'anonymous' && protectedRoute) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
      return;
    }

    if (status === 'authenticated' && publicAuthRoute) {
      const requestedRoute =
        pathname === '/login' && typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('next')
          : null;
      router.replace(getSafeProtectedRoute(requestedRoute, HOME_ROUTE));
    }
  }, [pathname, protectedRoute, publicAuthRoute, router, status]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, session, user: session?.user ?? null, restore }),
    [restore, session, status],
  );

  const redirectingAnonymous = status === 'anonymous' && protectedRoute;
  const redirectingAuthenticated =
    status === 'authenticated' && publicAuthRoute;

  if (status === 'unavailable') {
    return (
      <AuthContext.Provider value={value}>
        <AuthUnavailableScreen
          onRetry={() => void restore()}
          onClear={() => clearAuthSession()}
        />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {status === 'booting' || redirectingAnonymous || redirectingAuthenticated ? (
        <AuthLoadingScreen />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }
  return context;
}
