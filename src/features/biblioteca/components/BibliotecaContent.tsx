"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { NotebookService } from '@/services/Notebook';
import type { Notebook } from '@/services/contracts';

import type { HighlightCard, NotebookItem } from '../types';
import { BibliotecaHeroSection } from './BibliotecaHeroSection';
import { BibliotecaHighlightsSection } from './BibliotecaHighlightsSection';
import { BibliotecaNotebooksSection } from './BibliotecaNotebooksSection';

const filters = ['Todos', 'Vencen pronto', 'Favoritos'];
const UPCOMING_WINDOW_MS = 30 * 24 * 60 * 60 * 1_000;

function hasNotebookId(
  notebook: Notebook,
): notebook is Notebook & { notebook_id: string } {
  return Boolean(notebook.notebook_id);
}

function formatDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
  }).format(date);
}

function formatDueDate(value: string | null) {
  const formatted = formatDate(value);
  return formatted ? `Vence el ${formatted}` : 'Sin fecha límite';
}

function toNotebookItem(
  notebook: Notebook & { notebook_id: string },
): NotebookItem {
  return {
    id: notebook.notebook_id,
    title: notebook.name || 'Cuaderno sin nombre',
    category: notebook.status === 'active' ? 'Activo' : notebook.status || 'Cuaderno',
    lastSeen: formatDate(notebook.last_seen_at) || 'Sin actividad',
    detail: notebook.summary || notebook.description || 'Sin descripción',
    dueDate: formatDueDate(notebook.due_date),
    status: notebook.is_favorite ? 'Favorito' : undefined,
  };
}

function toHighlightCards(
  notebooks: Array<Notebook & { notebook_id: string }>,
): HighlightCard[] {
  const now = Date.now();

  return notebooks
    .filter((notebook) => {
      if (!notebook.due_date || notebook.status !== 'active') return false;
      const dueTime = new Date(notebook.due_date).getTime();
      return (
        Number.isFinite(dueTime) &&
        dueTime >= now &&
        dueTime <= now + UPCOMING_WINDOW_MS
      );
    })
    .sort(
      (left, right) =>
        new Date(left.due_date!).getTime() - new Date(right.due_date!).getTime(),
    )
    .slice(0, 3)
    .map((notebook) => ({
      id: notebook.notebook_id,
      title: notebook.name || 'Cuaderno sin nombre',
      label: 'Próximo',
      dueText: formatDueDate(notebook.due_date),
      detail: notebook.summary || notebook.description || 'Cuaderno personal',
    }));
}

export function BibliotecaContent() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const notebooksQuery = useQuery({
    queryKey: ['notebooks'],
    queryFn: () => NotebookService.list({ limit: 100, offset: 0 }),
  });

  const notebooks = (notebooksQuery.data?.data ?? []).filter(hasNotebookId);
  const normalizedSearch = search.trim().toLocaleLowerCase('es-MX');
  const filteredNotebooks = notebooks.filter((notebook) => {
    const matchesSearch =
      !normalizedSearch ||
      [notebook.name, notebook.description, notebook.summary].some((value) =>
        value?.toLocaleLowerCase('es-MX').includes(normalizedSearch),
      );
    if (!matchesSearch) return false;

    if (activeFilter === 'Favoritos') return notebook.is_favorite === true;
    if (activeFilter === 'Vencen pronto') {
      if (!notebook.due_date) return false;
      const dueTime = new Date(notebook.due_date).getTime();
      const now = Date.now();
      return (
        notebook.status === 'active' &&
        Number.isFinite(dueTime) &&
        dueTime >= now &&
        dueTime <= now + UPCOMING_WINDOW_MS
      );
    }

    return true;
  });
  const notebookItems = filteredNotebooks.map(toNotebookItem);
  const highlights = toHighlightCards(notebooks);

  return (
    <div className="flex flex-col gap-8 pb-4">
      <BibliotecaHeroSection search={search} onSearchChange={setSearch} />

      {highlights.length > 0 ? (
        <BibliotecaHighlightsSection cards={highlights} />
      ) : null}

      {notebooksQuery.isPending ? (
        <div
          className="rounded-[1.5rem] border border-[color:var(--app-border)] bg-white p-8 text-sm text-slate-500"
          role="status"
        >
          Cargando cuadernos…
        </div>
      ) : null}

      {notebooksQuery.isError ? (
        <div
          className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700"
          role="alert"
        >
          {notebooksQuery.error instanceof Error
            ? notebooksQuery.error.message
            : 'No fue posible cargar los cuadernos.'}
        </div>
      ) : null}

      {!notebooksQuery.isPending && !notebooksQuery.isError ? (
        <BibliotecaNotebooksSection
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          notebooks={notebookItems}
        />
      ) : null}
    </div>
  );
}
