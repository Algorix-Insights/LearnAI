'use client'
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp } from "lucide-react"
import type { LearningPoint } from '@/services/contracts';

export default function LineCharRating({ data = [] }: { data?: LearningPoint[] }) {
    const hasActivity = data.some((point) => (point.study_minutes ?? 0) > 0);

    if (!hasActivity) {
        return (
            <div className="flex h-32 w-full flex-col items-center justify-center gap-1 text-center">
                <TrendingUp className="h-6 w-6 text-slate-300" strokeWidth={1.5} />
                <p className="text-xs font-medium text-slate-400">Aún no hay actividad</p>
            </div>
        );
    }

    return(
        <div className="h-32 w-full">
            <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={data} margin={{top:5, right:5, bottom:5, left:5}}>
                    <XAxis dataKey="date" hide />
                    <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid var(--app-border)', fontSize: 12 }}
                    labelStyle={{ color: '#000000' }} />
                    <Line
                    type="monotone"
                    dataKey="study_minutes"
                    stroke="var(--app-secondary)"
                    strokeWidth={2.5}
                    dot={{ fill: 'var(--app-primary)', stroke: 'white', strokeWidth: 2, r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}