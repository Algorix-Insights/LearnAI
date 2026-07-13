import { FileCheck2, Sparkles, Upload, Share2, type LucideIcon } from 'lucide-react';
import type { RecentActivity } from '@/services/contracts';

type ActivityIconKind = 'exam' | 'flashcards' | 'upload' | 'share';

const iconMap: Record<ActivityIconKind, LucideIcon> = {
  exam: FileCheck2,
  flashcards: Sparkles,
  upload: Upload,
  share: Share2,
};

function getIconKind(activityType: string): ActivityIconKind {
  if (activityType.includes('exam')) return 'exam';
  if (activityType.includes('flashcard')) return 'flashcards';
  if (activityType.includes('upload') || activityType.includes('source')) return 'upload';
  return 'share';
}

export default function RecentActivityCard({ data = [] }: { data?: RecentActivity[] }) {
  return (
    <div
      style={{ gridArea: 'activity'}}
      className="flex flex-col gap-4 rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900">Actividad Reciente</p>
        <span className="text-xs font-semibold text-[color:var(--app-primary)]">Últimos eventos</span>
      </div>

      <div className="flex flex-col gap-3">
        {data.length === 0 ? (
          <p className="text-sm text-slate-400">Aún no hay actividad reciente.</p>
        ) : data.map((item) => {
          const Icon = iconMap[getIconKind(item.activity_type)];
          return (
            <div key={`${item.activity_type}-${item.occurred_at}-${item.notebook_id ?? ''}`} className="flex items-center gap-3 text-sm">
              <Icon className="h-4 w-4 shrink-0 text-[color:var(--app-primary)]" strokeWidth={1.8} />
              <span className="min-w-0 flex-1 truncate text-slate-700">{item.description}</span>
              <span className="shrink-0 text-xs text-slate-400">
                {new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(item.occurred_at))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
