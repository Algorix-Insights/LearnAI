
import Link from "next/link";
import { AppShell } from "@/layouts/app-shell";
import Image from "next/image";
import Stars from "@/assets/stars.svg";
import LineChartRating from "@/features/Dashboard/Components/LineChart"
import BarChartLearning from "@/features/Dashboard/Components/BarChart"
import DonutChartTime from "@/features/Dashboard/Components/DonutChart"
import ReinforceCard from "@/features/Dashboard/Components/Reinforce";
import DueSoonCard from "@/features/Dashboard/Components/DueSoon";
import StreakCard from "@/features/Dashboard/Components/Streak";
import RecentActivityCard from "@/features/Dashboard/Components/RecentActivity"
import { MasteredNotebooksCard } from "@/features/Dashboard/Components/Mastered";
import { getDashboardStatistics, getProfile } from "@/services/dashboard";  

import { requireAuth } from '@/lib/require-auth';

export default async function DashboardPage() {
    await requireAuth();

    const [statistics, profile] = await Promise.all([
        getDashboardStatistics(),
        getProfile(),
    ]);

    return (
        <AppShell activeHref="/dashboard">
            {/* Contenedor general */}
            <div className="flex flex-col gap-6">
                {/* Banner */}
                <div className="flex justify-between items-center pr-12">
                    <div className="flex flex-col flex-1 gap-4 min-w-0">
                        <p className="bg-[linear-gradient(135deg,var(--app-secondary),var(--app-primary))] bg-clip-text text-4xl font-medium text-transparent">
                            Hecha un vistazo a tu <br />
                            progreso, {profile.name ?? "Usuario"}
                        </p>
                        <p className="font-normal text-sm text-slate-700">
                            Panel de métricas a tus rachas, calificaciones y temas dominados.
                        </p>
                    </div>

                    <div className="hidden shrink-0 sm:block">
                        <Image
                            src={Stars}
                            alt="Imagen banner estrellas"
                            className="h-auto w-72 shrink-0 pr-5 sm:w-58 lg:w-[16rem]"
                        />
                    </div>
                </div>
                {/* Grid dashboard */}
                <div className="dashboard-grid">
                    {/* Calificacion promedio */}
                    <div
                        style={{ gridArea: "rating" }}
                        className="rounded-2xl border borde-[color:var(--app-border)] bg-white p-5"
                    >
                     <LineChartRating
  data={statistics.learning}
  averageScore={statistics.overview?.average_score}
/>
                    </div>

                    {/* Cuadernos dominados */}
                   <MasteredNotebooksCard data={{ mastered: statistics.overview?.notebooks_dominated ?? 0, total: statistics.overview?.total_notebooks ?? 0,}}/> 

                    {/* Temas por reforzar */}
                    <ReinforceCard data={statistics.reinforcement} />

                    {/* Tu aprendizaje */}
                    <div style={{ gridArea: "learning" }}
                        className="flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--app-border)] bg-white p-5">
                        <p className="text-base font-semibold text-gray-900">Tu aprendizaje</p>
                        <div className="min-h-0 flex-1">
                            <BarChartLearning data={statistics.learning}/>
                        </div>
                    </div>

                    {/* Proximos a vencer*/}
                    <DueSoonCard data={statistics.upcoming} />

                    {/* Racha*/}
                    <div style={{ gridArea: 'streak' }}
                        className="flex h-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[color:var(--app-border)] bg-white p-5">
                        <StreakCard />
                    </div>

                    {/* Actividades Recientes */}
                    <RecentActivityCard data={statistics.recent_activity} />

                    {/* Tiempo dedicado */}
                    <div style={{ gridArea: 'dedicated' }}
                        className="flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--app-border)] bg-white p-5">
                        <p className="text-base font-semibold text-gray-900 mb-4">Tiempo dedicado</p>
                        <DonutChartTime data={statistics.time_by_notebook} />
                    </div>

                </div>
            </div>
        </AppShell>
    );
}
