import SidebarLeft from '@/features/notebook/components/SidebarLeft';
import NotebookHeader from '@/features/notebook/components/NotebookHeader';
import NotebookTabsSection from '@/features/notebook/components/NotebookTabsSection';
import NotebookWelcomeSection from '@/features/notebook/components/NotebookWelcomeSection';
import { requireAuth } from '@/lib/require-auth';
import { ContentNotebook } from '@/features/notebook/components/ContentNotebook';

type NotebookPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function NotebookPage({ params }: NotebookPageProps) {
    await requireAuth();
    const { id } = await params;

    return <ContentNotebook id={id} />;
}


