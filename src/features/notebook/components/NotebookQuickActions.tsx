import { Button } from '@/components/Button';

type NotebookQuickActionsProps = {
    actions: string[];
};

export default function NotebookQuickActions({ actions }: NotebookQuickActionsProps) {
    return (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
            {actions.map((action) => (
                <Button key={action} variant="pageQuickAction" size="auto" className="px-4 py-2 text-sm" type="button">
                    <span className="grid size-4 place-items-center rounded-sm border border-current text-[10px] leading-none">□</span>
                    {action}
                </Button>
            ))}
        </div>
    );
}