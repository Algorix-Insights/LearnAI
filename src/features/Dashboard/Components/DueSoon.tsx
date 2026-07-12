import Link from "next/link";
import { ClipboardClock } from "lucide-react";

type UpcomingDueItem = {
  id: string;
  title: string;
  dueDate: string;
  href: "/";
};

const  data : UpcomingDueItem[] = [
    { id: '1', title: 'Estructura de datos...', dueDate: '12 Jun, 2026', href: '/' },
    { id: '2', title: 'Estructura de datos...', dueDate: '16 Jun, 2026', href: '/' },
    { id: '3', title: 'Estructura de datos...', dueDate: '16 Jun, 2026', href: '/' }
  ]

export  default function DueSoonCard() {
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
        {data.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center justify-between gap-3 text-sm transition hover:text-[color:var(--app-primary)]"
          >
            <span className="min-w-0 flex-1 truncate text-slate-700">{item.title}</span>
            <span className="shrink-0 text-xs text-slate-400">{item.dueDate}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}