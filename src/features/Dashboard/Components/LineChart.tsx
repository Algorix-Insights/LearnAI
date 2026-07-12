'use client'
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip, CartesianGrid} from "recharts"
type Rating = {
    week: string;
    promedio: number;
}

const dataRating: Rating[] = [
    {week: "semana 1", promedio: 20},
    {week: "semana 2", promedio: 30},
    {week: "semana 3", promedio: 90},
    {week: "semana 4", promedio: 100},
    {week: "semana 5", promedio: 100},
]

export default function LineCharRating() {
    return(
        <div className="h-32 w-full">
            <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={dataRating} margin={{top:5, right:5, bottom:5, left:5}}>
                    <XAxis dataKey={"week"} hide />
                    <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid var(--app-border)', fontSize: 12 }}
                    labelStyle={{ color: '#000000' }} />
                    <Line
                    type="monotone"
                    dataKey="promedio" 
                    stroke="var(--app-secondary)"
                    strokeWidth={2.5}
                    dot={{ fill: 'var(--app-primary)', stroke: 'white', strokeWidth: 2, r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}