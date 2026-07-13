import SidebarLeft from '@/features/notebook/components/SidebarLeft';
import NotebookHeader from '@/features/notebook/components/NotebookHeader';
import NotebookTabsSection from '@/features/notebook/components/NotebookTabsSection';
import NotebookWelcomeSection from '@/features/notebook/components/NotebookWelcomeSection';

type NotebookPageProps = {
    params: Promise<{
        id: string;
    }>;
};

const quickActions = ['Flashcards', 'Examen V/F', 'Opción multiple', 'Preguntas abiertas'];

export default async function NotebookPage({ params }: NotebookPageProps) {
    const { id } = await params;

    return (
        <div className="h-screen overflow-hidden bg-white text-slate-800">
            <div className="grid h-full min-h-0 lg:grid-cols-[254px_minmax(0,1fr)]">
                <SidebarLeft />
                <main className="flex h-full min-w-0 flex-col overflow-hidden">
                    <NotebookHeader title="Nombre del cuaderno uno" />
                    <NotebookTabsSection notebookTitle={id} />
                    <NotebookWelcomeSection actions={quickActions} />
                </main>
            </div>
        </div>
    );
}
