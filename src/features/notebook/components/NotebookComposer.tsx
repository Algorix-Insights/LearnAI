'use client';

import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ChevronRight, FileText, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/Button';

type NotebookComposerProps = {
  sourceCount: number;
  isSending?: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  onSend: (content: string) => void;
};

export default function NotebookComposer({
  sourceCount,
  isSending = false,
  isDisabled = false,
  disabledReason,
  onSend,
}: NotebookComposerProps) {
  const [content, setContent] = useState('');
  const textareaId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = content.trim();
    if (!message || isSending || isDisabled) return;
    onSend(message);
    setContent('');
    if (textareaRef.current) textareaRef.current.style.height = '72px';
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  const resizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 180)}px`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-[rgba(116,82,245,0.24)] bg-white p-3 shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition focus-within:border-[#7452F5]/55 focus-within:ring-4 focus-within:ring-[#7452F5]/[0.06] sm:p-4"
      aria-busy={isSending}
    >
      <label htmlFor={textareaId} className="sr-only">Mensaje para tu cuaderno</label>
      <textarea
        id={textareaId}
        ref={textareaRef}
        aria-describedby={`${textareaId}-help ${textareaId}-count`}
        placeholder={disabledReason || 'Pregunta algo sobre tus fuentes…'}
        value={content}
        maxLength={4000}
        readOnly={isSending || isDisabled}
        aria-disabled={isDisabled}
        onKeyDown={handleKeyDown}
        onChange={(event) => {
          setContent(event.target.value);
          resizeTextarea(event.target);
        }}
        className="min-h-[72px] max-h-[180px] w-full resize-none overflow-y-auto rounded-xl border-0 bg-transparent px-1 py-1 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 read-only:cursor-wait"
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs text-slate-500">
            <FileText className="size-3.5" aria-hidden="true" />
            {sourceCount} {sourceCount === 1 ? 'fuente' : 'fuentes'}
          </span>
          <span id={`${textareaId}-help`} className="hidden text-[11px] text-slate-400 sm:inline">
            {disabledReason || 'Enter para enviar · Shift + Enter para nueva línea'}
          </span>
        </div>
        <span id={`${textareaId}-count`} className="sr-only">{content.length} de 4000 caracteres</span>
        <Button
          variant="pageAccent"
          size="icon"
          type="submit"
          disabled={!content.trim() || isSending || isDisabled}
          aria-label={isSending ? 'Enviando mensaje' : 'Enviar mensaje'}
        >
          {isSending ? <LoaderCircle className="size-4 animate-spin" /> : <ChevronRight className="size-4" />}
        </Button>
      </div>
    </form>
  );
}
