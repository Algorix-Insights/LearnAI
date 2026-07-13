import Link from 'next/link';

import type { HighlightCard } from '../types';

type BibliotecaHighlightsSectionProps = {
  cards: HighlightCard[];
};

export function BibliotecaHighlightsSection({ cards }: BibliotecaHighlightsSectionProps) {

  if (cards.length === 0) return
  
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mt-1 text-xl font-semibold text-slate-500">Cuadernos próximos a vencer</h2>
        </div>

        <Link href="/dashboard" className="text-sm font-semibold text-[color:var(--app-primary)] hover:underline">
          Ver todos los cuadernos
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.id}
            className="relative overflow-hidden rounded-[2rem] border border-[color:var(--app-border)] bg-white p-7 shadow-[0_18px_36px_rgba(15,23,42,0.04)]"
          >
            <div className="mb-8 flex justify-between">
              <div className="size-14 rounded-full bg-gradient-to-br from-[#7452F5] to-[#77EADE] p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#7452F5]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-current text-xs">*</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-[#CC4934]/70 bg-[#FDE3DE]/30 px-6 py-2 text-xs font-medium text-rose-500">
                {card.label}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>{card.dueText}</span>
                <span>•</span>
                <span>{card.detail}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
