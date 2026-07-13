import { Layers3, Plus, Star } from 'lucide-react';

import { Button } from '@/components/Button';
import { CollapsibleCard } from '@/components/CollapsibleCard';
import type { Flashcard } from '@/services/contracts';

import FileCard from './FileCard';
import FlashcardsStudyDialog from './FlashcardsStudyDialog';

type ResourcesSectionProps = {
  notebookId: string;
  resources: Flashcard[];
  canGenerate?: boolean;
  isLoading?: boolean;
  isGenerating?: boolean;
  retryAfterSeconds?: number;
  error?: string | null;
  onGenerate: () => void;
  onRetry?: () => void;
};

export default function ResourcesSection({
  notebookId,
  resources,
  canGenerate = false,
  isLoading = false,
  isGenerating = false,
  retryAfterSeconds = 0,
  error,
  onGenerate,
  onRetry,
}: ResourcesSectionProps) {
  return (
    <CollapsibleCard
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Star className="size-5 text-[#7452F5]" />
            <span>Flashcards ({resources.length})</span>
          </div>
        </div>
      }
      content={
        <div className="mt-3 space-y-2.5">
          <Button
            type="button"
            variant="secondary"
            className="w-full gap-2"
            disabled={isGenerating || !canGenerate}
            onClick={onGenerate}
          >
            <Plus className="size-4" />
            <span>
              {!canGenerate
                ? 'Procesa una fuente primero'
                : retryAfterSeconds > 0
                ? `Disponible en ${retryAfterSeconds}s`
                : isGenerating
                  ? 'Generando…'
                  : 'Generar 10 flashcards'}
            </span>
          </Button>
          {!canGenerate ? (
            <p className="text-xs leading-5 text-amber-700">Sube y procesa una fuente para generar nuevas flashcards.</p>
          ) : null}
          <FlashcardsStudyDialog
            notebookId={notebookId}
            flashcards={resources}
            isLoading={isLoading}
            isError={Boolean(error)}
            onRetry={onRetry}
          />
          {error ? <p className="text-xs text-rose-600" role="alert">{error}</p> : null}
          {isLoading ? (
            <div className="space-y-2" role="status" aria-label="Cargando flashcards">
              <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
            </div>
          ) : null}
          {!isLoading && resources.length === 0 ? (
            <p className="text-xs leading-5 text-slate-400">Genera tarjetas cuando tengas fuentes procesadas.</p>
          ) : null}
          {resources.slice(0, 4).map((resource, index) => (
            <FileCard
              key={resource.flashcard_id}
              title={resource.question}
              description={`Tarjeta ${index + 1}`}
              icon={<Layers3 className="size-3.5" />}
            />
          ))}
          {resources.length > 4 ? (
            <p className="px-1 text-[11px] text-slate-400">Y {resources.length - 4} tarjetas más en modo estudio.</p>
          ) : null}
        </div>
      }
    />
  );
}
