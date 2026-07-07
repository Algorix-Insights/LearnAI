import Link from "next/link";
import { AppShell } from "@/layouts/app-shell";
import Image from "next/image";
import BannerHome from "@/assets/BannerHome.svg";

type User = {
  userName: string;
};

type QuotePhrase = {
  phrase: string;
  autor: string;
};

type DeadLineBook = {
  title: string;
  month: string;
  day: string;
  time: string;
  dayleft: number;
  flascard: number;
  exam: number;
};

type StreakDays = {
  day: string;
  completed: boolean;
};

let currentUser: User = { userName: "Bryan" };
let quoteOfTheDay: QuotePhrase = {
  phrase: "El esfuerzo de hoy es el exito del mañana",
  autor: "Robert Collier",
};
let bookWithDueTime: DeadLineBook[] = [
  {
    title: "Estrutuctura de datos y algoritmos",
    month: "Julio",
    day: "8",
    time: "18:00",
    dayleft: 2,
    flascard: 3,
    exam: 3,
  },
  {
    title: "Estrutuctura de datos y algoritmos",
    month: "Julio",
    day: "8",
    time: "18:00",
    dayleft: 2,
    flascard: 3,
    exam: 3,
  },
];

let streakDays: StreakDays[] = [
  { day: "Monday", completed: true },
  { day: "Tuesdar", completed: true },
  { day: "Wenesday", completed: true },
  { day: "Thursday", completed: false },
  { day: "Friday", completed: false },
  { day: "Saturday", completed: false },
  { day: "Sunday", completed: false },
];

let bestStreak = 15;
let currentStreak = 7;

let currentDay = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  day: "2-digit",
  month:"long",
  year: "numeric"
})

let todayCapitalized = currentDay.charAt(0).toUpperCase() + currentDay.slice(1);


export default function HomePage() {
  return (
    <AppShell>
      {/* contenedor general */}
      <div className="flex flex-col gap-6">
        {/* Hero de Bienvenida */}
        <section className="flex flex-col gap-4">

          <p className="text-sm font-light pb-3">{todayCapitalized}</p>

          <div className="flex justify-between  sm:text-left">

            <div className="flex flex-col gap-2 ">
              <p className="text-2xl font-normal text-slate-700 sm:text-3xl">Buenas Tardes, {currentUser.userName}</p>
              <p className="bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] bg-clip-text text-4xl font-medium text-transparent">¿Listo para romperla hoy?</p>
            </div>

            <div>
              <Image src={BannerHome} alt="banner de la seccion de hero" width={500} height={500} className="pr-5"/>
            </div>

          </div>

        </section>

        {/* Frase del días Quote */}
        <div className="bg-[var(--app-bg)] rounded-2xl border border-[color:var(--app-border)] flex items-center gap-4 p-3 ">
          <div>
            <Image src="/" alt="F" width={20} height={20} className="rounded-full shrink-0 object-cover bg-[color:var(--app-border)] w-12 h-12"/>
          </div>

          <div className="flex flex-1 flex-col gap-1 self-center">
            <p className="text-[color:var(--app-primary)] font-medium text-sm">Frase del día</p>
            <p className="text-base font-normal truncate">&rdquo;{quoteOfTheDay.phrase}&rdquo; — <span className="font-medium text-sm">{quoteOfTheDay.autor}</span></p>
          </div>

          <div>
            <p>imagen</p>
          </div>
        </div>

        {/* Grid para cards*/}
        <div className="bg-green-500 grid grid-cols-2 gap-4">
          {/* Cuadernos con dead lines*/}
          <div className="bg-orange-400 ">
            <p>Cuadernos</p>
          </div>

          <div className="flex flex-col">
            {/* CTA */}
            <div className="bg-pink-600">
              <p>Crear cuadernos</p>
            </div>

            {/* Racha de actividad*/}
            <div className="bg-yellow-300">
              <p>Racha</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
