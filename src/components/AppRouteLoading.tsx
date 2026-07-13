import { ContentLoadingSkeleton } from '@/components/ContentLoadingSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

type AppRouteLoadingProps = {
  label?: string;
  variant?: 'dashboard' | 'default' | 'home' | 'library' | 'notebook' | 'rooms';
};

function NotebookRouteLoading({ label }: { label: string }) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="h-screen overflow-hidden bg-white text-slate-800"
      role="status"
    >
      <span className="sr-only">{label}</span>
      <div className="grid h-full min-h-0 lg:grid-cols-[254px_minmax(0,1fr)]">
        <aside
          aria-hidden="true"
          className="hidden h-full min-h-0 flex-col border-r border-[color:var(--app-border)] bg-white/70 lg:flex"
        >
          <div className="flex h-16 shrink-0 items-center border-b border-[color:var(--app-border)] px-4">
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="space-y-4 overflow-hidden px-3 py-4">
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </aside>

        <main aria-hidden="true" className="flex h-full min-w-0 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[color:var(--app-border)] px-4 sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <Skeleton className="h-8 w-64 max-w-[60%]" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="hidden h-10 w-28 rounded-full sm:block" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </header>
          <div className="flex h-16 shrink-0 items-end gap-2 border-b border-[color:var(--app-border)] px-4 pb-2 sm:px-6">
            <Skeleton className="h-10 w-44 rounded-t-xl" />
            <Skeleton className="h-10 w-32 rounded-t-xl" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <section className="flex min-h-0 flex-1 justify-center overflow-hidden px-4 py-8 sm:px-6">
            <div className="flex w-full max-w-[980px] flex-col items-center">
              <Skeleton className="mt-8 h-7 w-7 rounded-full" />
              <Skeleton className="mt-5 h-11 w-[34rem] max-w-[85%]" />
              <Skeleton className="mt-5 h-4 w-96 max-w-[70%]" />
              <div className="mt-auto w-full space-y-4">
                <Skeleton className="h-28 w-full rounded-3xl" />
                <div className="flex justify-center gap-3">
                  <Skeleton className="h-9 w-28 rounded-full" />
                  <Skeleton className="h-9 w-28 rounded-full" />
                  <Skeleton className="h-9 w-28 rounded-full" />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function ShellContentLoading({
  variant,
}: {
  variant: Exclude<NonNullable<AppRouteLoadingProps['variant']>, 'notebook'>;
}) {
  if (variant === 'home') {
    return (
      <div aria-hidden="true" className="space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-80 max-w-full" />
          <Skeleton className="h-10 w-[30rem] max-w-full" />
        </div>
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="min-h-80 rounded-2xl border border-[color:var(--app-border)] bg-white p-5">
            <Skeleton className="mb-5 h-4 w-44" />
            <ContentLoadingSkeleton announce={false} count={3} variant="notebook" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-52 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'library') {
    return (
      <div aria-hidden="true" className="space-y-8">
        <div className="space-y-5 py-8">
          <Skeleton className="h-10 w-96 max-w-full" />
          <Skeleton className="h-4 w-52" />
          <div className="flex max-w-[700px] gap-3">
            <Skeleton className="h-12 min-w-0 flex-1 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-6 w-56" />
        <ContentLoadingSkeleton announce={false} count={4} variant="notebook" />
      </div>
    );
  }

  if (variant === 'rooms') {
    return (
      <div aria-hidden="true" className="space-y-6">
        <div className="grid min-h-80 gap-8 rounded-[2rem] border border-[color:var(--app-border)] bg-white p-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-5 self-center">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <Skeleton className="h-10 w-72 max-w-full" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-full min-h-64 w-full rounded-3xl" />
        </div>
        <Skeleton className="h-7 w-56" />
        <ContentLoadingSkeleton announce={false} count={3} variant="room" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-[28rem] max-w-full" />
      </div>
      <ContentLoadingSkeleton
        announce={false}
        count={variant === 'dashboard' ? 6 : 4}
        variant="metric"
      />
    </div>
  );
}

export function AppRouteLoading({
  label = 'Cargando página',
  variant = 'default',
}: AppRouteLoadingProps) {
  if (variant === 'notebook') {
    return <NotebookRouteLoading label={label} />;
  }

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen overflow-hidden"
      role="status"
    >
      <span className="sr-only">{label}</span>
      <div className="mx-auto grid h-screen max-w-[1600px] overflow-hidden border border-[color:var(--app-border)] bg-[color:var(--app-surface)] lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside
          aria-hidden="true"
          className="hidden h-full flex-col border-r border-[color:var(--app-border)] bg-white/60 px-5 py-5 lg:flex"
        >
          <Skeleton className="h-12 w-28" />
          <div className="mt-10 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-11 w-full rounded-2xl" />
            <Skeleton className="h-11 w-full rounded-2xl" />
            <Skeleton className="h-11 w-full rounded-2xl" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
          <div className="mt-10">
            <Skeleton className="h-3 w-32" />
            <ContentLoadingSkeleton announce={false} className="mt-3" count={3} variant="compact" />
          </div>
          <Skeleton className="mt-auto h-11 w-full rounded-full" />
        </aside>

        <section className="flex h-full min-w-0 flex-col overflow-hidden">
          <header
            aria-hidden="true"
            className="flex shrink-0 items-center gap-4 bg-white/40 px-5 py-4 sm:px-6 lg:px-8"
          >
            <Skeleton className="h-11 min-w-0 flex-1 rounded-full" />
            <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <Skeleton className="hidden h-11 w-36 rounded-full sm:block" />
          </header>

          <main className="flex-1 overflow-y-auto rounded-l-[2rem] border-l border-t border-[color:var(--app-border)] bg-[linear-gradient(to_right,#80808026_1px,transparent_1px),linear-gradient(to_bottom,#80808026_1px,transparent_1px)] bg-[size:62px_62px] px-5 py-5 sm:px-6 lg:px-8 lg:py-8">
            <ShellContentLoading variant={variant} />
          </main>
        </section>
      </div>
    </div>
  );
}
