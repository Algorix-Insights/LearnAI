import { CollapsibleCard } from '@/components/CollapsibleCard';
import { Sparkles } from 'lucide-react';

export default function SummaryCard({ summary }: { summary?: string | null }) {
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
                    {summary || 'Este cuaderno todavía no tiene resumen.'}
                </p>
            }
        />  
    );
}
