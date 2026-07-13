'use client';

import { useState, type FormEvent } from 'react';
import { ChevronRight, FileText } from 'lucide-react';

import { Button } from '@/components/Button';

type NotebookComposerProps = {
  sourceCount: number;
  isSending?: boolean;
  onSend: (content: string) => void;
};

export default function NotebookComposer({
  sourceCount,
  isSending = false,
  onSend,
}: NotebookComposerProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = content.trim();
    if (!message || isSending) return;
    onSend(message);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 w-full rounded-2xl border border-[rgba(116,82,245,0.28)] bg-white p-3 sm:p-4">
      <textarea
        aria-label="Mensaje para tu cuaderno"
        placeholder="Pregunta algo sobre tus fuentes…"
        value={content}
        maxLength={4000}
        onChange={(event) => setContent(event.target.value)}
        className="min-h-[72px] w-full resize-none rounded-xl border-0 bg-transparent px-1 py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs text-slate-500">
          <FileText className="size-3.5" />
          {sourceCount} {sourceCount === 1 ? 'fuente' : 'fuentes'}
        </span>
        <Button
          variant="pageAccent"
          size="icon"
          type="submit"
          disabled={!content.trim() || isSending}
          aria-label="Enviar mensaje"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
