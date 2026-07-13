import Link from "next/link";
import { ClipboardClock } from "lucide-react";
import type { UpcomingNotebook } from '@/services/contracts';

export default function DueSoonCard({ data = [] }: { data?: UpcomingNotebook[] }) {
  return (
    <div
      style={{ gridArea: 'proximos' }}
      className="flex flex-col gap-4 rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
    >
      <div className="flex justify-between items-center">
              <p className="text-base font-semibold text-gray-900">
                Proximos a vencer
              </p>
              <ClipboardClock className="w-5 h-5 shrink-0 text-[#FD9F00]"
              strokeWidth={2}/>
            </div>

      <div className="flex flex-col gap-5">
        {data.length === 0 ? (
          <p className="text-sm text-slate-400">No tienes fechas próximas.</p>
        ) : data.map((item) => (
          <Link
            key={item.notebook_id}
            href={`/biblioteca/notebook/${item.notebook_id}`}
            className="flex items-center justify-between gap-3 text-sm transition hover:text-[color:var(--app-primary)]"
          >
            <span className="min-w-0 flex-1 truncate text-slate-700">{item.name}</span>
            <span className="shrink-0 text-xs text-slate-400">
              {new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(item.due_date))}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
