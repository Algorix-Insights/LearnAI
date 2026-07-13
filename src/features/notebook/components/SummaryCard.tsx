import { CollapsibleCard } from '@/components/CollapsibleCard';
import { notebookService } from '@/services/Notebook';
import { useQuery } from '@tanstack/react-query';
import { id } from 'date-fns/locale';
import { Sparkles } from 'lucide-react';

export default function SummaryCard({
    notebookId,
}: {
    notebookId: string;
}) {
    const { data: notebook } = useQuery({
        queryKey: ['notebook', notebookId],
        queryFn: () => notebookService.getNotebookById(notebookId),
    });

    const summary = notebook?.data?.summary ?? 'Sube tus archivos para crear un resumen de tu cuaderno.';

    return (
        <CollapsibleCard
            header={
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Sparkles className="size-4 text-[color:var(--app-primary)]" />
                    <span>Resumen</span>
                </div>
            }
            content={
                <p className="text-xs leading-5 text-slate-400">
                    {summary}
                </p>
            }
        />
    );
}