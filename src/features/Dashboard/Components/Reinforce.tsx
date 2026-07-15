import Link from "next/link";
import { Info } from "lucide-react";
import type { ReinforcementNotebook } from '@/services/contracts';

const MAX_VISIBLE = 2;

export default function ReinforceCard({ data = [] }: { data?: ReinforcementNotebook[] }) {
  // Los más graves primero (menor dominio = más urgente reforzar)
  const sorted = [...data].sort((a, b) => a.mastery_percent - b.mastery_percent);
  const visible = sorted.slice(0, MAX_VISIBLE);
  const remaining = data.length - visible.length;

  return (
    <div
      style={{ gridArea: 'reforzar' }}
      className="flex flex-col overflow-hidden gap-4 rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">Temas por Reforzar</p>
        <span className="rounded-full bg-[color:var(--app-primary)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--app-primary)]">
          {data.length} cuadernos
        </span>
      </div>

      <div className="flex flex-col gap-7">
        {visible.length === 0 ? (
          <p className="text-sm text-slate-400">No hay temas pendientes por reforzar.</p>
        ) : visible.map((topic) => (
          <div key={topic.notebook_id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex gap-2 items-center">
                    <Info className="w-5 h-5 shrink-0 text-[color:var(--app-primary)]" strokeWidth={2}/>
              <p className="font-medium text-slate-700">{topic.name}</p>
                </div>
              <span className="text-xs text-slate-400">{topic.mastery_percent}%</span>
            </div>
            <p className="text-xs text-slate-400">
              {topic.flashcards_count} flashcards · {topic.exams_count} exámenes
            </p>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-[color:var(--app-primary)]"
                style={{ width: `${Math.min(100, Math.max(0, topic.mastery_percent))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/biblioteca"
        className="mt-2 text-xs text-slate-800 font-base hover:underline"
      >
        {remaining > 0
          ? `Ver los demás cuadernos (${remaining}) →`
          : "Ver todos los cuadernos →"}
      </Link>
    </div>
  );
}