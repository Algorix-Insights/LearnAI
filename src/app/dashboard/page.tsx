'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';

import Stars from '@/assets/stars.svg';
import BarChartLearning from '@/features/Dashboard/Components/BarChart';
import DonutChartTime from '@/features/Dashboard/Components/DonutChart';
import DueSoonCard from '@/features/Dashboard/Components/DueSoon';
import LineCharRating from '@/features/Dashboard/Components/LineChart';
import { MasteredNotebooksCard } from '@/features/Dashboard/Components/Mastered';
import RecentActivityCard from '@/features/Dashboard/Components/RecentActivity';
import ReinforceCard from '@/features/Dashboard/Components/Reinforce';
import StreakCard from '@/features/Dashboard/Components/Streak';
import { useAuth } from '@/features/auth/AuthProvider';
import { AppShell } from '@/layouts/app-shell';
import { StatisticsService } from '@/services/Statistics';
import type { StatisticsPeriod } from '@/services/contracts';

const periods: Array<{ value: StatisticsPeriod; label: string }> = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'all', label: 'Año' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<StatisticsPeriod>('week');
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const statisticsQuery = useQuery({
    queryKey: ['statistics', period, timezone],
    queryFn: () => StatisticsService.getStatistics({ period, timezone }),
  });
  const statistics = statisticsQuery.data;

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

        {statisticsQuery.isPending ? (
          <div className="grid min-h-72 place-items-center rounded-2xl border border-[color:var(--app-border)] bg-white text-sm text-slate-500" role="status">
            Cargando tus estadísticas…
          </div>
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
                total: statistics.overview.total_notebooks,
              }}
            />
            <ReinforceCard data={statistics.reinforcement} />

            <div style={{ gridArea: 'learning' }} className="flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--app-border)] bg-white p-5">
              <p className="text-base font-semibold text-gray-900">Tu aprendizaje</p>
              <div className="min-h-0 flex-1">
                <BarChartLearning data={statistics.learning} />
              </div>
            </div>

            <DueSoonCard data={statistics.upcoming} />

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
