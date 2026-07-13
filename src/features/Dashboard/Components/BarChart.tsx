'use client';
import { BarChart3 } from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';

type LearningPoint = {
    date: string;
    exams_completed: number;
    flashcards_reviewed: number;
    study_minutes: number;
};

type Props = {
    data: LearningPoint[];
};

export default function BarChartLearning({ data }: Props) {

    const chartData = data.map(item => ({
    dia: new Date(item.date).toLocaleDateString("es-MX", {
        weekday: "short",
    }),
    examenes: item.exams_completed,
    flashcards: item.flashcards_reviewed,
}));

const hasData =
    chartData.length > 0 &&
    chartData.some(item =>
        item.examenes > 0 ||
        item.flashcards > 0
    );

    return (
    <div className="h-56 w-full">
        {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
                >
                    <XAxis
                        dataKey="dia"
                        tick={{ fontSize: 11, fill: "#000000" }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        contentStyle={{
                            borderRadius: 12,
                            border: "1px solid var(--app-border)",
                            fontSize: 12,
                        }}
                        cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                    />

                    <Legend
                        iconType="circle"
                        wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
                    />

                    <Bar
                        dataKey="examenes"
                        name="Exámenes"
                        fill="#0CAEAE"
                        radius={[6, 6, 0, 0]}
                    />

                    <Bar
                        dataKey="flashcards"
                        name="Flashcards"
                        fill="#7452F5"
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <BarChart3
                    className="h-12 w-12 text-[color:var(--app-primary)] opacity-40"
                />

                <div>
                    <p className="font-medium text-slate-700">
                        Aún no hay actividad
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Completa exámenes o estudia con flashcards para visualizar tu progreso.
                    </p>
                </div>
            </div>
        )}
    </div>
);
}