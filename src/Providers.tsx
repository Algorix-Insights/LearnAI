"use client";

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AuthProvider } from '@/features/auth/AuthProvider';
import { AUTH_SESSION_EVENT, AUTH_UNAUTHORIZED_EVENT } from '@/lib/auth';
import { getStoredSession } from '@/lib/auth-client';
import { ApiClientError } from '@/services/api';

function shouldRetry(failureCount: number, error: unknown) {
  if (error instanceof ApiClientError) {
    if (error.status === 429) return false;
    if (error.status !== null && error.status >= 400 && error.status < 500) {
      return false;
    }
  }

  return failureCount < 2;
}

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60_000,
            gcTime: 30 * 60_000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: shouldRetry,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.clear();
    };
    const handleSessionChanged = () => {
      if (!getStoredSession()) queryClient.clear();
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    window.addEventListener(AUTH_SESSION_EVENT, handleSessionChanged);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
      window.removeEventListener(AUTH_SESSION_EVENT, handleSessionChanged);
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
