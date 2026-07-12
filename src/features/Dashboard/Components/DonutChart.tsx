'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type TimeSlice = {
  cuaderno: string;
  minutes: number;
  color: string;
};

const data: TimeSlice[] = [
  { cuaderno: 'Cuaderno Uno', minutes: 272, color: 'var(--app-primary)' },
  { cuaderno: 'Cuaderno Dos', minutes: 272, color: '#a78bfa' },
  { cuaderno: 'Cuaderno Tres', minutes: 272, color: 'var(--app-secondary)' },
  { cuaderno: 'Cuaderno Cuatro', minutes: 272, color: '#312e81' },
];

const totalMinutes = data.reduce((sum, item) => sum + item.minutes, 0);

export default function DonutChartTime() {
  const hours = Math.floor(totalMinutes / 60);

  return (
    <div className="flex h-full flex-col items-center gap-6 justify-around">
      <div className="relative h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="minutes"
              nameKey="cuaderno"
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((slice, index) => (
                <Cell key={index} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xl font-bold text-slate-800">{hours}h</p>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex w-full flex-col gap-4">
        {data.map((slice, index) => (
          <div key={index} className="flex items-center gap-4 text-sm">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <p className="min-w-0 flex-1 truncate text-slate-600">{slice.cuaderno}</p>
            <p className="shrink-0 font-medium text-slate-800">
              {Math.floor(slice.minutes / 60)}h {slice.minutes % 60}m
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}