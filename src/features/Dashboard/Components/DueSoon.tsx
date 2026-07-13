import Link from "next/link";
import { ClipboardClock, CalendarX2 } from "lucide-react";

type UpcomingDueItem = {
  notebook_id: string;
  name: string;
  due_date: string;
};

type Props = {
  data: UpcomingDueItem[];
};

export default function DueSoonCard({ data }: Props) {

  const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const hasData = data.length > 0;

  return (
    <div
      style={{ gridArea: 'proximos' }}
      className="flex flex-col gap-4 rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
    >
      <p className="text-base font-semibold text-gray-900">Próximos a vencer</p>
      <div className="flex flex-1 flex-col justify-center">
  {hasData ? (
    <div className="flex flex-col gap-5">
      {data.map((item) => (
        <Link
          key={item.notebook_id}
          href="#"
          className="flex items-center justify-between gap-3 text-sm transition hover:text-[color:var(--app-primary)]"
        >
          <span className="min-w-0 flex-1 truncate text-slate-700">
            {item.name}
          </span>

          <span className="shrink-0 text-xs text-slate-400">
            {formatDate(item.due_date)}
          </span>
        </Link>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
      <CalendarX2
        className="h-10 w-10 text-[#FD9F00] opacity-40"
      />

      <div>
        <p className="font-medium text-slate-700">
          No tienes vencimientos próximos
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Todos tus cuadernos están al día.
        </p>
      </div>
    </div>
  )}
</div>
    </div>
  );
}