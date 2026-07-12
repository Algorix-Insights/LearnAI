import Link from "next/link";
import { Info } from "lucide-react";

type ReforzarTopic = {
  id: string;
  title: string;
  flashcards: number;
  exams: number;
  percentage: number;
};

type ReforzarData = {
  totalCount: number;
  topics: ReforzarTopic[];
};

const data: ReforzarData =  {
    totalCount: 2,
    topics: [
      { id: '1', title: 'Nombre de cuaderno uno', flashcards: 30, exams: 4, percentage: 95 },
      { id: '2', title: 'Nombre de cuaderno uno', flashcards: 30, exams: 4, percentage: 95 },
    ],
  }


export default function ReinforceCard() {
  return (
    <div
      style={{ gridArea: 'reforzar' }}
      className="flex flex-col overflow-hidden gap-4 rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">Temas por Reforzar</p>
        <span className="rounded-full bg-[color:var(--app-primary)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--app-primary)]">
          {data.totalCount} Cuadernos
        </span>
      </div>

      <div className="flex flex-col gap-7">
        {data.topics.map((topic) => (
          <div key={topic.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex gap-2 items-center">
                    <Info className="w-5 h-5 shrink-0 text-[color:var(--app-primary)]" strokeWidth={2}/>
              <p className="font-medium text-slate-700">{topic.title}</p>
                </div>
              <span className="text-xs text-slate-400">{topic.percentage}%</span>
            </div>
            <p className="text-xs text-slate-400">
              {topic.flashcards} flashcards · {topic.exams} exámenes
            </p>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-[color:var(--app-primary)]"
                style={{ width: `${topic.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="mt-2 text-xs text-slate-800 font-base hover:underline"
      >
        Ver todos los cuadernos →
      </Link>
    </div>
  );
}