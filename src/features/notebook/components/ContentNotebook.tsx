
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { arrayMove } from '@dnd-kit/sortable';

import { SourceRagService } from '@/services/Source';
import { ragService } from '@/services/Rag';
import { notebookService } from "@/services/Notebook";
import NotebookHeader from "./NotebookHeader";
import NotebookTabsSection from "./NotebookTabsSection";
import NotebookWelcomeSection from "./NotebookWelcomeSection";
import SidebarLeft from "./SidebarLeft";
import type { Conversation, Message } from '@/services/contracts';

type ContentNotebookProps = {
    id: string;
    initialNotebook?: Awaited<ReturnType<typeof notebookService.getNotebookById>> | null;
};

const quickActions = ['Flashcards', 'Examen V/F', 'Opción multiple', 'Preguntas abiertas'];

type NotebookTab = {
    id: string;
    title: string;
    conversationId?: string | null;
    isDraft?: boolean;
};

const createDraftTab = (index: number): NotebookTab => ({
    id: `draft-${Date.now()}-${index}`,
    title: index === 0 ? 'Nuevo Chat' : `Nuevo Chat ${index + 1}`,
    isDraft: true,
});

const formatConversationTitle = (conversation: Conversation, fallbackLabel: string) =>
    conversation.name?.trim() || conversation.summary?.trim()?.slice(0, 42) || fallbackLabel;

export function ContentNotebook({ id, initialNotebook }: ContentNotebookProps) {
    const queryClient = useQueryClient();
    const hasInitializedTabs = useRef(false);
    const [tabs, setTabs] = useState<NotebookTab[]>([createDraftTab(0)]);
    const [activeTabId, setActiveTabId] = useState(tabs[0].id);
    const [composerValue, setComposerValue] = useState('');

    const { data: notebook } = useQuery({
        queryKey: ['notebook', id],
        queryFn: () => notebookService.getNotebookById(id),
        initialData: initialNotebook ?? undefined,
    });

    const { data: conversationsResponse } = useQuery({
        queryKey: ['notebook-conversations', id],
        queryFn: () => ragService.listConversations(id),
        enabled: Boolean(id),
    });

    const { data: sourcesResponse } = useQuery({
        queryKey: ['notebook-sources', id],
        queryFn: () => SourceRagService.getSourcesUploaded(id),
        enabled: Boolean(id),
    });

    const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
    const activeConversationId = activeTab?.conversationId ?? '';

    const { data: messagesResponse } = useQuery({
        queryKey: ['notebook-conversation-messages', activeConversationId],
        queryFn: () => ragService.listMessages(activeConversationId),
        enabled: Boolean(activeConversationId),
    });

    useEffect(() => {
        if (hasInitializedTabs.current || conversationsResponse === undefined) {
            return;
        }

        const serverTabs = conversationsResponse?.data?.map((conversation, index) => ({
            id: conversation.conversation_id ?? `conversation-${index}`,
            title: formatConversationTitle(conversation, `Conversación ${index + 1}`),
            conversationId: conversation.conversation_id,
        }));

        if (serverTabs?.length) {
            setTabs(serverTabs);
            setActiveTabId(serverTabs[0].id);
        }

        hasInitializedTabs.current = true;
    }, [conversationsResponse]);

    useEffect(() => {
        if (!activeTab && tabs[0]) {
            setActiveTabId(tabs[0].id);
        }
    }, [activeTab, tabs]);

    const openConversationInTab = (conversation: Conversation) => {
        const conversationId = conversation.conversation_id ?? '';

        if (!conversationId) {
            return;
        }

        const existingTab = tabs.find((tab) => tab.conversationId === conversationId);
        const title = formatConversationTitle(conversation, 'Conversación');

        if (existingTab) {
            setActiveTabId(existingTab.id);
            return;
        }

        if (tabs.length === 1 && tabs[0]?.isDraft && !tabs[0].conversationId) {
            setTabs((currentTabs) => currentTabs.map((tab) => (
                tab.id === currentTabs[0]?.id
                    ? { ...tab, title, conversationId, isDraft: false }
                    : tab
            )));
            setActiveTabId(tabs[0].id);
            return;
        }

        const nextTab: NotebookTab = {
            id: `conversation-${conversationId}-${Date.now()}`,
            title,
            conversationId,
        };

        setTabs((currentTabs) => [...currentTabs, nextTab]);
        setActiveTabId(nextTab.id);
    };

    const handleAddTab = () => {
        const nextTab = createDraftTab(tabs.length);
        setTabs((currentTabs) => [...currentTabs, nextTab]);
        setActiveTabId(nextTab.id);
    };

    const handleReorderTabs = (activeTabIdToMove: string, overTabId: string) => {
        setTabs((currentTabs) => {
            const oldIndex = currentTabs.findIndex((tab) => tab.id === activeTabIdToMove);
            const newIndex = currentTabs.findIndex((tab) => tab.id === overTabId);

            if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
                return currentTabs;
            }

            return arrayMove(currentTabs, oldIndex, newIndex);
        });
    };

    const handleCloseTab = (tabId: string) => {
        setTabs((currentTabs) => {
            if (currentTabs.length <= 1) {
                return currentTabs;
            }

            const currentIndex = currentTabs.findIndex((tab) => tab.id === tabId);
            const nextTabs = currentTabs.filter((tab) => tab.id !== tabId);

            if (tabId === activeTabId) {
                const fallbackTab = nextTabs[currentIndex] ?? nextTabs[currentIndex - 1] ?? nextTabs[0];
                setActiveTabId(fallbackTab?.id ?? nextTabs[0]?.id ?? '');
            }

            return nextTabs;
        });
    };

    const handleSelectHistoryConversation = (conversation: Conversation) => {
        openConversationInTab(conversation);
    };

    const sendMessageMutation = useMutation({
        mutationFn: async (message: string) => {
            const trimmedMessage = message.trim();

            if (!trimmedMessage) {
                throw new Error('Escribe un mensaje para continuar.');
            }

            let conversationId = activeConversationId;

            if (!conversationId) {
                const createdConversation = await ragService.createConversation(id, {
                    name: trimmedMessage.slice(0, 42) || `Chat ${tabs.length + 1}`,
                });

                conversationId = createdConversation.conversation_id ?? '';

                if (!conversationId) {
                    throw new Error('No se pudo crear la conversación.');
                }

                const createdTitle = formatConversationTitle(createdConversation, `Chat ${tabs.length + 1}`);
                setTabs((currentTabs) => currentTabs.map((tab) => (
                    tab.id === activeTabId
                        ? {
                            ...tab,
                            title: createdTitle,
                            conversationId,
                            isDraft: false,
                        }
                        : tab
                )));
            }

            const response = await ragService.sendMessage(conversationId, {
                content: trimmedMessage,
            });

            return { conversationId, response };
        },
        onSuccess: async ({ conversationId }) => {
            setComposerValue('');
            await queryClient.invalidateQueries({ queryKey: ['notebook-conversations', id] });
            if (conversationId) {
                await queryClient.invalidateQueries({ queryKey: ['notebook-conversation-messages', conversationId] });
            }
        },
    });

    const handleSendMessage = async () => {
        await sendMessageMutation.mutateAsync(composerValue);
    };

    const handleQuickAction = (action: string) => {
        setComposerValue(action);
    };

    const messages = messagesResponse?.data ?? [];
    const notebookSourcesCount = sourcesResponse?.data?.length ?? 0;

    const notebookTitle = notebook?.data?.name ?? 'Nombre del cuaderno uno';

    return (
        <div className="h-screen overflow-hidden bg-white text-slate-800">
            <div className="grid h-full min-h-0 lg:grid-cols-[254px_minmax(0,1fr)]">
                <SidebarLeft />
                <main className="flex h-full min-w-0 flex-col overflow-hidden">
                    <NotebookHeader title={notebookTitle} />
                    <NotebookTabsSection
                        notebookTitle={notebookTitle}
                        tabs={tabs}
                        activeTabId={activeTabId}
                        historyItems={conversationsResponse?.data ?? []}
                        onSelectTab={setActiveTabId}
                        onCloseTab={handleCloseTab}
                        onAddTab={handleAddTab}
                        onSelectHistoryConversation={handleSelectHistoryConversation}
                        onReorderTabs={handleReorderTabs}
                    />
                    <NotebookWelcomeSection
                        actions={quickActions}
                        messages={messages as Message[]}
                        composerValue={composerValue}
                        isSending={sendMessageMutation.isPending}
                        sourcesCount={notebookSourcesCount}
                        onComposerChange={setComposerValue}
                        onComposerSubmit={handleSendMessage}
                        onQuickActionSelect={handleQuickAction}
                    />
                </main>
            </div>
        </div>
    );
}