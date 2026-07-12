import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Users,
  Search,
  Bell,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import LogoRagAI from "@/assets/ragaiLogo.svg"
import Image from 'next/image';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type RecentItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Biblioteca', href: '/biblioteca', icon: BookOpen },
  { label: 'Salas de estudio', href: '/salas-de-estudio', icon: Users },
];

const cuadernosRecientes: RecentItem[] = [
  { label: 'Git y github. La tec...', href: '/dashboard/cuadernos/1' },
  { label: 'Git y github. La tec...', href: '/dashboard/cuadernos/2' },
];

const recursosRecientes: RecentItem[] = [
  { label: 'Git y github. La tec...', href: '/biblioteca/recursos/1' },
  { label: 'Git y github. La tec...', href: '/biblioteca/recursos/2' },
];


export function AppShell({
  children,
  activeHref = '/home',
}: {
  children: ReactNode;
  activeHref?: string;
}) {
  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="mx-auto grid h-[calc(100vh-0rem)] max-w-[1600px] overflow-hidden border border-[color:var(--app-border)] bg-[color:var(--app-surface)] shadow-[0_20px_80px_rgba(67,56,202,0.10)] backdrop-blur-xl lg:grid-cols-[280px_minmax(0,1fr)]">

        {/* ===================== SIDEBAR ===================== */}
        <aside className="flex h-full overflow-y-auto flex-col border-b border-[color:var(--app-border)] bg-white/60 px-5 py-5 ">

          {/* --- Logo --- */}
          <div className="mb-8 flex items-center justify-start">
            <Image src={LogoRagAI} alt="Logo de la aplicacion LearnIA" width={50} height={50} className='w-28' />
          </div>

          {/* Nav*/}
          <div className="flex-1 overflow-y-auto pr-1">
            <nav className="space-y-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                General
              </p>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[linear-gradient(135deg,rgba(116,82,245,0.14),rgba(119,234,222,0.18))] text-[color:var(--app-primary)] ring-1 ring-[color:var(--app-border)]'
                        : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                    }`}
                  >
                    <Icon
                      className={`h-4.5 w-4.5 ${isActive ? 'text-[color:var(--app-primary)]' : 'text-slate-400'}`}
                      strokeWidth={2}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* --- Cuadernos recientes --- */}
            <div className="mt-8">
              <p className="px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Cuadernos Recientes
              </p>
              <div className="mt-3 space-y-1">
                {cuadernosRecientes.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex items-center gap-3 truncate rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-white/70 hover:text-slate-900"
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* --- Recursos de estudio recientes --- */}
            <div className="mt-6">
              <p className="px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Recursos recientes
              </p>
              <div className="mt-3 space-y-1">
                {recursosRecientes.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex items-center gap-3 truncate rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-white/70 hover:text-slate-900"
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Cerrar sesión */}
          <div className="mt-6 shrink-0 pt-2">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full border border-[color:var(--app-primary)] px-4 py-3 text-sm font-semibold text-[color:var(--app-primary)] transition hover:bg-[color:var(--app-primary)] hover:text-white"
            >
              Cerrar sesión
            </Link>
          </div>
        </aside>

        {/* COLUMNA DERECHA */}
        <section className="flex h-full min-w-0 flex-col overflow-y-auto">

          {/* --- Header --- */}
          <header className="flex shrink-0 flex-wrap items-center gap-4 bg-white/40 px-5 py-4 sm:px-6 lg:px-8">

            {/* Buscador */}
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-transparent bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] ring-1 ring-black/5">
              <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
              <input
                aria-label="Buscar"
                placeholder="Buscar"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Campana de notificaciones */}
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-500 ring-1 ring-black/5 transition hover:text-[color:var(--app-primary)]">
              <Bell className="h-5 w-5" strokeWidth={2} />
            </button>

            {/* Perfil */}
            <button className="flex items-center gap-2 transition hover:ring-[color:var(--app-primary)]">
              <div className="h-10 w-10 rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))]" />
            </button>

            {/* Crear cuaderno */}
            <Link
              href="/dashboard/cuadernos/nuevo"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] px-5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(116,82,245,0.24)] transition hover:translate-y-[-1px]"
            >
              Crear cuaderno
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </header>

          <main className="flex-1 px-5 py-5 sm:px-6 lg:px-8 lg:py-8 border-l border-t border-[color:var(--app-border)] rounded-l-[2rem] bg-[linear-gradient(to_right,#80808026_1px,transparent_1px),linear-gradient(to_bottom,#80808026_1px,transparent_1px)] bg-[size:62px_62px]">
            {children}
          </main>
        </section>
      </div>
    </div>
  );
}