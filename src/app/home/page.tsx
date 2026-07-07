import Link from 'next/link';

import { AppShell } from '@/layouts/app-shell';

const deadlineCards = [
  { date: '12', month: 'Mayo', time: '02:35 pm', title: 'Estructura de datos y algoritmos', note: 'Quedan 2 días' },
  { date: '18', month: 'Mayo', time: '08:00 am', title: 'Arquitectura de software', note: 'Quedan 4 días' },
];

export default function HomePage() {
  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.95fr]">
        <section className="overflow-hidden rounded-[2rem] border border-[color:var(--app-border)] bg-white/75 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm font-medium text-slate-500">Lunes 06, junio 2026</p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl">Buenas tardes, Tym Payne.</h1>
                <p className="text-2xl font-semibold leading-tight text-[color:var(--app-primary)] sm:text-[2.4rem]">¿Listo para romperla hoy?</p>
              </div>
            </div>

            <div className="relative mx-auto flex h-64 w-full max-w-[28rem] items-center justify-center overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(116,82,245,0.12),rgba(119,234,222,0.18))]">
              <div className="absolute left-4 top-6 h-20 w-20 rounded-full bg-[color:var(--app-primary)]/15 blur-2xl" />
              <div className="absolute right-8 top-10 h-24 w-24 rounded-full bg-[color:var(--app-secondary)]/25 blur-3xl" />
              <div className="absolute left-10 bottom-10 h-12 w-24 rotate-[-12deg] rounded-2xl bg-white/75 shadow-sm ring-1 ring-[color:var(--app-border)]" />
              <div className="absolute right-10 bottom-12 h-28 w-40 rotate-[-4deg] rounded-[1.75rem] bg-white/80 shadow-[0_16px_35px_rgba(15,23,42,0.08)] ring-1 ring-[color:var(--app-border)]">
                <div className="absolute left-1/2 top-1/2 h-16 w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] opacity-90" />
              </div>
              <div className="absolute left-8 top-10 h-16 w-16 rounded-[1.35rem] bg-white/75 shadow-sm ring-1 ring-[color:var(--app-border)]" />
              <div className="absolute right-3 top-16 h-24 w-20 rounded-[1.35rem] bg-white/75 shadow-sm ring-1 ring-[color:var(--app-border)]" />
              <div className="absolute bottom-4 left-1/2 h-3 w-44 -translate-x-1/2 rounded-full bg-slate-200/80 blur-sm" />
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-[color:var(--app-border)] bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-900/10" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[color:var(--app-primary)]">Frase del día</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  “El éxito es la suma de pequeños esfuerzos repetidos día tras día.” — Robert Collier
                </p>
              </div>
              <div className="text-4xl font-black leading-none text-[color:var(--app-primary)]/80">&rdquo;</div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
            <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Cuadernos con próximas fechas límites</h2>
                  <p className="mt-1 text-sm text-slate-500">Mantén visibles las tareas más urgentes.</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,rgba(116,82,245,0.18),rgba(119,234,222,0.24))]" />
              </div>

              <div className="mt-5 space-y-3">
                {deadlineCards.map((card) => (
                  <article key={`${card.title}-${card.date}`} className="grid grid-cols-[84px_minmax(0,1fr)] gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex flex-col items-center justify-center rounded-[1.25rem] bg-white text-center shadow-sm ring-1 ring-black/5">
                      <span className="text-xs font-medium text-[color:var(--app-primary)]">{card.month}</span>
                      <span className="text-3xl font-semibold leading-none text-slate-800">{card.date}</span>
                      <span className="mt-1 text-xs text-slate-400">{card.time}</span>
                    </div>
                    <div className="flex min-w-0 flex-col justify-center gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full border-2 border-[color:var(--app-secondary)] bg-white" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-700">{card.title}</p>
                          <p className="text-xs text-slate-500">{card.note}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-black/5">3 flashcards</span>
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-black/5">Exámenes</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-800">Crea un cuaderno</h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Organiza tus apuntes y recursos en un cuaderno para que la IA pueda ayudarte a aprender.
                  </p>
                  <Link
                    href="/home"
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(116,82,245,0.24)]"
                  >
                    Nuevo Cuaderno +
                  </Link>
                </div>

                <div className="grid h-28 w-28 place-items-center rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(116,82,245,0.85),rgba(119,234,222,0.95))] shadow-[0_18px_34px_rgba(116,82,245,0.22)]">
                  <div className="h-16 w-12 rounded-2xl bg-white/85" />
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[color:var(--app-border)] bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)] md:col-span-2 xl:col-span-1">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-800">Racha</h2>
                  <p className="mt-1 text-sm text-slate-500">La mejor: 15 días</p>

                  <div className="mt-5 flex items-end gap-2">
                    {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((day, index) => (
                      <div key={day} className="flex flex-col items-center gap-2">
                        <div
                          className={`grid h-10 w-10 place-items-center rounded-full text-xs font-semibold text-white shadow-sm ${
                            index < 5 ? 'bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))]' : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          ✓
                        </div>
                        <span className="text-[11px] text-slate-500">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="text-6xl leading-none">🔥</div>
                  <div className="text-center">
                    <p className="text-3xl font-semibold text-slate-800">7 Días</p>
                    <p className="text-sm text-slate-500">(actual)</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}