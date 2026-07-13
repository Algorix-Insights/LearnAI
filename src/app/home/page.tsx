"use client";

import Link from "next/link";
import { AppShell } from "@/layouts/app-shell";
import Image from "next/image";
import BannerHome from "@/assets/BannerHome.svg";
import Quote from "@/assets/quote.svg";
import { FileText, Copy, Plus, CalendarCheck } from "lucide-react";
import NewNoteBook from "@/assets/newNoteBook.svg";
import StreakCard from "@/features/Dashboard/Components/Streak";
import { useMe } from "@/features/Dashboard/hooks/useMe";
import { useStatistics } from "@/features/Dashboard/hooks/useStatistics";
import { getQuoteOfTheDay } from "@/lib/quotes";

const quoteOfTheDay = getQuoteOfTheDay();

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function HomePage() {
  const { data: me, isLoading: loadingMe } = useMe();
  const { data: stats, isLoading: loadingStats } = useStatistics("week");

  const currentDay = new Date().toLocaleDateString("es-ES", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
  const todayCapitalized = currentDay.charAt(0).toUpperCase() + currentDay.slice(1);

  const userName = me?.name ?? "...";
  const upcoming = stats?.upcoming ?? [];
  const reinforcement = stats?.reinforcement ?? [];

  const bookWithDueTime = upcoming.map((item: any) => {
    const due = new Date(item.due_date);
    const match = reinforcement.find((r: any) => r.notebook_id === item.notebook_id);
    const dayleft = Math.max(0, Math.ceil((due.getTime() - Date.now()) / 86_400_000));

    return {
      title: item.name,
      month: due.toLocaleDateString("es-ES", { month: "long" }),
      day: String(due.getDate()),
      time: due.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      dayleft,
      flascard: match?.flashcards_count ?? 0,
      exam: match?.exams_count ?? 0,
      href: `/notebooks/${item.notebook_id}`,
    };
  });

  const streak = stats?.streak;
  const streakDays = (streak?.days ?? []).map((d: any) => ({
    day: DAY_NAMES[new Date(d.date).getUTCDay()],
    completed: d.active,
  }));

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <section className="flex flex-col">
          <p className="text-sm font-light">{todayCapitalized}</p>
          <div className="flex justify-between items-center pr-12 sm:text-left">
            <div className="flex flex-col gap-2 content-start min-w-0">
              <p className="text-2xl font-normal text-slate-700 sm:text-3xl">
                Buenas Tardes, {loadingMe ? "..." : userName}
              </p>
              <p className="bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] bg-clip-text text-4xl font-medium text-transparent">
                ¿Listo para romperla hoy?
              </p>
            </div>
            <div className="hidden shrink-0 sm:block">
              <Image src={BannerHome} alt="banner de la seccion de hero" width={340} height={110}
                className="h-auto w-72 shrink-0 pr-5 sm:w-80 lg:w-[26rem]" priority />
            </div>
          </div>
        </section>

        <div className="bg-[var(--app-bg)] rounded-2xl border border-[color:var(--app-border)] flex items-center gap-4 py-3 px-5 ">
          <div>
            <Image src="/" alt="F" width={20} height={20}
              className="rounded-full shrink-0 object-cover bg-[color:var(--app-border)] w-12 h-12" />
          </div>
          <div className="flex flex-1 flex-col gap-1 self-center">
            <p className="text-[color:var(--app-primary)] font-medium text-base">Frase del día</p>
            <p className="text-base font-normal truncate">
              &rdquo;{quoteOfTheDay.phrase}&rdquo; — <span className="font-medium text-sm">{quoteOfTheDay.autor}</span>
            </p>
          </div>
          <div>
             {quoteOfTheDay.image ? (
          <Image src={quoteOfTheDay.image} alt={quoteOfTheDay.autor} width={40} height={40} className="rounded-full" />
  ) : (
    <Image src={Quote} alt="comilla decorativa" width={40} height={40} />
  )}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:h-[200px]">
          <div className="bg-white border border-[color:var(--app-border)] rounded-2xl p-5 h-full overflow-y-auto flex flex-col">
            <p className="shrink-0 font-semibold text-base pb-4">Cuadernos con próximas fechas limites</p>
            <div className="flex flex-1 min-h-0 flex-col gap-6 overflow-y-auto">
              {loadingStats ? (
                <p className="text-sm text-gray-500">Cargando...</p>
              ) : bookWithDueTime.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--app-primary)]/5">
          <CalendarCheck className="h-12 w-12 text-[color:var(--app-primary)]" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">Todo en orden</p>
          <p className="text-xs text-slate-400">No tienes cuadernos con fechas próximas.</p>
        </div>
      </div>
              ) : (
                bookWithDueTime.map((book) => (
                  <Link key={book.href} href={book.href}
                    className="flex items-center gap-16 rounded-md border border-[color:var(--app-border)] bg-[color:var(--app-bg)] px-10 py-5 transition hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    <div className="flex flex-col shrink-0 text-center gap-1">
                      <p className="text-[color:var(--app-primary)] text-base font-normal">{book.month}</p>
                      <p className="text-4xl font-light">{book.day}</p>
                      <p className="text-gray-600 text-sm font-normal">{book.time}</p>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="flex gap-4 items-center justify-center">
                        <span className="h-12 w-12 shrink-0 rounded-full border-2 border-[color:var(--app-secondary)]" />
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-medium truncate">{book.title}</p>
                          <p className="text-xs font-normal">Quedan {book.dayleft} días</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <p className="flex rounded-lg bg-gray-200 text-xs font-normal p-1.5 gap-2">
                          <Copy className="w-4 h-4 shrink-0" strokeWidth={1} />{book.flascard} Flashcards
                        </p>
                        <p className="flex rounded-lg bg-gray-200 text-xs font-normal p-1.5 gap-2">
                          <FileText className="w-4 h-4 shrink-0" strokeWidth={1} />{book.exam} Exámenes
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="flex h-full flex-col gap-6">
            <div className="shrink-0 border border-[color:var(--app-border)] rounded-2xl py-5 px-8 bg-white flex justify-between items-center ">
              <div className="flex flex-col gap-6">
                <p className="font-semibold text-base">Crear cuadernos</p>
                <p className="text-gray-600 text-sm font-base">
                  Organiza tus apuntes y recursos en un<br />cuaderno para que la IA pueda ayudarte<br />a aprender.
                </p>
                <Link href="/" className="inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-full bg-[color:var(--app-primary)] px-5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(116,82,245,0.24)] transition hover:translate-y-[-1px]">
                  Crear cuaderno <Plus className="h-4 w-4" strokeWidth={2.5} />
                </Link>
              </div>
              <div className="flex w-32 shrink-0 justify-center">
                <Image src={NewNoteBook} alt="" width={150} height={170} className="shrink-0" />
              </div>
            </div>

            <div className="shrink-0 border border-[color:var(--app-border)] rounded-2xl py-5 px-8 bg-white flex justify-between items-center">
              <StreakCard
                days={streakDays}
                current={streak?.current_days ?? 0}
                best={streak?.best_days ?? 0}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}