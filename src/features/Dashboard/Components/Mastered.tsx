import { BookOpen } from "lucide-react";

type MasteredNotebooksData = {
  mastered: number;
  total: number;
};

type MasteredNotebooksCardProps = {
  data: MasteredNotebooksData;
};

export function MasteredNotebooksCard({ data }: MasteredNotebooksCardProps) {
  const hasData = data.total > 0;

  const percentage = data.total === 0 ? 0 : data.mastered / data.total;
  const percentageLabel = Math.round(percentage * 100);

  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percentage);

  return (
    <div
      style={{ gridArea: 'mastered' }}
      className="flex flex-col items-center justify-center gap-8 rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
    >
      <p className="text-base font-semibold text-gray-900 self-start">
        Cuadernos dominados
      </p>

      {hasData ? (
        <>
          {/* --- Progreso --- */}
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              {/* Círculo gris de fondo */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--app-border)"
                strokeWidth={strokeWidth}
              />

              {/* Círculo morado de progreso */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--app-primary)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl font-bold text-slate-800">
                {data.mastered} / {data.total}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-800 font-base">
            {percentageLabel}% del total de tus cuadernos
          </p>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <BookOpen
            className="h-12 w-12 text-[color:var(--app-primary)] opacity-40"
          />

          <div>
            <p className="font-medium text-slate-700">
              Aún no tienes cuadernos
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Crea un cuaderno y domínalo para ver tu progreso aquí.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}