"use client";

import { useQuery } from '@tanstack/react-query';

import { notebookService } from '@/services/Notebook';

import { BibliotecaNotebooksSection } from './BibliotecaNotebooksSection';
import type { NotebookItem } from '../types';

type BibliotecaNotebooksClientProps = {
    filters: string[];
};

function formatDate(dateValue: string) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

function toNotebookItem(notebook: Awaited<ReturnType<typeof notebookService.getNotebooks>>['data'][number]): NotebookItem {
    return {
        title: notebook.name,
        category: notebook.status || 'General',
        lastSeen: formatDate(notebook.last_seen_at),
        sources: `${notebook.grade} nivel de avance`,
        dueDate: `Vence el ${formatDate(notebook.due_date)}`,
        status: notebook.is_favorite ? 'Favorito' : notebook.is_dominated ? 'Dominado' : undefined,
    };
}

export function BibliotecaNotebooksClient({ filters }: BibliotecaNotebooksClientProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['notebooks', 100, 0],
        queryFn: () => notebookService.getNotebooks({ limit: 100, offset: 0 }),
    });

    const notebooks = data?.data.map(toNotebookItem) ?? [];

    if (isLoading) {
        return (
            <section className="space-y-4 rounded-[1.5rem] border border-[color:var(--app-border)] bg-white px-5 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
                <p className="text-sm text-slate-500">Cargando notebooks...</p>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="space-y-4 rounded-[1.5rem] border border-[color:var(--app-border)] bg-white px-5 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
                <p className="text-sm text-rose-600">No fue posible cargar los notebooks.</p>
            </section>
        );
    }

    return <BibliotecaNotebooksSection filters={filters} notebooks={notebooks} />;
}