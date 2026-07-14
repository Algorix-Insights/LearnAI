'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, Trophy } from 'lucide-react';

import Stars from '@/assets/stars.svg';
import { ContentLoadingSkeleton } from '@/components/ContentLoadingSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import DueSoonCard from '@/features/Dashboard/Components/DueSoon';
import { MasteredNotebooksCard } from '@/features/Dashboard/Components/Mastered';
import RecentActivityCard from '@/features/Dashboard/Components/RecentActivity';
import ReinforceCard from '@/features/Dashboard/Components/Reinforce';
import StreakCard from '@/features/Dashboard/Components/Streak';
import { useAuth } from '@/features/auth/AuthProvider';
import { AppShell } from '@/layouts/app-shell';
import { NotebookService } from '@/services/Notebook';
import { StatisticsService } from '@/services/Statistics';
import type {
  Notebook,
  ReinforcementNotebook,
  StatisticsPeriod,
  UpcomingNotebook,
} from '@/services/contracts';

const periods: Array<{ value: StatisticsPeriod; label: string }> = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'all', label: 'Año' },
];

const STATISTICS_STALE_TIME = 60_000;
const NOTEBOOKS_STALE_TIME = 5 * 60_000;

function ChartLoading({ className, label }: { className: string; label: string }) {
  return (
    <div aria-busy="true" aria-live="polite" className={className} role="status">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-full w-full" />
    </div>
  );
}

const LineCharRating = dynamic(
  () => import('@/features/Dashboard/Components/LineChart'),
  {
    loading: () => <ChartLoading className="h-32 w-full" label="Cargando gráfica de calificación" />,
    ssr: false,
  },
);

const BarChartLearning = dynamic(
  () => import('@/features/Dashboard/Components/BarChart'),
  {
    loading: () => <ChartLoading className="h-56 w-full" label="Cargando gráfica de aprendizaje" />,
    ssr: false,
  },
);

const DonutChartTime = dynamic(
  () => import('@/features/Dashboard/Components/DonutChart'),
  {
    loading: () => <ChartLoading className="h-48 w-full" label="Cargando distribución de tiempo" />,
    ssr: false,
  },
);

function hasNotebookId(
  notebook: Notebook,
): notebook is Notebook & { notebook_id: string } {
  return Boolean(notebook.notebook_id);
}

function notebookTimestamp(notebook: Notebook) {
  const timestamp = notebook.created_at
    ? new Date(notebook.created_at).getTime()
    : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function selectDashboardNotebooks(response: { data: Notebook[] }) {
  return response.data
    .filter(hasNotebookId)
    .filter((notebook) => notebook.status !== 'deleted')
    .sort((left, right) => notebookTimestamp(right) - notebookTimestamp(left));
}

const EMPTY_NOTEBOOKS: ReturnType<typeof selectDashboardNotebooks> = [];

export default function DashboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<StatisticsPeriod>('week');
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    [],
  );
  const statisticsQuery = useQuery({
    queryKey: ['statistics', period, timezone],
    queryFn: () => StatisticsService.getStatistics({ period, timezone }),
    staleTime: STATISTICS_STALE_TIME,
  });
  const notebooksQuery = useQuery({
    queryKey: ['notebooks'],
    queryFn: () => NotebookService.list({ limit: 500, offset: 0 }),
    select: selectDashboardNotebooks,
    staleTime: NOTEBOOKS_STALE_TIME,
  });
  const statistics = statisticsQuery.data;
  const notebooks = notebooksQuery.data ?? EMPTY_NOTEBOOKS;
  const { reinforcement, upcoming } = useMemo<{
    reinforcement: ReinforcementNotebook[];
    upcoming: UpcomingNotebook[];
  }>(() => {
    if (!statistics) return { reinforcement: [], upcoming: [] };

    const now = Date.now();
    const reinforcementIds = new Set(
      statistics.reinforcement.map((item) => item.notebook_id),
    );
    const upcomingIds = new Set(
      statistics.upcoming.map((item) => item.notebook_id),
    );

    return {
      reinforcement: [
        ...statistics.reinforcement,
        ...notebooks
          .filter(
            (notebook) =>
              !reinforcementIds.has(notebook.notebook_id) &&
              notebook.is_dominated !== true,
          )
          .map((notebook) => ({
            notebook_id: notebook.notebook_id,
            name: notebook.name || 'Cuaderno sin nombre',
            mastery_percent: 0,
            flashcards_count: 0,
            exams_count: 0,
          })),
      ],
      upcoming: [
        ...statistics.upcoming,
        ...notebooks
          .filter((notebook) => {
            if (!notebook.due_date || upcomingIds.has(notebook.notebook_id)) {
              return false;
            }
            const dueTime = new Date(notebook.due_date).getTime();
            return Number.isFinite(dueTime) && dueTime >= now;
          })
          .map((notebook) => ({
            notebook_id: notebook.notebook_id,
            name: notebook.name || 'Cuaderno sin nombre',
            due_date: notebook.due_date!,
          })),
      ].sort(
        (left, right) =>
          new Date(left.due_date).getTime() - new Date(right.due_date).getTime(),
      ),
    };
  }, [notebooks, statistics]);

  return (
    <AppShell activeHref="/dashboard">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-6 pr-4 sm:pr-12">
          <div className="min-w-0 flex-1 space-y-4">
            <p className="bg-[linear-gradient(135deg,var(--app-secondary),var(--app-primary))] bg-clip-text text-4xl font-medium text-transparent">
              Echa un vistazo a tu <br /> progreso, {user?.name || 'estudiante'}
            </p>
            <p className="text-sm font-normal text-slate-700">
              Métricas reales de tus rachas, calificaciones y temas dominados.
            </p>
            <div className="inline-flex rounded-full border border-[color:var(--app-border)] bg-white p-1">
              {periods.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${period === item.value
                    ? 'bg-[color:var(--app-primary)] text-white'
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <Image
            src={Stars}
            alt="Estrellas decorativas"
            className="hidden h-auto w-64 shrink-0 sm:block"
            priority
          />
        </div>

        <section className="rounded-2xl border border-[color:var(--app-border)] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-900">Tus cuadernos</p>
              <p className="mt-1 text-xs text-slate-500">
                Cuadernos personales y compartidos disponibles para tu usuario.
              </p>
            </div>
            <Link
              href="/biblioteca"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--app-primary)] hover:underline"
            >
              Ver biblioteca
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {notebooksQuery.isPending ? (
            <ContentLoadingSkeleton
              className="mt-5"
              count={3}
              label="Cargando cuadernos"
              variant="notebook-card"
            />
          ) : notebooksQuery.isError ? (
            <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
              {notebooksQuery.error instanceof Error
                ? notebooksQuery.error.message
                : 'No fue posible cargar tus cuadernos.'}
            </p>
          ) : notebooks.length === 0 ? (
            <p className="mt-5 rounded-xl border border-dashed border-[color:var(--app-border)] p-5 text-sm text-slate-500">
              Aún no tienes cuadernos relacionados con tu usuario.
            </p>
          ) : (
            <div className="mt-5 grid max-h-80 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
              {notebooks.map((notebook) => (
                <Link
                  key={notebook.notebook_id}
                  href={`/biblioteca/notebook/${notebook.notebook_id}`}
                  className="flex items-center gap-3 rounded-xl border border-[color:var(--app-border)] bg-slate-50/70 p-4 transition hover:border-[color:var(--app-primary)] hover:bg-white"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--app-primary)]/10 text-[color:var(--app-primary)]">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">
                      {notebook.name || 'Cuaderno sin nombre'}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {notebook.due_date
                        ? `Vence ${new Intl.DateTimeFormat('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }).format(new Date(notebook.due_date))}`
                        : 'Sin fecha límite'}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {statisticsQuery.isPending ? (
          <ContentLoadingSkeleton
            count={6}
            label="Cargando tus estadísticas"
            variant="metric"
          />
        ) : statisticsQuery.isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700" role="alert">
            {statisticsQuery.error instanceof Error
              ? statisticsQuery.error.message
              : 'No fue posible cargar tus estadísticas.'}
          </div>
        ) : statistics ? (
          <div className="dashboard-grid">
            <div
              style={{ gridArea: 'rating' }}
              className="rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-gray-900">Calificación promedio</p>
                  <Trophy className="h-6 w-6 text-[color:var(--app-primary)]" strokeWidth={2} />
                </div>
                <p className="text-4xl font-semibold text-[color:var(--app-primary)]">
                  {statistics.overview.average_score.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-600">
                  {statistics.overview.completed_exams} de {statistics.overview.total_exams} exámenes completados
                </p>
              </div>
              <LineCharRating data={statistics.learning} />
            </div>

            <MasteredNotebooksCard
              data={{
                mastered: statistics.overview.notebooks_dominated,
                total: Math.max(
                  statistics.overview.total_notebooks,
                  notebooks.length,
                ),
              }}
            />
            <ReinforceCard data={reinforcement} />

            <div style={{ gridArea: 'learning' }} className="flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--app-border)] bg-white p-5">
              <p className="text-base font-semibold text-gray-900">Tu aprendizaje</p>
              <div className="min-h-0 flex-1">
                <BarChartLearning data={statistics.learning} />
              </div>
            </div>

            <DueSoonCard data={upcoming} />

            <div style={{ gridArea: 'streak' }} className="flex h-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[color:var(--app-border)] bg-white p-5">
              <StreakCard streak={statistics.streak} />
            </div>

            <RecentActivityCard data={statistics.recent_activity} />

            <div style={{ gridArea: 'dedicated' }} className="flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--app-border)] bg-white p-5">
              <p className="mb-4 text-base font-semibold text-gray-900">Tiempo dedicado</p>
              <DonutChartTime data={statistics.time_by_notebook} />
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
