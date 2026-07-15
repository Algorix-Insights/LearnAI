'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Clock, LoaderCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { ExamService } from '@/services/Exam';
import type { AttemptResult } from '@/services/contracts';

function buildPayload(value: string, optionIds: Set<string>) {
  return optionIds.has(value)
    ? { selected_option_id: value }
    : { answer_text: value };
}

export default function AttemptPage() {
  const queryClient = useQueryClient();
  const params = useParams<{ id: string; attemptId: string }>();
  const notebookId = params.id;
  const attemptId = params.attemptId;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AttemptResult | null>(null);

  const attemptQuery = useQuery({
    queryKey: ['attempts', attemptId],
    queryFn: () => ExamService.getAttempt(attemptId),
    enabled: !result,
  });

  const attempt = attemptQuery.data;
  const questions = attempt?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const optionIds = new Set(questions.flatMap((q) => q.options.map((o) => o.option_id)));

  const allAnswered = questions.every((q) => {
    const val = localAnswers[q.question_id];
    return val !== undefined && val !== '';
  });

  useEffect(() => {
    if (attempt?.answers && questions.length > 0) {
      setLocalAnswers((prev) => {
        const initial = { ...prev };
        let changed = false;
        for (const answer of attempt.answers) {
          const key = answer.question_id;
          const val = answer.selected_option_id ?? answer.answer_text ?? '';
          if (initial[key] !== val) {
            initial[key] = val;
            changed = true;
          }
        }
        return changed ? initial : prev;
      });
    }
  }, [attempt?.answers, questions.length]);

  const finishWithAnswers = useMutation({
    mutationFn: async () => {
      await Promise.all(
        questions.map((q) => {
          const value = localAnswers[q.question_id];
          if (!value) return Promise.resolve();
          return ExamService.submitAnswer(attemptId, q.question_id, buildPayload(value, optionIds));
        }),
      );
      return ExamService.finishAttempt(attemptId);
    },
    onSuccess: (data) => {
      setResult(data);
      void queryClient.invalidateQueries({ queryKey: ['attempts', attemptId] });
      void queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });

  const progressPercent = questions.length > 0
    ? Math.round(((Object.keys(localAnswers).length) / questions.length) * 100)
    : 0;

  if (result) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-4 sm:p-8">
        <div className="flex items-center gap-4">
          <Link href={`/biblioteca/notebook/${notebookId}/exams`}>
            <Button variant="pageOutline" size="md" type="button">
              <ArrowLeft className="size-4" />
              <span>Volver a exámenes</span>
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(116,82,245,0.15),rgba(119,234,222,0.2))]">
            <CheckCircle className="size-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800 sm:text-2xl">
            Examen completado
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {result.answered_questions} de {result.total_questions} preguntas respondidas
          </p>
          <div className="mt-6 inline-flex items-baseline gap-1.5 rounded-2xl bg-[linear-gradient(135deg,rgba(116,82,245,0.1),rgba(119,234,222,0.12))] px-6 py-3">
            <span className="text-3xl font-bold text-slate-800">
              {Math.round(result.score)}%
            </span>
            <span className="text-sm text-slate-500">
              ({result.earned_points}/{result.total_points} pts)
            </span>
          </div>
          {result.attempts_remaining > 0 ? (
            <p className="mt-4 text-xs text-slate-400">
              Te quedan {result.attempts_remaining} intento{result.attempts_remaining !== 1 ? 's' : ''}.
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          {result.answers.map((graded) => {
            const question = questions.find((q) => q.question_id === graded.question_id);
            return (
              <div
                key={graded.answer_id}
                className={`rounded-xl border p-4 sm:p-5 ${
                  graded.is_correct
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-rose-200 bg-rose-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {graded.is_correct ? (
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="mt-0.5 size-5 shrink-0 text-rose-600" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {graded.is_correct ? 'Correcto' : 'Incorrecto'}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {question?.statement}
                    </p>
                    {graded.feedback && (
                      <p className="mt-2 rounded-lg bg-white/60 p-2 text-xs leading-5 text-slate-600">
                        {graded.feedback}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-400">
                      {graded.points_awarded}/{question?.points ?? 0} pts
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Link href={`/biblioteca/notebook/${notebookId}/exams`}>
            <Button variant="primary" type="button">
              Volver a exámenes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (attemptQuery.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500" role="status" aria-label="Cargando examen">
          <LoaderCircle className="size-5 animate-spin" />
          <span className="text-sm">Cargando examen…</span>
        </div>
      </div>
    );
  }

  if (attemptQuery.isError || !attempt) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-sm text-rose-600">
          No pudimos cargar el examen.
        </p>
        <Button variant="secondary" type="button" onClick={() => attemptQuery.refetch()}>
          Reintentar
        </Button>
        <Link href={`/biblioteca/notebook/${notebookId}/exams`}>
          <Button variant="pageOutline" type="button">
            Volver a exámenes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-4 sm:gap-6 sm:p-8">
      <div className="flex items-center gap-4">
        <Link href={`/biblioteca/notebook/${notebookId}/exams`}>
          <Button variant="pageOutline" size="md" type="button">
            <ArrowLeft className="size-4" />
            <span>Salir</span>
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {Object.keys(localAnswers).length}/{questions.length} respondidas
            </span>
            <span className="text-xs text-slate-400">
              Intento {attempt.attempt_number}/{attempt.max_attempts}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[linear-gradient(135deg,rgba(116,82,245,1),rgba(119,234,222,1))] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {currentQuestion ? (
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="size-3.5" />
            <span>Pregunta {currentIndex + 1} de {questions.length}</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <p className="text-base font-medium text-slate-800 sm:text-lg">
              {currentQuestion.statement}
            </p>
            <p className="mt-1 text-xs text-slate-400">{currentQuestion.points} pts</p>

            <div className="mt-6 space-y-2.5">
              {currentQuestion.type === 'open' ? (
                <textarea
                  value={localAnswers[currentQuestion.question_id] ?? ''}
                  onChange={(e) =>
                    setLocalAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.question_id]: e.target.value,
                    }))
                  }
                  placeholder="Escribe tu respuesta aquí…"
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none transition focus:border-[rgba(116,82,245,0.4)] focus:ring-2 focus:ring-[rgba(116,82,245,0.1)]"
                />
              ) : (
                currentQuestion.options.map((option) => {
                  const isSelected = localAnswers[currentQuestion.question_id] === option.option_id;
                  return (
                    <button
                      key={option.option_id}
                      type="button"
                      onClick={() =>
                        setLocalAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.question_id]: option.option_id,
                        }))
                      }
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                        isSelected
                          ? 'border-[rgba(116,82,245,0.5)] bg-[rgba(116,82,245,0.06)] text-slate-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium ${
                          isSelected
                            ? 'border-[rgba(116,82,245,0.5)] bg-[rgba(116,82,245,0.15)] text-[rgba(116,82,245,1)]'
                            : 'border-slate-300 text-slate-400'
                        }`}
                      >
                        {option.option_order}
                      </span>
                      <span className="min-w-0 flex-1">{option.option_text}</span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="pageOutline"
                size="sm"
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              >
                <ChevronLeft className="size-4" />
                <span>Anterior</span>
              </Button>

              <Button
                variant="pageOutline"
                size="sm"
                type="button"
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              >
                <span>Siguiente</span>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="primary"
              type="button"
              disabled={!allAnswered || finishWithAnswers.isPending}
              onClick={() => finishWithAnswers.mutate()}
              className="w-full sm:w-auto"
            >
              {finishWithAnswers.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : null}
              {finishWithAnswers.isPending
                ? 'Enviando respuestas…'
                : 'Finalizar examen'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-slate-500">Este examen no tiene preguntas.</p>
        </div>
      )}
    </div>
  );
}
