'use client';

import { FileCheck, GraduationCap } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/Button';
import { CollapsibleCard } from '@/components/CollapsibleCard';
import FileCard from './FileCard';

type ExamSummary = {
  exam_id: string | null;
  name: string | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
};

type ExamsSectionProps = {
  notebookId: string;
  exams: ExamSummary[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
};

export default function ExamsSection({
  notebookId,
  exams,
  isLoading,
  isError,
  onRetry,
}: ExamsSectionProps) {
  return (
    <CollapsibleCard
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <GraduationCap className="size-5 text-[#7452F5]" />
            <span>Exámenes ({exams.length})</span>
          </div>
        </div>
      }
      content={
        <div className="mt-3 space-y-2.5">
          <Link href={`/biblioteca/notebook/${notebookId}/exams`}>
            <Button
              type="button"
              variant="secondary"
              className="w-full gap-2"
            >
              <FileCheck className="size-4" />
              <span>Ver exámenes</span>
            </Button>
          </Link>
          {isError ? (
            <div className="space-y-2">
              <p className="text-xs text-rose-600" role="alert">
                No pudimos cargar los exámenes.
              </p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="text-xs font-semibold text-indigo-500 transition hover:text-indigo-600"
                >
                  Reintentar
                </button>
              )}
            </div>
          ) : null}
          {isLoading ? (
            <div className="space-y-2" role="status" aria-label="Cargando exámenes">
              <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
            </div>
          ) : null}
          {!isLoading && exams.length === 0 ? (
            <p className="text-xs leading-5 text-slate-400">
              Genera exámenes desde los botones rápidos del cuaderno.
            </p>
          ) : null}
          {exams.slice(0, 4).map((exam) => (
            <FileCard
              key={exam.exam_id}
              title={exam.name ?? 'Examen sin nombre'}
              description={
                exam.status === 'active'
                  ? 'Activo'
                  : exam.status === 'archived'
                    ? 'Archivado'
                    : '—'
              }
              icon={<GraduationCap className="size-3.5" />}
            />
          ))}
          {exams.length > 4 ? (
            <p className="px-1 text-[11px] text-slate-400">
              Y {exams.length - 4} exámenes más.
            </p>
          ) : null}
        </div>
      }
    />
  );
}
