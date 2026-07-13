import { BrowserTabs } from '@/components/browser-tabs';
import type { Conversation } from '@/services/contracts';

type NotebookTab = {
    id: string;
    title: string;
    conversationId?: string | null;
    isDraft?: boolean;
};

type NotebookTabsSectionProps = {
    notebookTitle: string;
    tabs: NotebookTab[];
    activeTabId: string;
    historyItems: Conversation[];
    onSelectTab: (tabId: string) => void;
    onCloseTab: (tabId: string) => void;
    onAddTab: () => void;
    onSelectHistoryConversation: (conversation: Conversation) => void;
    onReorderTabs: (activeTabId: string, overTabId: string) => void;
};

export default function NotebookTabsSection({
    notebookTitle,
    tabs,
    activeTabId,
    historyItems,
    onSelectTab,
    onCloseTab,
    onAddTab,
    onSelectHistoryConversation,
    onReorderTabs,
}: NotebookTabsSectionProps) {
    return (
        <section className="flex h-16 items-end border-b border-[rgba(116,82,245,0.12)] bg-white px-4 sm:px-6">
            <BrowserTabs
                notebookTitle={notebookTitle}
                tabs={tabs}
                activeTabId={activeTabId}
                historyItems={historyItems}
                onSelectTab={onSelectTab}
                onCloseTab={onCloseTab}
                onAddTab={onAddTab}
                onSelectHistoryConversation={onSelectHistoryConversation}
                onReorderTabs={onReorderTabs}
            />
        </section>
    );
}