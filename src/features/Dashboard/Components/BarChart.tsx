'use client';

import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { LearningPoint } from '@/services/contracts';

export default function BarChartLearning({ data = [] }: { data?: LearningPoint[] }) {
  const hasActivity = data.some((point) =>
    Object.entries(point).some(
      ([key, value]) => key !== 'date' && typeof value === 'number' && value > 0
    )
  );

  if (!hasActivity) {
    return (
      <div className="flex h-56 w-full flex-col items-center justify-center gap-2 text-center">
        <BarChart3 className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
        <p className="text-sm font-medium text-slate-400">Aún no hay actividad</p>
        <p className="text-xs text-slate-400">
          Completa exámenes o repasa flashcards para ver tu progreso aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#000000' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid var(--app-border)', fontSize: 12 }}
            cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
          />
          <Bar dataKey="exams_completed" name="Exámenes" fill="#0CAEAE" radius={[6, 6, 0, 0]} />
          <Bar dataKey="flashcards_reviewed" name="Flashcards" fill="#7452F5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}