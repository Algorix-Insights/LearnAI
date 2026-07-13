import type { NotebookItem } from '../types';

type BibliotecaNotebooksSectionProps = {
  filters: string[];
  notebooks: NotebookItem[];
};

export function BibliotecaNotebooksSection({ filters, notebooks }: BibliotecaNotebooksSectionProps) {
  return (
    <section className="space-y-4">
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
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              index === 0
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
  );
}