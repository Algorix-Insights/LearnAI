import { BrowserTabs } from '@/components/browser-tabs';
import type { Conversation } from '@/services/contracts';

type NotebookTabsSectionProps = {
    notebookTitle: string;
    conversations: Conversation[];
    activeId: string | null;
    onSelect: (conversationId: string) => void;
    onCreate: () => void;
};

export default function NotebookTabsSection(props: NotebookTabsSectionProps) {
    return (
        <section className="flex h-16 items-end border-b border-[rgba(116,82,245,0.12)] bg-white px-4 sm:px-6">
            <BrowserTabs {...props} />
        </section>
    );
}
