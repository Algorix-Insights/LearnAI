'use client';

import { useRef } from 'react';
import { FileText, Plus, Trash2, UploadCloud } from 'lucide-react';

import { Button } from '@/components/Button';
import { CollapsibleCard } from '@/components/CollapsibleCard';
import type { Document } from '@/services/contracts';

import FileCard from './FileCard';

type SourcesSectionProps = {
  sources: Document[];
  isLoading?: boolean;
  isUploading?: boolean;
  retryAfterSeconds?: number;
  error?: string | null;
  onUpload: (file: File) => void;
  onDelete: (documentId: string) => void;
};

function formatBytes(bytes: number | null) {
  if (!bytes) return 'Tamaño no disponible';
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SourcesSection({
  sources,
  isLoading = false,
  isUploading = false,
  retryAfterSeconds = 0,
  error,
  onUpload,
  onDelete,
}: SourcesSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <CollapsibleCard
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <UploadCloud className="size-5 text-[#7452F5]" />
            <span>Fuentes ({sources.length})</span>
          </div>
        </div>
      }
      content={
        <div className="mt-3 space-y-2.5">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,text/plain,text/markdown,.md"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
              event.target.value = '';
            }}
          />
          <Button
            type="button"
            variant="secondary"
            className="w-full gap-2"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <Plus className="size-4" />
            <span>
              {retryAfterSeconds > 0
                ? `Disponible en ${retryAfterSeconds}s`
                : isUploading
                  ? 'Procesando fuente…'
                  : 'Agregar fuente'}
            </span>
          </Button>

          {error ? <p className="text-xs text-rose-600" role="alert">{error}</p> : null}
          {isLoading ? <p className="text-xs text-slate-400">Cargando fuentes…</p> : null}
          {!isLoading && sources.length === 0 ? (
            <p className="text-xs leading-5 text-slate-400">Sube un PDF, TXT o Markdown para habilitar RAG.</p>
          ) : null}
          {sources.map((source) => (
            <FileCard
              key={source.document_id}
              title={source.name || 'Fuente sin nombre'}
              description={`${source.source_type?.toUpperCase() || 'ARCHIVO'} · ${formatBytes(source.size_bytes)} · ${source.processing_status || 'sin estado'}`}
              icon={<FileText className="size-3.5" />}
              action={source.document_id ? (
                <Button
                  variant="sidebarText"
                  size="iconSm"
                  className="rounded-full text-slate-400 hover:text-rose-600"
                  type="button"
                  onClick={() => onDelete(source.document_id as string)}
                  aria-label={`Eliminar ${source.name || 'fuente'}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              ) : null}
            />
          ))}
        </div>
      }
    />
  );
}
