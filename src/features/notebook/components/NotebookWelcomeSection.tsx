import { Sparkles } from 'lucide-react';

import NotebookComposer from './NotebookComposer';
import NotebookQuickActions from './NotebookQuickActions';

type NotebookWelcomeSectionProps = {
    actions: string[];
};

export default function NotebookWelcomeSection({ actions }: NotebookWelcomeSectionProps) {
    return (
        <section className="flex flex-1 min-h-0 items-center justify-center px-4 sm:px-6">
            <div className="flex w-full max-w-[980px] flex-col items-center text-center">
                <Sparkles className="mb-5 size-7 text-[color:var(--app-primary)]" />

                <h2 className="max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
                    <span className="bg-gradient-to-r from-[#23D7C2] via-[#5AA4F6] to-[#7452F5] bg-clip-text text-transparent">
                        Bienvenido de Nuevo, Tim
                    </span>
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                    Continuemos aprendiendo juntos. La mejor forma de aprender es estudiando
                </p>

                <NotebookComposer />
                <NotebookQuickActions actions={actions} />
            </div>
        </section>
    );
}