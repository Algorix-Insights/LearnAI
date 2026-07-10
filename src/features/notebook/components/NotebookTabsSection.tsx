import { BrowserTabs } from '@/components/browser-tabs';

type NotebookTabsSectionProps = {
    notebookTitle: string;
};

export default function NotebookTabsSection({ notebookTitle }: NotebookTabsSectionProps) {
    return (
        <section className="flex h-16 items-end border-b border-[rgba(116,82,245,0.12)] bg-white px-4 sm:px-6">
            <BrowserTabs notebookTitle={notebookTitle} />
        </section>
    );
}