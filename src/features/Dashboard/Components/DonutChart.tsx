'use client';

import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Trophy, TrendingUp } from "lucide-react";

type LearningPoint = {
  date: string;
  exams_completed: number;
  flashcards_reviewed: number;
};

type Props = {
  data: LearningPoint[];
  averageScore?: number;
};

export default function LineChartRating({ data, averageScore = 0 }: Props) {

  const chartData = data.map(item => ({
    dia: new Date(item.date).toLocaleDateString("es-MX", {
      weekday: "short",
    }),
    progreso: item.exams_completed,
  }));

  const hasData =
    chartData.length > 0 &&
    chartData.some(item => item.progreso > 0);

  return (
    <div className="flex h-full flex-col gap-1">

        {hasData ? (
            <>
                <div className="flex justify-between items-center">
                    <p className="text-base font-semibold text-gray-900">
                        Calificación Promedio
                    </p>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--app-primary)]/30 bg-[color:var(--app-primary)]/5">
                        <Trophy className="w-5 h-5 text-[color:var(--app-primary)]" strokeWidth={2} />
                    </div>
                </div>

                <p className="text-4xl font-semibold text-[color:var(--app-secondary)]">
                    {Math.round(averageScore)}
                    <span className="text-lg font-medium">%</span>
                </p>
                <p className="text-xs text-slate-800 font-base">Media de flashcards y exámenes</p>

                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
                            <XAxis dataKey="dia" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: 12, border: "1px solid var(--app-border)", fontSize: 12 }}
                                labelStyle={{ color: "#000" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="progreso"
                                stroke="var(--app-secondary)"
                                strokeWidth={2.5}
                                dot={{ fill: "var(--app-secondary)", stroke: "white", strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </>
        ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">

                <TrendingUp
                    className="h-12 w-12 text-[color:var(--app-primary)] opacity-40"
                />

                <div>
                    <p className="font-medium text-slate-700">
                        Aún no tienes calificaciones
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Completa flashcards y exámenes para ver tu progreso aquí.
                    </p>
                </div>

            </div>
        )}

    </div>
  );
}