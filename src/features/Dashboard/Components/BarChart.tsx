'use client';

import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

type LearningPoint = {
  cuaderno: string;
  examenes: number;
  flashcards: number;
};

const data: LearningPoint[] = [
  { cuaderno: 'Cuaderno Uno', examenes: 5, flashcards: 8 },
  { cuaderno: 'Cuaderno Dos', examenes: 40, flashcards: 38 },
  { cuaderno: 'Cuaderno Tres', examenes: 15, flashcards: 20 },
  { cuaderno: 'Cuaderno Cuatro', examenes: 30, flashcards: 32 },
];

export default function BarChartLearning() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <XAxis dataKey="cuaderno" tick={{ fontSize: 11, fill: '#000000' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid var(--app-border)', fontSize: 12 }}
            cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
          />
          <Bar dataKey="examenes" name="Exámenes" fill="#0CAEAE" radius={[6, 6, 0, 0]} />
          <Bar dataKey="flashcards" name="Flashcards" fill="#7452F5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}