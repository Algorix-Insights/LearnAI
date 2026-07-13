import Link from "next/link";
import {
  FileCheck2,
  Sparkles,
  Upload,
  Share2,
  Clock3,
  type LucideIcon,
} from "lucide-react";

type ActivityItem = {
  activity_type: string;
  occurred_at: string;
  notebook_id: string;
  notebook_name: string;
  description: string;
  quantity: number;
  duration_seconds: number;
};

type Props = {
  data: ActivityItem[];
};

const iconMap: Record<string, LucideIcon> = {
  flashcard_reviewed: Sparkles,
  study_session: FileCheck2,
  document_uploaded: Upload,
  notebook_shared: Share2,
};

export default function RecentActivityCard({ data }: Props) {
  const hasData = data.length > 0;

  const formatTime = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);

    const diff = Math.floor(
      (now.getTime() - activityDate.getTime()) / 1000
    );

    if (diff < 60) return "Hace unos segundos";

    if (diff < 3600)
      return `Hace ${Math.floor(diff / 60)} min`;

    if (diff < 86400)
      return `Hace ${Math.floor(diff / 3600)} h`;

    if (diff < 172800) return "Ayer";

    return `Hace ${Math.floor(diff / 86400)} días`;
  };

  return (
    <div
      style={{ gridArea: "activity" }}
      className="flex flex-col gap-4 rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">
          Actividad Reciente
        </p>

        <Link
          href="#"
          className="text-xs font-semibold text-[color:var(--app-primary)] hover:underline"
        >
          Ver todo
        </Link>
      </div>

      {hasData ? (
        <div className="flex flex-col gap-3">

          {data.map((item) => {
            const Icon = iconMap[item.activity_type] ?? Clock3;

            return (
              <div
                key={`${item.notebook_id}-${item.occurred_at}`}
                className="flex items-center gap-3 text-sm"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-[color:var(--app-primary)]"
                  strokeWidth={1.8}
                />

                <span className="min-w-0 flex-1 truncate text-slate-700">
                  {item.description}
                </span>

                <span className="shrink-0 text-xs text-slate-400">
                 formatTime(item.occurred_at)
                </span>
              </div>
            );
          })}

        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-6 text-center">

          <Clock3
            className="h-10 w-10 text-[color:var(--app-primary)] opacity-40"
          />

          <div>
            <p className="font-medium text-slate-700">
              Aún no hay actividad
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Cuando estudies o completes un examen, aparecerá aquí.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}