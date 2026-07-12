"use client";

import { useRouter } from 'next/navigation';

import { clearAuthSession } from '@/lib/auth-client';

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        clearAuthSession();
        router.replace('/login');
      }}
      className="inline-flex w-full items-center justify-center rounded-full border border-[color:var(--app-primary)] px-4 py-3 text-sm font-semibold text-[color:var(--app-primary)] transition hover:bg-[color:var(--app-primary)] hover:text-white"
    >
      Cerrar sesión
    </button>
  );
}
