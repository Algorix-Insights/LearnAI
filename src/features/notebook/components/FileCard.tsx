import type { ReactNode } from 'react';
import { NotebookPen } from 'lucide-react';

type FileCardProps = {
    title: string;
    description: string;
    icon?: ReactNode;
    action?: ReactNode;
};

export default function FileCard({ title, description, icon = <NotebookPen className="size-3.5" />, action }: FileCardProps) {
    return (
        <article className="flex items-center gap-2.5 rounded-xl px-1 py-1.5">
            <div className="grid size-5 place-items-center rounded-md bg-[linear-gradient(135deg,rgba(116,82,245,0.2),rgba(119,234,222,0.3))] text-[color:var(--app-primary)]">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-slate-500">{title}</p>
                <p className="text-[10px] text-slate-400">{description}</p>
            </div>
            {action}
        </article>
    );
}