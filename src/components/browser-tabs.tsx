'use client';

import { useMemo, useState } from 'react';

import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, type DragEndEvent, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, Clock3, MoreHorizontal, Plus, X } from 'lucide-react';

import { Button } from '@/components/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Conversation } from '@/services/contracts';

type BrowserTabsProps = {
    notebookTitle: string;
    tabs: TabItem[];
    activeTabId: string;
    historyItems: Conversation[];
    onSelectTab: (tabId: string) => void;
    onCloseTab: (tabId: string) => void;
    onAddTab: () => void;
    onSelectHistoryConversation: (conversation: Conversation) => void;
    onReorderTabs: (activeTabId: string, overTabId: string) => void;
};

type TabItem = {
    id: string;
    title: string;
    conversationId?: string | null;
    isDraft?: boolean;
};

export function BrowserTabs({
    notebookTitle,
    tabs,
    activeTabId,
    historyItems,
    onSelectTab,
    onCloseTab,
    onAddTab,
    onSelectHistoryConversation,
    onReorderTabs,
}: BrowserTabsProps) {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const ids = useMemo(() => tabs.map((tab) => tab.id), [tabs]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 160, tolerance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const draggedTabId = String(active.id);
        const targetTabId = String(over.id);

        if (draggedTabId !== targetTabId) {
            onReorderTabs(draggedTabId, targetTabId);
        }
    };

    const handleClose = (tabId: string) => {
        if (tabs.length <= 1) {
            return;
        }

        onCloseTab(tabId);
    };

    const historyLabel = historyItems.length
        ? `Historial (${historyItems.length})`
        : 'Historial vacío';

    return (
        <div className="flex w-full items-end gap-2">
            <Popover open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <PopoverTrigger
                    render={
                        <Button
                            variant="pageIcon"
                            size="icon"
                            type="button"
                            className="size-7 rounded-md border border-[rgba(116,82,245,0.14)] bg-white text-[color:var(--app-primary)]"
                        />
                    }
                >
                    <MoreHorizontal className="size-4" />
                </PopoverTrigger>
                <PopoverContent className="w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                    <div className="mb-2 flex items-center justify-between px-1">
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{historyLabel}</p>
                            <p className="text-xs text-slate-500">Abre una conversación previa o retoma una sesión.</p>
                        </div>
                        <Clock3 className="size-4 text-slate-400" />
                    </div>

                    <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                        {historyItems.length === 0 && (
                            <p className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
                                Todavía no hay historial de conversación.
                            </p>
                        )}

                        {historyItems.map((conversation, index) => {
                            const conversationId = conversation.conversation_id ?? '';
                            const title = conversation.name?.trim() || conversation.summary?.trim()?.slice(0, 48) || `Conversación ${index + 1}`;

                            return (
                                <button
                                    key={conversationId || `${title}-${index}`}
                                    type="button"
                                    onClick={() => {
                                        if (conversationId) {
                                            onSelectHistoryConversation(conversation);
                                            setIsHistoryOpen(false);
                                        }
                                    }}
                                    className="flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-slate-50"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-slate-800">{title}</p>
                                        <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                                            {conversation.summary?.trim() || 'Sin resumen todavía.'}
                                        </p>
                                    </div>

                                    <ChevronRight className="mt-1 size-4 shrink-0 text-slate-300" />
                                </button>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
                    <div className="flex items-end gap-2 overflow-x-auto pr-1">
                        {tabs.map((tab) => (
                            <SortableBrowserTab
                                key={tab.id}
                                id={tab.id}
                                title={tab.title}
                                active={tab.id === activeTabId}
                                canClose={tabs.length > 1}
                                onSelect={() => onSelectTab(tab.id)}
                                onClose={() => handleClose(tab.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <button
                type="button"
                onClick={onAddTab}
                className="grid size-9 place-items-center rounded-full border border-dashed border-[rgba(116,82,245,0.28)] bg-white/70 text-[color:var(--app-primary)] shadow-[0_12px_24px_rgba(116,82,245,0.08)] transition hover:bg-white"
                aria-label="Abrir nueva pestaña"
            >
                <Plus className="size-4" />
            </button>

            <span className="sr-only">{notebookTitle}</span>
        </div>
    );
}

type SortableBrowserTabProps = {
    id: string;
    title: string;
    active: boolean;
    canClose: boolean;
    onSelect: () => void;
    onClose: () => void;
};

function SortableBrowserTab({ id, title, active, canClose, onSelect, onClose }: SortableBrowserTabProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0 100%)',
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            role="button"
            tabIndex={0}
            onClick={onSelect}
            className={`group flex h-9 min-w-[170px] items-center justify-between gap-3 rounded-t-[0.95rem] border border-[rgba(116,82,245,0.12)] border-b-0 px-4 text-sm outline-none transition-[background-color,box-shadow,border-color,opacity] focus-visible:ring-2 focus-visible:ring-[rgba(116,82,245,0.34)] ${active
                    ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,255,0.84))] text-slate-600 shadow-[0_-1px_0_rgba(116,82,245,0.1)]'
                    : 'bg-white/75 text-slate-400 hover:bg-white/90'
                } ${isDragging ? 'opacity-70' : ''}`}
        >
            <span className="truncate">{title}</span>

            {canClose && (
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                    className="grid size-5 place-items-center rounded-full text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700 focus:opacity-100"
                    aria-label={`Cerrar pestaña ${title}`}
                >
                    <X className="size-3.5" />
                </button>
            )}
        </div>
    );
}