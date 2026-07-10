import { CollapsibleCard } from '@/components/CollapsibleCard';
import { Sparkles } from 'lucide-react';

export default function SummaryCard() {
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
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed
                </p>
            }
        />  
    );
}