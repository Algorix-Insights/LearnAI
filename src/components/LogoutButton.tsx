"use client";

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clearAuthSession } from '@/lib/auth-client';
import { AuthService } from '@/services/Auth';

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSettled: () => {
      clearAuthSession();
      queryClient.clear();
      router.replace('/login');
    },
  });

  return (
    <button
      type="button"
      disabled={logoutMutation.isPending}
      onClick={() => logoutMutation.mutate()}
      className="inline-flex w-full items-center justify-center rounded-full border border-[color:var(--app-primary)] px-4 py-3 text-sm font-semibold text-[color:var(--app-primary)] transition hover:bg-[color:var(--app-primary)] hover:text-white"
    >
      {logoutMutation.isPending ? 'Cerrando…' : 'Cerrar sesión'}
    </button>
  );
}
