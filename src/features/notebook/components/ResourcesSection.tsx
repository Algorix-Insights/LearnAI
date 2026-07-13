import { Layers3, Plus, Star } from 'lucide-react';

import { Button } from '@/components/Button';
import { CollapsibleCard } from '@/components/CollapsibleCard';
import type { Flashcard } from '@/services/contracts';

import FileCard from './FileCard';

type ResourcesSectionProps = {
  resources: Flashcard[];
  isLoading?: boolean;
  isGenerating?: boolean;
  retryAfterSeconds?: number;
  error?: string | null;
  onGenerate: () => void;
};

export default function ResourcesSection({
  resources,
  isLoading = false,
  isGenerating = false,
  retryAfterSeconds = 0,
  error,
  onGenerate,
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
            disabled={isGenerating}
            onClick={onGenerate}
          >
            <Plus className="size-4" />
            <span>
              {retryAfterSeconds > 0
                ? `Disponible en ${retryAfterSeconds}s`
                : isGenerating
                  ? 'Generando…'
                  : 'Generar 10 flashcards'}
            </span>
          </Button>
          {error ? <p className="text-xs text-rose-600" role="alert">{error}</p> : null}
          {isLoading ? <p className="text-xs text-slate-400">Cargando recursos…</p> : null}
          {!isLoading && resources.length === 0 ? (
            <p className="text-xs leading-5 text-slate-400">Genera tarjetas cuando tengas fuentes procesadas.</p>
          ) : null}
          {resources.slice(0, 8).map((resource) => (
            <FileCard
              key={resource.flashcard_id}
              title={resource.question}
              description={resource.answer}
              icon={<Layers3 className="size-3.5" />}
            />
          ))}
        </div>
      }
    />
  );
}
