"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
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
      router.replace('/login');
      router.refresh();
    };

    window.addEventListener('learnai:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('learnai:unauthorized', handleUnauthorized);
    };
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
