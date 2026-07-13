'use client';

import { useEffect, useRef, useState, type UIEvent } from 'react';
import { ArrowDown, RefreshCw, Sparkles } from 'lucide-react';

import { Button } from '@/components/Button';
import type { Message } from '@/services/contracts';

import ChatMessage from './ChatMessage';
import NotebookComposer from './NotebookComposer';
import NotebookQuickActions from './NotebookQuickActions';

type NotebookWelcomeSectionProps = {
  actions: string[];
  userName?: string | null;
  messages: Message[];
  pendingMessage?: string | null;
  sourceCount: number;
  isLoadingMessages?: boolean;
  isSending?: boolean;
  isSendDisabled?: boolean;
  sendDisabledReason?: string;
  hasProcessedSources?: boolean;
  error?: string | null;
  statusMessage?: string | null;
  onSend: (content: string) => void;
  onRetry?: () => void;
  retryLabel?: string;
  canRetry?: boolean;
  isGenerating?: boolean;
  onQuickAction?: (action: string) => void;
};

export default function NotebookWelcomeSection({
  actions,
  userName,
  messages,
  pendingMessage,
  sourceCount,
  isLoadingMessages = false,
  isSending = false,
  isSendDisabled = false,
  sendDisabledReason,
  hasProcessedSources = true,
  error,
  statusMessage,
  onSend,
  onRetry,
  retryLabel = 'Reintentar',
  canRetry = true,
  isGenerating = false,
  onQuickAction,
}: NotebookWelcomeSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const hasConversation = messages.length > 0 || Boolean(pendingMessage);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    const isNearBottom = distanceToBottom < 140;
    isNearBottomRef.current = isNearBottom;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    if (isSending || isNearBottomRef.current) {
      scrollToBottom(messages.length === 0 ? 'auto' : 'smooth');
    }
  }, [isSending, messages.length, pendingMessage]);

  return (
    <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(116,82,245,0.035),transparent_42%)]">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-7 sm:px-6 sm:py-9"
      >
        <div className="mx-auto w-full max-w-[980px]">
          {!hasConversation && !isLoadingMessages ? (
            <div className="flex min-h-[38vh] flex-col items-center justify-center text-center">
              <Sparkles className="mb-5 size-7 text-[color:var(--app-primary)]" />
              <h2 className="max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-[#23D7C2] via-[#5AA4F6] to-[#7452F5] bg-clip-text text-transparent">
                  Bienvenido de nuevo, {userName || 'estudiante'}
                </span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                Pregunta sobre tus apuntes y conserva el contexto en esta conversación.
              </p>
              <NotebookQuickActions actions={actions} disabled={isGenerating || !hasProcessedSources} onAction={onQuickAction} />
              {!hasProcessedSources ? (
                <p className="mt-3 text-xs text-amber-700" role="status">Sube y procesa una fuente para generar recursos.</p>
              ) : null}
            </div>
          ) : null}

          {isLoadingMessages ? (
            <div className="space-y-5 py-5" role="status" aria-label="Cargando conversación">
              <div className="ml-auto h-16 w-[58%] animate-pulse rounded-[1.35rem] bg-[#7452F5]/10" />
              <div className="h-28 w-[78%] animate-pulse rounded-[1.35rem] bg-slate-100" />
              <div className="h-20 w-[66%] animate-pulse rounded-[1.35rem] bg-slate-100" />
            </div>
          ) : null}

          {!isLoadingMessages && hasConversation ? (
            <div className="space-y-3 text-left" aria-live="polite" aria-relevant="additions">
              {messages.map((message, index) => (
                <ChatMessage key={message.message_id ?? `${message.role}-${message.order_message ?? index}`} message={message} />
              ))}
              {pendingMessage ? (
                <ChatMessage
                  isPending
                  message={{
                    message_id: null,
                    conversation_id: null,
                    role: 'user',
                    content: pendingMessage,
                    order_message: null,
                    created_at: null,
                  }}
                />
              ) : null}
              {isSending ? (
                <div className="mr-auto max-w-[82%]" role="status" aria-label="LearnAI está pensando">
                  <div className="mb-1.5 flex items-center gap-2 px-1 text-[11px] font-medium text-slate-500">
                    <span className="grid size-5 place-items-center rounded-full bg-[#7452F5]/10 text-[#6545da]"><Sparkles className="size-3" /></span>
                    LearnAI
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-[1.35rem] rounded-tl-md border border-[color:var(--app-border)] bg-white px-4 py-3 text-xs text-slate-500 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
                    <span className="flex gap-1" aria-hidden="true">
                      <span className="size-1.5 animate-bounce rounded-full bg-[#7452F5] [animation-delay:-0.3s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-[#7452F5] [animation-delay:-0.15s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-[#7452F5]" />
                    </span>
                    Pensando con tus fuentes…
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between" role="alert">
              <p className="leading-5">{error}</p>
              {onRetry ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={!canRetry || isSending}
                  className="shrink-0 border-rose-200 bg-white text-rose-700 hover:bg-rose-100"
                  onClick={onRetry}
                >
                  <RefreshCw className="size-3.5" /> {retryLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
          {statusMessage ? <p className="mt-4 text-center text-sm text-emerald-700" role="status">{statusMessage}</p> : null}
          <div ref={messagesEndRef} className="h-2" aria-hidden="true" />
        </div>
      </div>

      {showScrollButton ? (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          className="absolute bottom-32 left-1/2 z-10 grid size-9 -translate-x-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_10px_30px_rgba(15,23,42,0.14)] transition hover:text-[#6545da] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7452F5]/20"
          aria-label="Ir al mensaje más reciente"
        >
          <ArrowDown className="size-4" />
        </button>
      ) : null}

      <div className="shrink-0 border-t border-slate-100/70 bg-white/90 px-4 pb-4 pt-3 backdrop-blur-xl sm:px-6 sm:pb-5">
        <div className="mx-auto w-full max-w-[980px]">
          <NotebookComposer
            sourceCount={sourceCount}
            isSending={isSending}
            isDisabled={isSendDisabled}
            disabledReason={sendDisabledReason}
            onSend={onSend}
          />
        </div>
      </div>
    </section>
  );
}
