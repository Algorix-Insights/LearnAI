'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, GraduationCap, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/Button';
import { ExamService } from '@/services/Exam';
import { NotebookService } from '@/services/Notebook';

export default function ExamsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const notebookId = params.id;

  const notebookQuery = useQuery({
    queryKey: ['notebooks', notebookId],
    queryFn: () => NotebookService.get(notebookId),
  });

  const examsQuery = useQuery({
    queryKey: ['notebooks', notebookId, 'exams'],
    queryFn: () => ExamService.listExams(notebookId, { limit: 100, offset: 0 }),
  });

  const exams = examsQuery.data?.data ?? [];

  const startAttempt = useMutation({
    mutationFn: (examId: string) => ExamService.startAttempt(examId),
    onSuccess: (session, examId) => {
      router.push(`/biblioteca/notebook/${notebookId}/exams/attempt/${session.attempt_id}`);
    },
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-4 sm:p-8">
      <div className="flex items-center gap-4">
        <Link href={`/biblioteca/notebook/${notebookId}`}>
          <Button variant="pageOutline" size="md" type="button">
            <ArrowLeft className="size-4" />
            <span>Volver</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Exámenes
          </h1>
          {notebookQuery.data && (
            <p className="text-sm text-slate-500">{notebookQuery.data.name}</p>
          )}
        </div>
      </div>

      {examsQuery.isPending ? (
        <div className="space-y-3" role="status" aria-label="Cargando exámenes">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : examsQuery.isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
          <p className="text-sm text-rose-700">
            No pudimos cargar los exámenes. Intenta de nuevo más tarde.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            type="button"
            onClick={() => examsQuery.refetch()}
          >
            Reintentar
          </Button>
        </div>
      ) : exams.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-12 text-center">
          <GraduationCap className="size-12 text-slate-300" />
          <div>
            <h2 className="text-lg font-semibold text-slate-700">
              No hay exámenes todavía
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Genera tu primer examen desde los botones rápidos en el cuaderno.
            </p>
          </div>
          <Link href={`/biblioteca/notebook/${notebookId}`}>
            <Button variant="primary" type="button">
              Ir al cuaderno
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div
              key={exam.exam_id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[rgba(116,82,245,0.3)] hover:shadow-sm sm:p-5"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-slate-800">
                  {exam.name ?? 'Examen sin nombre'}
                </h3>
                {exam.description && (
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {exam.description}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-slate-400">
                  {exam.status === 'active'
                    ? 'Activo'
                    : exam.status === 'archived'
                      ? 'Archivado'
                      : '—'}
                  {exam.created_at
                    ? ` · ${new Date(exam.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}`
                    : ''}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className="shrink-0"
                disabled={startAttempt.isPending && startAttempt.variables === exam.exam_id}
                onClick={() => {
                  if (exam.exam_id) startAttempt.mutate(exam.exam_id);
                }}
              >
                {startAttempt.isPending && startAttempt.variables === exam.exam_id ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : null}
                {startAttempt.isPending && startAttempt.variables === exam.exam_id ? 'Iniciando…' : 'Iniciar'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
