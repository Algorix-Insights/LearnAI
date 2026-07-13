'use client';

import { MessageCircleMore, Plus } from 'lucide-react';

import type { Conversation } from '@/services/contracts';

type BrowserTabsProps = {
  notebookTitle: string;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (conversationId: string) => void;
  onCreate: () => void;
};

export function BrowserTabs({
  notebookTitle,
  conversations,
  activeId,
  onSelect,
  onCreate,
}: BrowserTabsProps) {
  return (
    <div className="flex w-full items-end gap-2">
      <span className="grid size-7 place-items-center rounded-md border border-[rgba(116,82,245,0.14)] bg-white text-[color:var(--app-primary)]" title={notebookTitle}>
        <MessageCircleMore className="size-4" />
      </span>

      <div className="flex items-end gap-2 overflow-x-auto pr-1">
        {conversations.map((conversation) => {
          if (!conversation.conversation_id) return null;
          const active = conversation.conversation_id === activeId;
          return (
            <button
              key={conversation.conversation_id}
              type="button"
              onClick={() => onSelect(conversation.conversation_id as string)}
              className={`h-9 min-w-[160px] max-w-[220px] truncate rounded-t-[0.95rem] border border-b-0 border-[rgba(116,82,245,0.12)] px-4 text-sm transition ${active
                ? 'bg-white text-slate-700 shadow-[0_-1px_0_rgba(116,82,245,0.1)]'
                : 'bg-white/60 text-slate-400 hover:bg-white/90'
              }`}
            >
              {conversation.name || 'Nueva conversación'}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-dashed border-[rgba(116,82,245,0.28)] bg-white/70 text-[color:var(--app-primary)] shadow-[0_12px_24px_rgba(116,82,245,0.08)] transition hover:bg-white"
        aria-label="Crear conversación"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
