import Link from 'next/link';

import { AppShell } from '@/layouts/app-shell';
import { BibliotecaHeroSection } from '@/features/biblioteca/components/BibliotecaHeroSection';
import { BibliotecaHighlightsSection } from '@/features/biblioteca/components/BibliotecaHighlightsSection';
import { BibliotecaNotebooksSection } from '@/features/biblioteca/components/BibliotecaNotebooksSection';
import type { HighlightCard, NotebookItem } from '@/features/biblioteca/types';

const filters = ['Todos', 'Vencen pronto', 'Favoritos'];

const highlightCards: HighlightCard[] = [
  {
    title: 'Nombre de cuaderno',
    label: 'Atención',
    dueText: 'Vence en 3 días',
    sources: '7 fuentes',
    accent: 'from-cyan-300 to-teal-400',
  },
  {
    title: 'Nombre de cuaderno',
    label: 'Atención',
    dueText: 'Vence en 3 días',
    sources: '7 fuentes',
    accent: 'from-violet-300 to-fuchsia-400',
  },
  {
    title: 'Nombre de cuaderno',
    label: 'Atención',
    dueText: 'Vence en 3 días',
    sources: '7 fuentes',
    accent: 'from-emerald-300 to-cyan-400',
  },
];

const notebooks: NotebookItem[] = [
  {
    title: 'Nombre del cuaderno',
    category: 'Universidad',
    lastSeen: 'Junio 17, 2026',
    sources: '9 fuentes',
    dueDate: 'Vence el 12 de junio 2025',
  },
  {
    title: 'Nombre del cuaderno',
    category: 'Repaso rápido',
    lastSeen: 'Junio 17, 2026',
    sources: '9 fuentes',
    dueDate: 'Vence el 12 de junio 2025',
  },
  {
    title: 'Nombre del cuaderno',
    category: 'Universidad',
    lastSeen: 'Junio 17, 2026',
    sources: '9 fuentes',
    dueDate: 'Vence el 12 de junio 2025',
    status: 'Favorito',
  },
];

export default function BibliotecaPage() {
  return (
    <AppShell activeHref="/biblioteca">
      <div className="space-y-8 pb-4 flex flex-col gap-8">
        <BibliotecaHeroSection />

        <BibliotecaHighlightsSection cards={highlightCards} />

        <BibliotecaNotebooksSection filters={filters} notebooks={notebooks} />
      </div>
    </AppShell>
  );
}