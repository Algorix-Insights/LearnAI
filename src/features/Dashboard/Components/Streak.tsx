import FlameStreak from "@/assets/flameStreak.svg"
import Image from "next/image";

type StreakDay = {
  day: string;
  completed: boolean;
};

type StreakCardProps = {
  days?: StreakDay[];
  current?: number;
  best?: number;
};

const defaultDays: StreakDay[] = [
  { day: "Lunes", completed: false },
  { day: "Martes", completed: false },
  { day: "Miércoles", completed: false },
  { day: "Jueves", completed: false },
  { day: "Viernes", completed: false },
  { day: "Sábado", completed: false },
  { day: "Domingo", completed: false },
];

export default function StreakCard({ days = defaultDays, current = 0, best = 0 }: StreakCardProps) {
    return(     
        <>
            <div className="flex flex-col gap-10">
            <div className="flex flex-col">
                <p className="text-sm font-semibold text-slate-800">Racha</p>
                <p className="text-sm font-normal text-slate-600">Tu mejor racha: {best}</p>
            </div>

            <div className="flex gap-3">
                {days.map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-4">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${day.completed
                                    ? 'bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))]'
                                    : 'bg-slate-200'}`}
                        >
                            <svg
                                viewBox="0 0 20 20"
                                className={`h-4 w-4 ${day.completed ? 'text-white' : 'text-slate-400'}`}
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
                        <p className="text-[10px] text-slate-400">{day.day}</p>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex w-32 shrink-0 flex-col items-center gap-1">
                <Image src={FlameStreak} alt="Icono de llamas para racha" width={70} height={70} className="shrink-0" />
                <p className="text-xl font-semibold text-slate-800">{current} Dias </p>
                <p className="text-xs font-normal">(actual)</p>
        </div>
            </>
    )
}