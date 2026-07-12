import Link from "next/link";
import { AppShell } from "@/layouts/app-shell";
import Image from "next/image";
import BannerHome from "@/assets/BannerHome.svg";
import Quote from "@/assets/quote.svg";
import { FileText, Copy, Plus } from "lucide-react";
import NewNoteBook from "@/assets/newNoteBook.svg"
import FlameStreak from "@/assets/flameStreak.svg"
import StreakCard from "@/features/Dashboard/Components/Streak";
import { requireAuth } from '@/lib/require-auth';


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
  href: string;
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
    href: "/",
  },
  {
    title: "Estrutuctura de datos y algoritmos",
    month: "Julio",
    day: "8",
    time: "18:00",
    dayleft: 2,
    flascard: 3,
    exam: 3,
    href: "/",
  },
  // {
  //   title: "Estrutuctura de datos y algoritmos",
  //   month: "Julio",
  //   day: "8",
  //   time: "18:00",
  //   dayleft: 2,
  //   flascard: 3,
  //   exam: 3,
  //   href: "/",
  // },
  // {
  //   title: "Estrutuctura de datos y algoritmos",
  //   month: "Julio",
  //   day: "8",
  //   time: "18:00",
  //   dayleft: 2,
  //   flascard: 3,
  //   exam: 3,
  //   href: "/",
  // },
];

let streakDays: StreakDays[] = [
  { day: "Lunes", completed: true },
  { day: "Martes", completed: true },
  { day: "Miércoles", completed: true },
  { day: "Jueves", completed: false },
  { day: "Viernes", completed: false },
  { day: "Sábado", completed: false },
  { day: "Domingo", completed: false },
];

let bestStreak = 15;
let currentStreak = 7;

let currentDay = new Date().toLocaleDateString("es-ES", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

let todayCapitalized = currentDay.charAt(0).toUpperCase() + currentDay.slice(1);

export default async function HomePage() {
  await requireAuth();
  return (
    <AppShell>
      {/* contenedor general */}
      <div className="flex flex-col gap-6">
        {/* Hero de Bienvenida */}
        <section className="flex flex-col">
          <p className="text-sm font-light">{todayCapitalized}</p>

          <div className="flex justify-between items-center pr-12 sm:text-left">
            <div className="flex flex-col gap-2 content-start min-w-0">
              <p className="text-2xl font-normal text-slate-700 sm:text-3xl">
                Buenas Tardes, {currentUser.userName}
              </p>
              <p className="bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] bg-clip-text text-4xl font-medium text-transparent">
                ¿Listo para romperla hoy?
              </p>
            </div>

            <div className="hidden shrink-0 sm:block">
              <Image
                src={BannerHome}
                alt="banner de la seccion de hero"
                width={340}
                height={110}
                className="h-auto w-72 shrink-0 pr-5 sm:w-80 lg:w-[26rem]"
                priority
              />
            </div>
          </div>
        </section>

        {/* Frase del día */}
        <div className="bg-[var(--app-bg)] rounded-2xl border border-[color:var(--app-border)] flex items-center gap-4 py-3 px-5 ">
          <div>
            <Image
              src="/"
              alt="F"
              width={20}
              height={20}
              className="rounded-full shrink-0 object-cover bg-[color:var(--app-border)] w-12 h-12"
            />
          </div>

          <div className="flex flex-1 flex-col gap-1 self-center">
            <p className="text-[color:var(--app-primary)] font-medium text-base">
              Frase del día
            </p>
            <p className="text-base font-normal truncate">
              &rdquo;{quoteOfTheDay.phrase}&rdquo; —{" "}
              <span className="font-medium text-sm">{quoteOfTheDay.autor}</span>
            </p>
          </div>

          <div>
            <Image
              src={Quote}
              alt="comilla decorativa"
              width={40}
              height={40}
            />
          </div>
        </div>

        {/* Grid para cards*/}
        <div className="grid grid-cols-2 gap-4 lg:h-[200px]">

          {/* Cuadernos con dead lines*/}
          <div className="bg-white border border-[color:var(--app-border)] rounded-2xl p-5 h-full overflow-y-auto flex flex-col">
            <p className="shrink-0 font-semibold text-base pb-4">
              Cuadernos con próximas fechas limites
            </p>
            {/* Card para cada cuaderno*/}
            <div className="flex flex-1 min-h-0 flex-col gap-6 overflow-y-auto">
              {bookWithDueTime.map((book, index) => (
                <Link
                  key={index}
                  href={book.href}
                  className="flex items-center gap-16 rounded-md border border-[color:var(--app-border)] bg-[color:var(--app-bg)] px-10 py-5 transition hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex flex-col shrink-0 text-center gap-1">
                    <p className="text-[color:var(--app-primary)] text-base font-normal">
                      {book.month}
                    </p>
                    <p className="text-4xl font-light">{book.day}</p>
                    <p className="text-gray-600 text-sm font-normal">
                      {book.time}
                    </p>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4 items-center justify-center">
                      <span className="h-12 w-12 shrink-0 rounded-full border-2 border-[color:var(--app-secondary)]" />

                      <div className="flex flex-col gap-1">
                        <p className="text-base font-medium truncate">
                          {book.title}
                        </p>
                        <p className="text-xs font-normal">
                          Quedan {book.dayleft} días
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <p className="flex rounded-lg bg-gray-200 text-xs font-normal p-1.5 gap-2">
                        <Copy
                          className="w-4 h-4 shrink-0"
                          strokeWidth={1}
                        />
                        {book.flascard} Flashcards
                      </p>
                      <p className=" flex rounded-lg bg-gray-200 text-xs font-normal p-1.5 gap-2">
                        <FileText
                          className="w-4 h-4 shrink-0"
                          strokeWidth={1}
                        />
                        {book.exam} Exámenes
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col gap-6">
            {/* CTA */}
            <div className="shrink-0 border border-[color:var(--app-border)] rounded-2xl py-5 px-8 bg-white flex justify-between items-center ">
              <div className="flex flex-col gap-6">
                <p className="font-semibold text-base">Crear cuadernos</p>
                <p className="text-gray-600 text-sm font-base">
                  Organiza tus apuntes y recursos en un<br></br>
                  cuaderno para que la IA pueda ayudarte<br></br>
                  a aprender.
                </p>

                <Link
                  href="/"
                  className="inline-flex  h-11 shrink-0 items-center justify-center gap-1 rounded-full bg-[color:var(--app-primary)] px-5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(116,82,245,0.24)] transition hover:translate-y-[-1px]"
                >
                  Crear cuaderno
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </Link>
              </div>

              <div className="flex w-32 shrink-0 justify-center">
                <Image src={NewNoteBook} alt="" width={150} height={170} className="shrink-0" />
              </div>
            </div>


            {/* Racha de actividad*/}
            <div className="shrink-0 border border-[color:var(--app-border)] rounded-2xl py-5 px-8 bg-white flex justify-between items-center">
              <StreakCard />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
