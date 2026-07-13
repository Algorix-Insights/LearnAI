import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type ContentLoadingSkeletonProps = {
  announce?: boolean;
  className?: string;
  count?: number;
  label?: string;
  variant?: 'compact' | 'notebook' | 'notebook-card' | 'room' | 'metric';
};

const skeletonIds = [
  'skeleton-a',
  'skeleton-b',
  'skeleton-c',
  'skeleton-d',
  'skeleton-e',
  'skeleton-f',
];

export function ContentLoadingSkeleton({
  announce = true,
  className,
  count = 3,
  label = 'Cargando contenido',
  variant = 'notebook',
}: ContentLoadingSkeletonProps) {
  const visibleIds = skeletonIds.slice(0, Math.min(count, skeletonIds.length));

  return (
    <div
      aria-busy={announce || undefined}
      aria-hidden={announce ? undefined : true}
      aria-live={announce ? 'polite' : undefined}
      className={cn(
        variant === 'room' && 'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
        variant === 'metric' && 'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
        variant === 'notebook-card' && 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3',
        (variant === 'compact' || variant === 'notebook') && 'space-y-3',
        className,
      )}
      role={announce ? 'status' : undefined}
    >
      {announce ? <span className="sr-only">{label}</span> : null}
      {visibleIds.map((id) => {
        if (variant === 'room') {
          return (
            <div
              key={id}
              aria-hidden="true"
              className="rounded-3xl border border-[color:var(--app-border)] bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-11 w-11 rounded-2xl" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="mt-5 h-5 w-2/3" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-4/5" />
            </div>
          );
        }

        if (variant === 'metric') {
          return (
            <div
              key={id}
              aria-hidden="true"
              className="min-h-56 rounded-2xl border border-[color:var(--app-border)] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="mt-6 h-9 w-24" />
              <Skeleton className="mt-5 h-24 w-full" />
            </div>
          );
        }

        if (variant === 'compact') {
          return (
            <div key={id} aria-hidden="true" className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="h-4 w-4 shrink-0 rounded" />
              <Skeleton className="h-3 flex-1" />
            </div>
          );
        }

        if (variant === 'notebook-card') {
          return (
            <div
              key={id}
              aria-hidden="true"
              className="flex items-center gap-3 rounded-xl border border-[color:var(--app-border)] bg-white p-4"
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          );
        }

        return (
          <div
            key={id}
            aria-hidden="true"
            className="flex items-center gap-4 rounded-[1.5rem] border border-[color:var(--app-border)] bg-white p-5"
          >
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-4/5" />
            </div>
            <Skeleton className="hidden h-9 w-20 rounded-full sm:block" />
          </div>
        );
      })}
    </div>
  );
}
