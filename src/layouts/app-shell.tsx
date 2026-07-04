import Link from 'next/link';
import type { ReactNode } from 'react';

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/home' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Biblioteca', href: '/biblioteca' },
  { label: 'Salas de estudio', href: '/salas-de-estudio' },
];

export function AppShell({ children, activeHref = '/home' }: { children: ReactNode; activeHref?: string }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] overflow-hidden border border-[color:var(--app-border)] bg-[color:var(--app-surface)] shadow-[0_20px_80px_rgba(67,56,202,0.10)] backdrop-blur-xl lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex flex-col border-b border-[color:var(--app-border)] bg-white/60 px-5 py-5 lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] text-white shadow-[0_14px_30px_rgba(116,82,245,0.28)]">
              <div className="h-5 w-5 rounded-full border-2 border-white/90" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--app-primary)]">LearnAI</p>
              <p className="text-xs text-slate-500">Workspace de estudio</p>
            </div>
          </div>

          <nav className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">General</p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  item.href === activeHref
                    ? 'bg-[linear-gradient(135deg,rgba(116,82,245,0.14),rgba(119,234,222,0.18))] text-[color:var(--app-primary)] ring-1 ring-[color:var(--app-border)]'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${item.href === activeHref ? 'bg-[color:var(--app-primary)]' : 'bg-slate-300'}`} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-[1.5rem] border border-[color:var(--app-border)] bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Acciones rápidas</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-3 py-2">Crear cuaderno</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2">Revisar progreso</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2">Entrar a una sala</div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full border border-[color:var(--app-primary)] px-4 py-3 text-sm font-semibold text-[color:var(--app-primary)] transition hover:bg-[color:var(--app-primary)] hover:text-white"
            >
              Cerrar sesión
            </Link>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="flex flex-wrap items-center gap-4 border-b border-[color:var(--app-border)] bg-white/40 px-5 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-transparent bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] ring-1 ring-black/5">
              <span className="h-4 w-4 rounded-full border-2 border-slate-300" />
              <input
                aria-label="Buscar"
                placeholder="Buscar"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-500 ring-1 ring-black/5 transition hover:text-[color:var(--app-primary)]">
              ○
            </button>

            <div className="flex items-center gap-3 rounded-full bg-white/90 px-3 py-2 ring-1 ring-black/5">
              <div className="h-10 w-10 rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))]" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">Usuario</p>
                <p className="text-xs text-slate-500">Activo ahora</p>
              </div>
            </div>

            <Link
              href="/home"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] px-5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(116,82,245,0.24)] transition hover:translate-y-[-1px]"
            >
              Crear cuaderno +
            </Link>
          </header>

          <main className="flex-1 px-5 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </section>
      </div>
    </div>
  );
}