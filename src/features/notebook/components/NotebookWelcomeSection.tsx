import { Sparkles, Bot, User } from 'lucide-react';

import NotebookComposer from './NotebookComposer';
import NotebookQuickActions from './NotebookQuickActions';
import type { Message } from '@/services/contracts';

type NotebookWelcomeSectionProps = {
    actions: string[];
    messages: Message[];
    composerValue: string;
    isSending: boolean;
    sourcesCount: number;
    onComposerChange: (value: string) => void;
    onComposerSubmit: () => void;
    onQuickActionSelect: (action: string) => void;
};

function MessageBubble({ message }: { message: Message }) {
    const isAssistant = message.role === 'assistant';

    return (
        <article className={`flex items-end gap-3 ${isAssistant ? '' : 'justify-end'}`}>
            {isAssistant && (
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(35,215,194,0.16),rgba(116,82,245,0.18))] text-[color:var(--app-primary)]">
                    <Bot className="size-4" />
                </div>
            )}

            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${isAssistant
                    ? 'bg-white text-slate-700 ring-1 ring-slate-200'
                    : 'bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] text-white'
                }`}>
                <p className="whitespace-pre-wrap">{message.content ?? ''}</p>
            </div>

            {!isAssistant && (
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-900 text-white">
                    <User className="size-4" />
                </div>
            )}
        </article>
    );
}

export default function NotebookWelcomeSection({
    actions,
    messages,
    composerValue,
    isSending,
    sourcesCount,
    onComposerChange,
    onComposerSubmit,
    onQuickActionSelect,
}: NotebookWelcomeSectionProps) {
    const hasMessages = messages.length > 0;

    return (
        <section className="flex flex-1 min-h-0 px-4 py-4 sm:px-6 sm:py-6">
            <div className="flex w-full min-h-0 max-w-[980px] flex-col mx-auto">
                {!hasMessages ? (
                    <div className="flex flex-1 min-h-0 flex-col items-center justify-center text-center">
                        <Sparkles className="mb-5 size-7 text-[color:var(--app-primary)]" />

                        <h2 className="max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
                            <span className="bg-gradient-to-r from-[#23D7C2] via-[#5AA4F6] to-[#7452F5] bg-clip-text text-transparent">
                                Bienvenido de Nuevo, Tim
                            </span>
                        </h2>

                        <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                            Continuemos aprendiendo juntos. La mejor forma de aprender es estudiando.
                        </p>
                    </div>
                ) : (
                    <div className="flex min-h-0 flex-1 flex-col rounded-[2rem] border border-slate-200 bg-slate-50/70 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Conversación activa</p>
                                <p className="text-xs text-slate-500">Historial y respuestas en tiempo real.</p>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                                {messages.length} mensajes
                            </span>
                        </div>

                        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                            {messages.map((message, index) => (
                                <MessageBubble key={message.message_id ?? `${message.role}-${index}`} message={message} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <NotebookComposer
                        value={composerValue}
                        sourcesCount={sourcesCount}
                        isSending={isSending}
                        onValueChange={onComposerChange}
                        onSubmit={onComposerSubmit}
                    />
                    <NotebookQuickActions actions={actions} onActionSelect={onQuickActionSelect} />
                </div>
            </div>
        </section>
    );
}