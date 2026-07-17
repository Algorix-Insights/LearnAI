'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, PanelLeftClose, Pencil, Share2, WandSparkles } from 'lucide-react';
import { Button } from '@/components/Button';
import { ShareNotebookDialog } from '@/features/salas/components/ShareNotebookDialog'

type NotebookHeaderProps = {
    title: string;
    onTitleChange?: (newTitle: string) => void;
    onToggleSidebar?: () => void;
    isSidebarOpen?: boolean;
    sidebarButtonRef?: React.Ref<HTMLButtonElement>;
};

export default function NotebookHeader({
    title: initialTitle,
    onTitleChange,
    onToggleSidebar,
    isSidebarOpen = false,
    sidebarButtonRef,
}: NotebookHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        setIsEditing(false);
        if (title.trim() && title !== initialTitle) {
            onTitleChange?.(title.trim());
        } else {
            setTitle(initialTitle); 
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setTitle(initialTitle);
            setIsEditing(false);
        }
    };

    return (
        <header className="flex h-16 items-center justify-between gap-4 border-b border-[rgba(116,82,245,0.12)] bg-white px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <Button
                    ref={sidebarButtonRef}
                    variant="pageIcon"
                    size="icon"
                    type="button"
                    className="lg:hidden"
                    onClick={onToggleSidebar}
                    aria-label={isSidebarOpen ? 'Cerrar panel de recursos' : 'Abrir panel de recursos'}
                    aria-controls="notebook-resource-panel"
                    aria-expanded={isSidebarOpen}
                >
                    <PanelLeftClose className="size-6" />
                </Button>

                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="min-w-0 truncate rounded-md border border-[rgba(116,82,245,0.4)] bg-slate-50 px-2 py-1 text-lg font-medium tracking-tight text-slate-800 outline-none ring-2 ring-purple-500/20 sm:text-[1.75rem]"
                    />
                ) : (
                    <div
                        onClick={() => setIsEditing(true)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setIsEditing(true);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        title="Haz clic para editar el título"
                        className="group flex min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-slate-100/80"
                    >
                        <h1 className="truncate text-lg font-medium tracking-tight text-slate-800 sm:text-[1.75rem]">
                            {title}
                        </h1>
                        <Pencil className="size-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="pageOutline" size="md" className="px-4" type="button">
                    <Share2 className="size-4" />
                    <span className="hidden sm:inline">Compartir</span>
                </Button>

                <Button variant="pageAccent" size="md" className="px-4 font-semibold" type="button">
                    <WandSparkles className="size-4" />
                    <span>Estudiar</span>
                </Button>

                <Button variant="pageIcon" size="iconMd" type="button">
                    <MoreHorizontal className="size-5" />
                </Button>
            </div>
        </header>
    );
}
