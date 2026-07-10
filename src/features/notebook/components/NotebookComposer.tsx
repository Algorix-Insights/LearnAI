import { ChevronDown, ChevronRight, FileText } from 'lucide-react';

import { Button } from '@/components/Button';

export default function NotebookComposer() {
    return (
        <div className="mt-6 w-full rounded-2xl border border-[rgba(116,82,245,0.28)] bg-white p-3 sm:p-4">
            <textarea
                aria-label="Escribe algo"
                placeholder="Escribe algo..."
                className="min-h-[72px] w-full resize-none rounded-xl border-0 bg-transparent px-1 py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
                <Button variant="pageComposerTrigger" size="auto" className="px-2.5 py-1 text-xs" type="button">
                    <FileText className="size-3.5" />
                    <span>4 Fuentes</span>
                    <ChevronDown className="size-3.5" />
                </Button>

                <Button variant="pageAccent" size="icon" type="button">
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}