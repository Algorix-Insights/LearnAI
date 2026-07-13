'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { NotebookStudyTime } from '@/services/contracts';

const colors = ['var(--app-primary)', '#a78bfa', 'var(--app-secondary)', '#312e81'];

export default function DonutChartTime({ data = [] }: { data?: NotebookStudyTime[] }) {
  const totalSeconds = data.reduce((sum, item) => sum + item.study_seconds, 0);
  const hours = Math.floor(totalSeconds / 3600);

  return (
    <div className="flex h-full flex-col items-center gap-6 justify-around">
      <div className="relative h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="study_seconds"
              nameKey="name"
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((slice, index) => (
                <Cell key={slice.notebook_id} fill={colors[index % colors.length]} />
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
        {data.length === 0 ? (
          <p className="text-center text-sm text-slate-400">Aún no hay tiempo registrado.</p>
        ) : data.map((slice, index) => (
          <div key={slice.notebook_id} className="flex items-center gap-4 text-sm">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <p className="min-w-0 flex-1 truncate text-slate-600">{slice.name}</p>
            <p className="shrink-0 font-medium text-slate-800">
              {Math.floor(slice.study_seconds / 3600)}h {Math.floor((slice.study_seconds % 3600) / 60)}m
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
