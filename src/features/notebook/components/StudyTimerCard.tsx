'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Pause, Play, RotateCcw } from 'lucide-react';

import { Button } from '@/components/Button';
import {
  createLearningEventIdempotencyKey,
  StatisticsService,
} from '@/services/Statistics';

type PendingEvent = {
  duration: number;
  idempotencyKey: string;
};

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function StudyTimerCard({ notebookId }: { notebookId: string }) {
  const queryClient = useQueryClient();
  const startedAtRef = useRef<number | null>(null);
  const eventKeyRef = useRef<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingEvent, setPendingEvent] = useState<PendingEvent | null>(null);
  const recordEvent = useMutation({
    mutationFn: (event: PendingEvent) => StatisticsService.recordLearningEvent(
      {
        notebook_id: notebookId,
        activity_type: 'study_session',
        quantity: 1,
        duration_seconds: event.duration,
      },
      event.idempotencyKey,
    ),
    onSuccess: async () => {
      setPendingEvent(null);
      setMessage('Sesión registrada.');
      await queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });

  useEffect(() => {
    if (!isRunning || startedAtRef.current === null) return;
    const update = () => {
      const seconds = Math.min(14_400, Math.floor((Date.now() - (startedAtRef.current as number)) / 1000));
      setElapsed(seconds);
    };
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  const start = () => {
    startedAtRef.current = Date.now() - elapsed * 1_000;
    eventKeyRef.current ??= createLearningEventIdempotencyKey();
    setMessage(null);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    if (elapsed < 30) {
      setMessage('Estudia al menos 30 segundos para registrar la sesión.');
      return;
    }
    const event = {
      duration: Math.min(elapsed, 14_400),
      idempotencyKey: eventKeyRef.current ?? createLearningEventIdempotencyKey(),
    };
    setPendingEvent(event);
    recordEvent.mutate(event);
    startedAtRef.current = null;
    eventKeyRef.current = null;
    setElapsed(0);
  };

  return (
    <div className="rounded-md border border-[rgba(116,82,245,0.12)] bg-white/90 p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Clock className="size-6 text-[#7452F5]" />
        <span className="flex-1 rounded-lg bg-[#F5F3FF] p-3 text-center text-lg font-medium tracking-tight text-slate-800">
          {formatDuration(elapsed)}
        </span>
        <Button
          variant="sidebarIcon"
          size="icon"
          type="button"
          onClick={isRunning ? stop : start}
          className="flex items-center justify-center border-2 border-[var(--primary)]"
          aria-label={isRunning ? 'Finalizar sesión' : 'Iniciar sesión'}
        >
          {isRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
      </div>
      {recordEvent.isError && pendingEvent ? (
        <button
          type="button"
          onClick={() => recordEvent.mutate(pendingEvent)}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-600"
        >
          <RotateCcw className="size-3" /> Reintentar registro
        </button>
      ) : message ? (
        <p className="mt-2 text-xs text-slate-500" role="status">{message}</p>
      ) : null}
    </div>
  );
}
