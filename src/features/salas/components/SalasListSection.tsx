import Link from 'next/link';

import type { RoomItem } from '../types';

type SalasListSectionProps = {
  rooms: RoomItem[];
};

export function SalasListSection({ rooms }: SalasListSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="mt-1 text-xl font-semibold text-slate-900">Todas las salas</h2>
      </div>

      <div className="space-y-3">
        {rooms.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[color:var(--app-border)] bg-white px-5 py-10 text-center text-sm text-slate-500">
            No hay salas que coincidan con esta búsqueda.
          </div>
        ) : null}

        {rooms.map((room) => (
          <article
            key={room.id}
            className="flex flex-col gap-4 rounded-[1.5rem] border border-[color:var(--app-border)] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.03)] sm:px-5 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(116,82,245,0.12),rgba(119,234,222,0.28))] text-[color:var(--app-primary)]">
                <span className="h-4 w-4 rounded-full border-2 border-current" />
              </div>

              <div className="min-w-0 space-y-2">
                <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{room.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span>{room.createdText}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-slate-500 md:min-w-[420px] md:text-right">
              <div className="truncate">{room.detail}</div>
            </div>

            <Link
              href={`/salas/${encodeURIComponent(room.id)}`}
              className="self-start rounded-full border border-[color:var(--app-border)] bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[color:var(--app-primary)] hover:text-[color:var(--app-primary)] md:self-center"
            >
              Abrir
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}