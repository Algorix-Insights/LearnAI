'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { SalasContent } from '@/features/salas/components/SalasContent';
import { AppShell } from '@/layouts/app-shell';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function SalasDeEstudioPage() {
  return (
    <QueryClientProvider client={queryClient}>  
      <AuthProvider>                            
        <AppShell activeHref="/salas-de-estudio">
          <SalasContent />
        </AppShell>
      </AuthProvider>
    </QueryClientProvider>
  );
}