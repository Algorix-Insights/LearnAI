import Link from 'next/link';
import { FileCheck2, Sparkles, Upload, Share2, type LucideIcon } from 'lucide-react';

type ActivityIconKind = 'exam' | 'flashcards' | 'upload' | 'share';

type ActivityItem = {
  id: string;
  description: string;
  timeAgo: string;
  icon: ActivityIconKind;
};

type TimeSlice = { cuaderno: string; minutes: number; color: string };

 const activity: ActivityItem[] = [
    { id: '1', description: 'Realizaste el examen del cuaderno uno', timeAgo: 'Hace 10 min', icon: 'exam' },
    { id: '2', description: 'Generaste 24 flashcards para cuaderno dos', timeAgo: 'Hace 3 horas', icon: 'flashcards' },
    { id: '3', description: 'Subiste archivo Apuntes_12.pdf', timeAgo: 'Ayer', icon: 'upload' },
    { id: '4', description: 'Compartiste cuaderno tres', timeAgo: 'Hace 3 días', icon: 'share' },
  ]

   const timeSpent: TimeSlice[] = [
    { cuaderno: 'Cuaderno Uno', minutes: 272, color: 'var(--app-primary)' },
    { cuaderno: 'Cuaderno Dos', minutes: 272, color: '#a78bfa' },
    { cuaderno: 'Cuaderno Tres', minutes: 272, color: 'var(--app-secondary)' },
    { cuaderno: 'Cuaderno Cuatro', minutes: 272, color: '#312e81' },
  ]


const iconMap: Record<ActivityIconKind, LucideIcon> = {
  exam: FileCheck2,
  flashcards: Sparkles,
  upload: Upload,
  share: Share2,
};

export default function RecentActivityCard() {
  return (
    <div
      style={{ gridArea: 'activity'}}
      className="flex flex-col gap-4 rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">Actividad Reciente</p>
        <Link href="#" className="text-xs font-semibold text-[color:var(--app-primary)] hover:underline">
          Ver todo
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {activity.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={item.id} className="flex items-center gap-3 text-sm">
              <Icon className="h-4 w-4 shrink-0 text-[color:var(--app-primary)]" strokeWidth={1.8} />
              <span className="min-w-0 flex-1 truncate text-slate-700">{item.description}</span>
              <span className="shrink-0 text-xs text-slate-400">{item.timeAgo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}