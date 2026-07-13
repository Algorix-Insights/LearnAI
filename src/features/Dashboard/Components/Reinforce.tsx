import Link from "next/link";
import { Info, BookOpenCheck } from "lucide-react";

type ReforzarTopic = {
  notebook_id: string;
  name: string;
  mastery_percent: number;
  flashcards_count: number;
  exams_count: number;
};

type Props = {
  data: ReforzarTopic[];
};

export default function ReinforceCard({ data }: Props) {

  const topicsToReinforce = data.filter(
    topic => topic.mastery_percent < 80
  );

  const hasData = topicsToReinforce.length > 0;

  return (
    <div
      style={{ gridArea: "reforzar" }}
      className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">
          Temas por Reforzar
        </p>

        <span className="rounded-full bg-[color:var(--app-primary)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--app-primary)]">
          {topicsToReinforce.length} Cuadernos
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center">

        {hasData ? (

          <div className="flex flex-col gap-7">

            {topicsToReinforce.map((topic) => (

              <div
                key={topic.notebook_id}
                className="flex flex-col gap-2"
              >

                <div className="flex items-center justify-between text-sm">

                  <div className="flex items-center gap-2">

                    <Info
                      className="h-5 w-5 text-[color:var(--app-primary)]"
                      strokeWidth={2}
                    />

                    <p className="font-medium text-slate-700">
                      {topic.name}
                    </p>

                  </div>

                  <span className="text-xs text-slate-400">
                    {topic.mastery_percent}%
                  </span>

                </div>

                <p className="text-xs text-slate-400">
                  {topic.flashcards_count} flashcards · {topic.exams_count} exámenes
                </p>

                <div className="h-1.5 w-full rounded-full bg-slate-100">

                  <div
                    className="h-1.5 rounded-full bg-[color:var(--app-primary)]"
                    style={{
                      width: `${topic.mastery_percent}%`
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">

            <BookOpenCheck
              className="h-10 w-10 text-[color:var(--app-primary)] opacity-40"
            />

            <div>

              <p className="font-medium text-slate-700">
                ¡Excelente trabajo!
              </p>

              <p className="mt-1 text-sm text-slate-500">
                No tienes temas pendientes por reforzar.
              </p>

            </div>

          </div>

        )}

      </div>

      <Link
        href="/"
        className="mt-2 text-xs font-base text-slate-800 hover:underline"
      >
        Ver todos los cuadernos →
      </Link>
    </div>
  );
}