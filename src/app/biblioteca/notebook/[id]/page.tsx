'use client';

import SidebarLeft from '@/features/notebook/components/SidebarLeft';
import NotebookHeader from '@/features/notebook/components/NotebookHeader';
import NotebookTabsSection from '@/features/notebook/components/NotebookTabsSection';
import NotebookWelcomeSection from '@/features/notebook/components/NotebookWelcomeSection';
import { requireAuth } from '@/lib/require-auth';
import { notebookService } from '@/services/Notebook';
import { useQuery } from '@tanstack/react-query';

type NotebookPageProps = {
    params: Promise<{
        id: string;
    }>;
};

const quickActions = ['Flashcards', 'Examen V/F', 'Opción multiple', 'Preguntas abiertas'];

export default async function NotebookPage({ params }: NotebookPageProps) {
    await requireAuth();
    const { id } = await params;
    const initialNotebook = await notebookService.getNotebookById(id);

    return <ContentNotebook id={id} initialNotebook={initialNotebook} />;
}

type ContentNotebookProps = {
    id: string;
    initialNotebook: any; 
};

function ContentNotebook({ id, initialNotebook }: ContentNotebookProps) {

    const { data: notebook } = useQuery({
        queryKey: ['notebook', id],
        queryFn: () => notebookService.getNotebookById(id),
        initialData: initialNotebook, 
    });

    return (
        <div className="h-screen overflow-hidden bg-white text-slate-800">
            <div className="grid h-full min-h-0 lg:grid-cols-[254px_minmax(0,1fr)]">
                <SidebarLeft />
                <main className="flex h-full min-w-0 flex-col overflow-hidden">
                    <NotebookHeader title={notebook?.title ?? "Nombre del cuaderno uno"} />
                    <NotebookTabsSection notebookTitle={notebook?.title ?? id} />
                    <NotebookWelcomeSection actions={quickActions} />
                </main>
            </div>
        </div>
    );
}