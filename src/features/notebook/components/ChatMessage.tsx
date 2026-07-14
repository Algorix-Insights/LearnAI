'use client';

import { memo, useEffect, useState } from 'react';
import { Check, Copy, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

import type { Message, RagSource } from '@/services/contracts';

const MarkdownMessage = dynamic(() => import('./MarkdownMessage'), {
  loading: () => <span className="text-slate-400">Formateando respuesta…</span>,
});

type ChatMessageProps = {
  message: Message;
  isPending?: boolean;
  sources?: RagSource[];
};

const emptySources: RagSource[] = [];

function ChatMessage({ message, isPending = false, sources = emptySources }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const content = message.content ?? '';

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyResponse = async () => {
    if (!content || !navigator.clipboard) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
  };

  if (message.role === 'system') {
    return (
      <div className="mx-auto max-w-xl rounded-full bg-slate-100 px-4 py-2 text-center text-xs text-slate-500">
        {content}
      </div>
    );
  }

  return (
    <article
      className={`group max-w-[92%] sm:max-w-[82%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
      aria-label={isUser ? 'Tu mensaje' : 'Respuesta de LearnAI'}
    >
      {!isUser ? (
        <div className="mb-1.5 flex items-center gap-2 px-1 text-[11px] font-medium text-slate-500">
          <span className="grid size-5 place-items-center rounded-full bg-[#7452F5]/10 text-[#6545da]">
            <Sparkles className="size-3" aria-hidden="true" />
          </span>
          LearnAI
        </div>
      ) : null}

      <div
        className={isUser
          ? 'rounded-[1.35rem] rounded-br-md bg-[color:var(--app-primary)] px-4 py-3 text-sm leading-6 text-white shadow-[0_10px_30px_rgba(116,82,245,0.16)]'
          : 'rounded-[1.35rem] rounded-tl-md border border-[color:var(--app-border)] bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-[0_12px_32px_rgba(15,23,42,0.04)] sm:px-5 sm:py-4'}
      >
        {isUser ? <p className="whitespace-pre-wrap break-words">{content}</p> : <MarkdownMessage content={content} />}
        {!isUser && sources.length > 0 ? (
          <details className="mt-4 border-t border-slate-100 pt-3 text-xs">
            <summary className="cursor-pointer select-none font-medium text-[#6545da] outline-none focus-visible:ring-2 focus-visible:ring-[#7452F5]/20">
              {sources.length} {sources.length === 1 ? 'fuente utilizada' : 'fuentes utilizadas'}
            </summary>
            <ol className="mt-3 space-y-2">
              {sources.map((source, index) => (
                <li key={source.chunk_id ?? `${source.document_id}-${index}`} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
                  <p className="font-medium text-slate-700">[{index + 1}] {source.document_name || 'Fuente del cuaderno'}</p>
                  {source.content ? <p className="mt-1 max-h-16 overflow-hidden leading-5 text-slate-500">{source.content}</p> : null}
                </li>
              ))}
            </ol>
          </details>
        ) : null}
      </div>

      <div className={`mt-1.5 flex min-h-7 items-center gap-2 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {isPending ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400" role="status">
            <span className="size-1.5 animate-pulse rounded-full bg-[#7452F5]" />
            Enviando
          </span>
        ) : null}
        {!isUser && content ? (
          <button
            type="button"
            onClick={copyResponse}
            className="inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-[11px] text-slate-400 opacity-70 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7452F5]/30 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            aria-label={copied ? 'Respuesta copiada' : 'Copiar respuesta'}
          >
            {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default memo(ChatMessage);
