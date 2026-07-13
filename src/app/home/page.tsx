'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Copy, FileText, RefreshCw } from 'lucide-react';

import BannerHome from '@/assets/BannerHome.svg';
import NewNoteBook from '@/assets/newNoteBook.svg';
import Quote from '@/assets/quote.svg';
import { ContentLoadingSkeleton } from '@/components/ContentLoadingSkeleton';
import { CreateNotebookDialog } from '@/components/CreateNotebookDialog';
import { Skeleton } from '@/components/ui/skeleton';
import StreakCard from '@/features/Dashboard/Components/Streak';
import { useAuth } from '@/features/auth/AuthProvider';
import { AppShell } from '@/layouts/app-shell';
import { StatisticsService } from '@/services/Statistics';

const quoteOfTheDay = {
  phrase: 'El esfuerzo de hoy es el éxito del mañana',
  author: 'Robert Collier',
};

const STATISTICS_STALE_TIME = 60_000;

export default function HomePage() {
  const { user } = useAuth();
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    [],
  );
  const statisticsQuery = useQuery({
    queryKey: ['statistics', 'week', timezone],
    queryFn: () => StatisticsService.getStatistics({ period: 'week', timezone }),
    staleTime: STATISTICS_STALE_TIME,
  });
  const statistics = statisticsQuery.data;
  const { greeting, today } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    return {
      today: new Intl.DateTimeFormat('es-MX', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(now),
      greeting: hour < 12
        ? 'Buenos días'
        : hour < 19
          ? 'Buenas tardes'
          : 'Buenas noches',
    };
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <section className="flex flex-col">
          <p className="text-sm font-light capitalize">{today}</p>
          <div className="flex items-center justify-between pr-4 sm:pr-12">
            <div className="min-w-0 space-y-2">
              <p className="text-2xl font-normal text-slate-700 sm:text-3xl">
                {greeting}, {user?.name || 'estudiante'}
              </p>
              <p className="bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] bg-clip-text text-4xl font-medium text-transparent">
                ¿Listo para romperla hoy?
              </p>
            </div>
            <Image
              src={BannerHome}
              alt="Espacio de estudio"
              width={340}
              height={110}
              className="hidden h-auto w-72 shrink-0 sm:block lg:w-[26rem]"
              priority
            />
          </div>
        </section>

        <div className="flex items-center gap-4 rounded-2xl border border-[color:var(--app-border)] bg-[var(--app-bg)] px-5 py-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] text-sm font-bold text-white">
            {(user?.name?.[0] || 'L').toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium text-[color:var(--app-primary)]">Frase del día</p>
            <p className="truncate text-base font-normal">
              “{quoteOfTheDay.phrase}” — <span className="text-sm font-medium">{quoteOfTheDay.author}</span>
            </p>
          </div>
          <Image src={Quote} alt="" width={40} height={40} aria-hidden="true" className="size-10" />
        </div>

        {statisticsQuery.isError ? (
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700"
            role="alert"
          >
            <div>
              <p className="font-semibold">No pudimos cargar tu actividad.</p>
              <p className="mt-0.5 text-xs text-rose-600">
                Tus estadísticas no están disponibles por el momento.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-wait disabled:opacity-60"
              disabled={statisticsQuery.isFetching}
              onClick={() => void statisticsQuery.refetch()}
            >
              <RefreshCw
                className={`size-3.5 ${statisticsQuery.isFetching ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              {statisticsQuery.isFetching ? 'Reintentando…' : 'Reintentar'}
            </button>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="flex min-h-80 flex-col rounded-2xl border border-[color:var(--app-border)] bg-white p-5">
            <p className="pb-4 text-base font-semibold">Próximas fechas límite</p>
            {statisticsQuery.isPending ? (
              <ContentLoadingSkeleton
                count={3}
                label="Cargando próximos vencimientos"
                variant="notebook"
              />
            ) : statisticsQuery.isError && !statistics ? (
              <div className="grid flex-1 place-items-center px-5 text-center text-sm text-slate-500">
                Las próximas fechas no están disponibles. Usa “Reintentar” para volver a cargarlas.
              </div>
            ) : statistics?.upcoming.length ? (
              <div className="space-y-3">
                {statistics.upcoming.map((book) => {
                  const dueDate = new Date(book.due_date);
                  const reinforcement = statistics.reinforcement.find((item) => item.notebook_id === book.notebook_id);
                  const daysLeft = Math.max(0, Math.ceil((dueDate.getTime() - Date.now()) / 86_400_000));

                  return (
                    <Link
                      key={book.notebook_id}
                      href={`/biblioteca/notebook/${book.notebook_id}`}
                      className="flex items-center gap-5 rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-bg)] px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="w-16 shrink-0 text-center">
                        <p className="text-sm capitalize text-[color:var(--app-primary)]">
                          {new Intl.DateTimeFormat('es-MX', { month: 'short' }).format(dueDate)}
                        </p>
                        <p className="text-3xl font-light">{dueDate.getDate()}</p>
                        <p className="text-xs text-slate-500">
                          {new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit' }).format(dueDate)}
                        </p>
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <p className="truncate font-medium">{book.name}</p>
                          <p className="text-xs text-slate-500">Quedan {daysLeft} días</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                            <Copy className="h-3.5 w-3.5" /> {reinforcement?.flashcards_count ?? 0} flashcards
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                            <FileText className="h-3.5 w-3.5" /> {reinforcement?.exams_count ?? 0} exámenes
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="grid flex-1 place-items-center text-center text-sm text-slate-400">
                No tienes cuadernos próximos a vencer.
              </div>
            )}
          </section>

          <div className="flex flex-col gap-4">
            <section className="flex items-center justify-between rounded-2xl border border-[color:var(--app-border)] bg-white px-8 py-6">
              <div className="max-w-sm space-y-4">
                <div>
                  <p className="text-base font-semibold">Crear cuaderno</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Organiza apuntes y fuentes para estudiar con ayuda de IA.
                  </p>
                </div>
                <CreateNotebookDialog triggerLabel="Crear cuaderno" triggerIcon />
              </div>
              <Image src={NewNoteBook} alt="" width={150} height={170} aria-hidden="true" />
            </section>

            <section className="flex min-h-52 items-center justify-between gap-4 rounded-2xl border border-[color:var(--app-border)] bg-white px-8 py-5">
              {statisticsQuery.isPending ? (
                <div
                  aria-busy="true"
                  aria-live="polite"
                  className="w-full space-y-4"
                  role="status"
                >
                  <span className="sr-only">Cargando racha de estudio</span>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : statisticsQuery.isError && !statistics ? (
                <div className="w-full text-center text-sm text-slate-500">
                  Tu racha no está disponible. Usa “Reintentar” para volver a cargarla.
                </div>
              ) : (
                <StreakCard streak={statistics?.streak} />
              )}
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
