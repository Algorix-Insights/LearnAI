"use client";

import { BibliotecaHighlightsSection } from '@/features/biblioteca/components/BibliotecaHighlightsSection';
import { BibliotecaNotebooksSection } from '@/features/biblioteca/components/BibliotecaNotebooksSection';
import type { HighlightCard, NotebookItem } from '@/features/biblioteca/types';
import { notebookService } from '@/services/Notebook';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

interface BibliotecaPageContentProps {
    filters: string[];
}

function formatDate(dateValue: string) {
    const date = dayjs(dateValue);

    if (!date.isValid()) {
        return dateValue;
    }

    return date.format('D [de] MMMM [de] YYYY');
}

export function BibliotecaPageContent({ filters }: BibliotecaPageContentProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['notebooks', 100, 0],
        queryFn: () => notebookService.getNotebooks({ limit: 100, offset: 0 }),
    });

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

    const notebooksData = data?.data ?? [];

    if (notebooksData.length === 0) {
        return (
            <section className="space-y-4 rounded-[1.5rem] border border-[color:var(--app-border)] bg-white px-5 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
                <p className="text-sm text-slate-600">No tienes cuadernos, crea uno para que aparezca aqui.</p>
            </section>
        );
    }

    const now = dayjs();
    const limitDate = now.add(7, 'day');

    const highlightCards: HighlightCard[] = notebooksData
        .filter((notebook) => {
            if (!notebook.due_date) return false;
            const dueDate = dayjs(notebook.due_date);
            // Verifica si la fecha de vencimiento es válida y está entre hoy y los próximos 7 días
            return dueDate.isValid() && dueDate.isBetween(now, limitDate, 'day', '[]');
        })
        .map((notebook) => ({
            title: notebook.name,
            label: notebook.status || 'General',
            dueText: `Vence el ${formatDate(notebook.due_date)}`,
            sources: `${notebook.grade} nivel de avance`,
            accent: 'from-cyan-300 to-teal-400',
        }));

    const notebooks: NotebookItem[] = notebooksData.map((notebook) => ({
        title: notebook.name,
        category: notebook.status || 'General',
        lastSeen: formatDate(notebook.last_seen_at),
        sources: `${notebook.grade} nivel de avance`,
        dueDate: `Vence el ${formatDate(notebook.due_date)}`,
        status: notebook.is_favorite ? 'Favorito' : notebook.is_dominated ? 'Dominado' : undefined,
    }));

    return (
        <>
            <BibliotecaHighlightsSection cards={highlightCards} />
            <BibliotecaNotebooksSection filters={filters} notebooks={notebooks} />
        </>
    );
}