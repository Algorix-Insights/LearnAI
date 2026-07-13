import { Sparkles } from 'lucide-react';

import type { Message } from '@/services/contracts';

import NotebookComposer from './NotebookComposer';
import NotebookQuickActions from './NotebookQuickActions';

type NotebookWelcomeSectionProps = {
  actions: string[];
  userName?: string | null;
  messages: Message[];
  sourceCount: number;
  isSending?: boolean;
  error?: string | null;
  statusMessage?: string | null;
  onSend: (content: string) => void;
  isGenerating?: boolean;
  onQuickAction?: (action: string) => void;
};

export default function NotebookWelcomeSection({
  actions,
  userName,
  messages,
  sourceCount,
  isSending = false,
  error,
  statusMessage,
  onSend,
  isGenerating = false,
  onQuickAction,
}: NotebookWelcomeSectionProps) {
  return (
    <section className="flex min-h-0 flex-1 justify-center overflow-y-auto px-4 py-8 sm:px-6">
      <div className="flex w-full max-w-[980px] flex-col items-center text-center">
        {messages.length === 0 ? (
          <>
            <Sparkles className="mb-5 size-7 text-[color:var(--app-primary)]" />
            <h2 className="max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-[#23D7C2] via-[#5AA4F6] to-[#7452F5] bg-clip-text text-transparent">
                Bienvenido de nuevo, {userName || 'estudiante'}
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
              Pregunta sobre tus apuntes y conserva el contexto en esta conversación.
            </p>
          </>
        ) : (
          <div className="w-full space-y-4 text-left" aria-live="polite">
            {messages.map((message) => (
              <article
                key={message.message_id}
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user'
                  ? 'ml-auto bg-[color:var(--app-primary)] text-white'
                  : 'mr-auto border border-[color:var(--app-border)] bg-white text-slate-700'
                }`}
              >
                {message.content}
              </article>
            ))}
          </div>
        )}

        <NotebookComposer sourceCount={sourceCount} isSending={isSending} onSend={onSend} />
        {error ? <p className="mt-3 text-sm text-rose-600" role="alert">{error}</p> : null}
        {statusMessage ? <p className="mt-3 text-sm text-emerald-700" role="status">{statusMessage}</p> : null}
        {messages.length === 0 ? (
          <NotebookQuickActions actions={actions} disabled={isGenerating} onAction={onQuickAction} />
        ) : null}
      </div>
    </section>
  );
}
