'use client';

import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Layers3, RefreshCw, RotateCcw, Sparkles } from 'lucide-react';

import { Button } from '@/components/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Flashcard } from '@/services/contracts';
import {
  createLearningEventIdempotencyKey,
  StatisticsService,
} from '@/services/Statistics';

type FlashcardsStudyDialogProps = {
  notebookId: string;
  flashcards: Flashcard[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export default function FlashcardsStudyDialog({
  notebookId,
  flashcards,
  isLoading = false,
  isError = false,
  onRetry,
}: FlashcardsStudyDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const sessionStartedAtRef = useRef<number | null>(null);
  const reviewedCardIdsRef = useRef<Set<string>>(new Set());

  const safeIndex = Math.min(currentIndex, Math.max(flashcards.length - 1, 0));
  const currentCard = flashcards[safeIndex];

  const moveTo = (index: number) => {
    setIsFlipped(false);
    setCurrentIndex(index);
  };

  const finishStudySession = () => {
    const startedAt = sessionStartedAtRef.current;
    const reviewedCount = Math.min(reviewedCardIdsRef.current.size, 50);
    sessionStartedAtRef.current = null;
    reviewedCardIdsRef.current = new Set();
    if (startedAt === null || reviewedCount === 0) return;

    const durationSeconds = Math.min(3600, Math.max(0, Math.round((Date.now() - startedAt) / 1000)));
    void StatisticsService.recordLearningEvent(
      {
        notebook_id: notebookId,
        activity_type: 'flashcard_reviewed',
        quantity: reviewedCount,
        duration_seconds: durationSeconds,
      },
      createLearningEventIdempotencyKey(),
    ).then(() => queryClient.invalidateQueries({ queryKey: ['statistics'] })).catch(() => undefined);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      sessionStartedAtRef.current = Date.now();
      reviewedCardIdsRef.current = new Set();
      setCurrentIndex(0);
      setIsFlipped(false);
      return;
    }
    setIsFlipped(false);
    finishStudySession();
  };

  const flipCard = () => {
    if (!isFlipped && currentCard) reviewedCardIdsRef.current.add(currentCard.flashcard_id);
    setIsFlipped((current) => !current);
  };

  return (
    <>
      <Button
        type="button"
        variant="pageOutline"
        className="w-full gap-2"
        onClick={() => handleOpenChange(true)}
      >
        <Layers3 className="size-4" />
        Ver y estudiar flashcards
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          style={{ maxWidth: '46rem', width: 'calc(100vw - 2rem)' }}
          className="rounded-[1.75rem] border border-[color:var(--app-border)] bg-white p-0 shadow-[0_32px_100px_rgba(15,23,42,0.2)]"
        >
          <DialogHeader className="border-b border-slate-100 px-5 py-5 pr-14 sm:px-7">
            <div className="flex items-center gap-2 text-[#6545da]">
              <span className="grid size-8 place-items-center rounded-xl bg-[#7452F5]/10">
                <Sparkles className="size-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">Modo estudio</span>
            </div>
            <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Flashcards del cuaderno
            </DialogTitle>
            <DialogDescription>
              Intenta responder, luego voltea la tarjeta para comprobar tu respuesta.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-[400px] px-5 py-6 sm:px-7">
            {isLoading ? (
              <div className="space-y-4" role="status" aria-label="Cargando flashcards">
                <div className="h-2 w-28 animate-pulse rounded-full bg-slate-100" />
                <div className="h-[280px] animate-pulse rounded-[1.5rem] bg-slate-100" />
              </div>
            ) : null}

            {!isLoading && isError ? (
              <div className="grid min-h-[320px] place-items-center text-center" role="alert">
                <div className="max-w-sm">
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
                    <RefreshCw className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">No pudimos cargar las flashcards</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Revisa tu conexión e inténtalo nuevamente.</p>
                  {onRetry ? <Button type="button" variant="secondary" className="mt-5" onClick={onRetry}>Reintentar</Button> : null}
                </div>
              </div>
            ) : null}

            {!isLoading && !isError && !currentCard ? (
              <div className="grid min-h-[320px] place-items-center text-center">
                <div className="max-w-sm">
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#7452F5]/10 text-[#6545da]">
                    <Layers3 className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">Aún no hay flashcards</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Sube una fuente y genera tus primeras tarjetas desde el panel del cuaderno.</p>
                </div>
              </div>
            ) : null}

            {!isLoading && !isError && currentCard ? (
              <div>
                <div className="mb-4 flex items-center justify-between gap-4 text-xs text-slate-500">
                  <span aria-live="polite">Tarjeta {safeIndex + 1} de {flashcards.length}</span>
                  <span>{isFlipped ? 'Respuesta' : 'Pregunta'}</span>
                </div>
                <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#23D7C2,#7452F5)] transition-[width] duration-300"
                    style={{ width: `${((safeIndex + 1) / flashcards.length) * 100}%` }}
                  />
                </div>

                <div className="[perspective:1200px]">
                  <button
                    type="button"
                    onClick={flipCard}
                    className="relative min-h-[280px] w-full rounded-[1.5rem] text-left outline-none transition-transform duration-500 [transform-style:preserve-3d] focus-visible:ring-4 focus-visible:ring-[#7452F5]/20"
                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    aria-pressed={isFlipped}
                    aria-label={isFlipped
                      ? `Respuesta: ${currentCard.answer}. Voltear para mostrar la pregunta: ${currentCard.question}`
                      : `Pregunta: ${currentCard.question}. Voltear para mostrar la respuesta`}
                  >
                    <span
                      aria-hidden={isFlipped}
                      className="absolute inset-0 flex flex-col justify-between overflow-y-auto rounded-[1.5rem] border border-[#7452F5]/20 bg-[radial-gradient(circle_at_top_right,rgba(116,82,245,0.13),transparent_38%),white] p-6 shadow-[0_24px_60px_rgba(116,82,245,0.1)] [backface-visibility:hidden] sm:p-8"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6545da]">Pregunta</span>
                      <span className="my-8 text-center text-xl font-medium leading-8 text-slate-900 sm:text-2xl">{currentCard.question}</span>
                      <span className="inline-flex items-center justify-center gap-2 text-xs text-slate-400"><RotateCcw className="size-3.5" /> Toca para ver la respuesta</span>
                    </span>
                    <span
                      aria-hidden={!isFlipped}
                      className="absolute inset-0 flex flex-col justify-between overflow-y-auto rounded-[1.5rem] border border-emerald-200 bg-[radial-gradient(circle_at_top_right,rgba(35,215,194,0.16),transparent_40%),white] p-6 shadow-[0_24px_60px_rgba(35,215,194,0.1)] [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Respuesta</span>
                      <span className="my-8 text-center text-lg font-medium leading-8 text-slate-800 sm:text-xl">{currentCard.answer}</span>
                      <span className="inline-flex items-center justify-center gap-2 text-xs text-slate-400"><RotateCcw className="size-3.5" /> Toca para volver a la pregunta</span>
                    </span>
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={safeIndex === 0}
                    onClick={() => moveTo(safeIndex - 1)}
                  >
                    <ArrowLeft className="size-4" /> Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="pageAccent"
                    disabled={safeIndex === flashcards.length - 1}
                    onClick={() => moveTo(safeIndex + 1)}
                  >
                    Siguiente <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
