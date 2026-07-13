'use client'
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import type { LearningPoint } from '@/services/contracts';

export default function LineCharRating({ data = [] }: { data?: LearningPoint[] }) {
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
