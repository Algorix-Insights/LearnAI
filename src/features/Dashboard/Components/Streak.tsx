import FlameStreak from "@/assets/flameStreak.svg"
import Image from "next/image";
import type { StreakStatistics } from '@/services/contracts';

type StreakCardProps = {
  streak?: StreakStatistics;
};

export default function StreakCard({
  streak = { current_days: 0, best_days: 0, days: [] },
}: StreakCardProps) {
    const days = streak.days.slice(-7);

    return(     
        <>
            <div className="flex flex-col gap-10">
            <div className="flex flex-col">
                <p className="text-sm font-semibold text-slate-800">Racha</p>
                <p className="text-sm font-normal text-slate-600">Tu mejor racha: {streak.best_days}</p>
            </div>

            <div className="flex gap-3">
                {days.length === 0 ? (
                    <p className="text-xs text-slate-400">Aún no hay actividad registrada.</p>
                ) : days.map((day) => (
                    <div key={day.date} className="flex flex-col items-center gap-4">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${day.active
                                    ? 'bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))]'
                                    : 'bg-slate-200'}`}
                        >
                            <svg
                                viewBox="0 0 20 20"
                                className={`h-4 w-4 ${day.active ? 'text-white' : 'text-slate-400'}`}
                                fill="none"
                            >
                                <path
                                    d="M4 10.5L8 14.5L16 5.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="text-[10px] capitalize text-slate-400">
                            {new Intl.DateTimeFormat('es-MX', { weekday: 'short' }).format(
                                new Date(`${day.date}T12:00:00Z`),
                            )}
                        </p>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex w-32 shrink-0 flex-col items-center gap-1">
                <Image src={FlameStreak} alt="Icono de llamas para racha" width={70} height={70} className="size-[70px] shrink-0" />
                <p className="text-xl font-semibold text-slate-800">{streak.current_days} días</p>
                <p className="text-xs font-normal">(actual)</p>
        </div>
            </>
    )
}
