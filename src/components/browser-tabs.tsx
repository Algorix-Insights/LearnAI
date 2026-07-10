'use client';

import { useMemo, useState } from 'react';

import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, type DragEndEvent, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Plus, X } from 'lucide-react';

type BrowserTabsProps = {
    notebookTitle: string;
};

type TabItem = {
    id: string;
    title: string;
};

const initialTabs: TabItem[] = [
    { id: 'chat-1', title: 'Nuevo Chat' },
    { id: 'chat-2', title: 'Resumen rápido' },
    { id: 'chat-3', title: 'Preguntas' },
];

export function BrowserTabs({ notebookTitle }: BrowserTabsProps) {
    const [tabs, setTabs] = useState(initialTabs);
    const [activeId, setActiveId] = useState(initialTabs[0]?.id ?? 'chat-1');

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

        setTabs((currentTabs) => {
            const oldIndex = currentTabs.findIndex((tab) => tab.id === active.id);
            const newIndex = currentTabs.findIndex((tab) => tab.id === over.id);
            return arrayMove(currentTabs, oldIndex, newIndex);
        });
    };

    const handleClose = (tabId: string) => {
        setTabs((currentTabs) => {
            const currentIndex = currentTabs.findIndex((tab) => tab.id === tabId);
            const nextTabs = currentTabs.filter((tab) => tab.id !== tabId);

            if (tabId === activeId) {
                const fallbackTab = nextTabs[currentIndex] ?? nextTabs[currentIndex - 1] ?? nextTabs[0];
                setActiveId(fallbackTab?.id ?? '');
            }

            return nextTabs;
        });
    };

    const handleAddTab = () => {
        const newTab = {
            id: `chat-${Date.now()}`,
            title: `Nuevo Chat ${tabs.length + 1}`,
        };

        setTabs((currentTabs) => [...currentTabs, newTab]);
        setActiveId(newTab.id);
    };

    return (
        <div className="flex w-full items-end gap-2">
            <button className="grid size-7 place-items-center rounded-md border border-[rgba(116,82,245,0.14)] bg-white text-[color:var(--app-primary)]">
                <MoreHorizontal className="size-4" />
            </button>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
                    <div className="flex items-end gap-2 overflow-x-auto pr-1">
                        {tabs.map((tab) => (
                            <SortableBrowserTab
                                key={tab.id}
                                id={tab.id}
                                title={tab.title}
                                active={tab.id === activeId}
                                onSelect={() => setActiveId(tab.id)}
                                onClose={() => handleClose(tab.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <button
                type="button"
                onClick={handleAddTab}
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
    onSelect: () => void;
    onClose: () => void;
};

function SortableBrowserTab({ id, title, active, onSelect, onClose }: SortableBrowserTabProps) {
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
        </div>
    );
}