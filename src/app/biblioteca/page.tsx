import Image from 'next/image';
import Link from 'next/link';

import stars from '@/assets/stars.svg';
import { AppShell } from '@/layouts/app-shell';

type HighlightCard = {
  title: string;
  label: string;
  dueText: string;
  sources: string;
  accent: string;
};

type NotebookItem = {
  title: string;
  category: string;
  lastSeen: string;
  sources: string;
  dueDate: string;
  status?: string;
};

const filters = ['Todos', 'Vencen pronto', 'Favoritos'];

const highlightCards: HighlightCard[] = [
  {
    title: 'Nombre de cuaderno',
    label: 'Atención',
    dueText: 'Vence en 3 días',
    sources: '7 fuentes',
    accent: 'from-cyan-300 to-teal-400',
  },
  {
    title: 'Nombre de cuaderno',
    label: 'Atención',
    dueText: 'Vence en 3 días',
    sources: '7 fuentes',
    accent: 'from-violet-300 to-fuchsia-400',
  },
  {
    title: 'Nombre de cuaderno',
    label: 'Atención',
    dueText: 'Vence en 3 días',
    sources: '7 fuentes',
    accent: 'from-emerald-300 to-cyan-400',
  },
];

const notebooks: NotebookItem[] = [
  {
    title: 'Nombre del cuaderno',
    category: 'Universidad',
    lastSeen: 'Junio 17, 2026',
    sources: '9 fuentes',
    dueDate: 'Vence el 12 de junio 2025',
  },
  {
    title: 'Nombre del cuaderno',
    category: 'Repaso rápido',
    lastSeen: 'Junio 17, 2026',
    sources: '9 fuentes',
    dueDate: 'Vence el 12 de junio 2025',
  },
  {
    title: 'Nombre del cuaderno',
    category: 'Universidad',
    lastSeen: 'Junio 17, 2026',
    sources: '9 fuentes',
    dueDate: 'Vence el 12 de junio 2025',
    status: 'Favorito',
  },
];

export default function BibliotecaPage() {
  return (
    <AppShell activeHref="/biblioteca">
      <div className="space-y-8 pb-4 flex flex-col gap-8">
        <section className=" ">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-8 w-full">
              <div>
                <h1 className="text-4xl mt-14 bg-gradient-to-r from-[#28D8C5] to-[#7452F5] bg-clip-text text-transparent">
                  Estamos en la Biblioteca
                </h1>
                <p className="mt-4 text-md text-gray-500">El centro de aprendizaje</p>
              </div>

              {/* Barra de búsqueda con ancho máximo controlado */}
              <div className="w-full max-w-[600px]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="flex flex-1 items-center gap-3 rounded-full border border-[color:var(--app-border)] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                    <span className="h-4 w-4 rounded-full border-2 border-slate-300 shrink-0" />
                    <input
                      type="text"
                      placeholder="Buscar cuadernos, temas o fuentes"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                  </label>

                  <div className="flex flex-wrap gap-2 sm:justify-end shrink-0">
                    <Link
                      href="/home"
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--app-border)] bg-[#7667F2] text-white px-4 py-3 text-sm font-semibold transition hover:border-[color:var(--app-primary)] hover:text-[color:var(--app-primary)] w-full sm:w-auto"
                    >
                      Nuevo cuaderno
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Image src={stars} alt="Estrellas" className="mt-8" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="mt-1 text-xl font-semibold text-slate-500">Cuadernos próximos a vencer</h2>
              {/* <h2 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">Prioriza lo urgente sin perder contexto</h2> */}
            </div>
            <Link href="/dashboard" className="text-sm font-semibold text-[color:var(--app-primary)] hover:underline">
              Ver todos los cuadernos
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {highlightCards.map((card) => (
              <article
                key={`${card.title}-${card.accent}`}
                className="relative overflow-hidden rounded-[2rem] border border-[color:var(--app-border)] bg-white p-7 shadow-[0_18px_36px_rgba(15,23,42,0.04)]"
              >
                <div className="flex justify-between mb-8" >
                  {/* Icono */}
                  <div
                    className="size-14 rounded-full p-[1px] bg-gradient-to-br from-[#7452F5] to-[#77EADE]"
                  >
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-[#7452F5]">
                      <span className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center text-xs">*</span>
                    </div>
                  </div>

                  {/* Flecha de ir */}
                  {/* <div className={`size-14 rounded-full bg-[#7452F5]  border-2 p-3 text-white`}>
                  </div> */}
                </div>

                <div className="space-y-3">
                  <span className="inline-flex rounded-full border border-[#CC4934]/70 bg-[#FDE3DE]/30 px-6 py-2 text-xs font-medium text-rose-500">
                    {card.label}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>{card.dueText}</span>
                    <span>•</span>
                    <span>{card.sources}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4  ">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Todos los cuadernos</h2>
            </div>

            <button className="inline-flex items-center justify-center rounded-full border border-[color:var(--app-border)] bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:text-[color:var(--app-primary)]">
              Filtrar
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter, index) => (
              <button
                key={filter}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${index === 0
                  ? 'bg-[color:var(--app-primary)] text-white shadow-[0_14px_28px_rgba(116,82,245,0.24)]'
                  : 'border border-[color:var(--app-border)] bg-white text-slate-500 hover:border-[color:var(--app-primary)] hover:text-[color:var(--app-primary)]'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {notebooks.map((notebook) => (
              <article
                key={`${notebook.title}-${notebook.category}-${notebook.dueDate}`}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-[color:var(--app-border)] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.03)] sm:px-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(116,82,245,0.12),rgba(119,234,222,0.28))] text-[color:var(--app-primary)]">
                    <span className="h-4 w-4 rounded-full border-2 border-current" />
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{notebook.title}</h3>
                      {notebook.status ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                          {notebook.status}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">{notebook.category}</span>
                      <span>Ult. vez visto: {notebook.lastSeen}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-2 md:min-w-[420px] md:justify-items-end md:text-right">
                  <div>{notebook.sources}</div>
                  <div>{notebook.dueDate}</div>
                </div>

                <button className="self-start rounded-full border border-[color:var(--app-border)] bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[color:var(--app-primary)] hover:text-[color:var(--app-primary)] md:self-center">
                  Abrir
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}