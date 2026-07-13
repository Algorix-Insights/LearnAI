'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import { useCountdown } from '@/hooks/use-countdown';
import { ExamService } from '@/services/Exam';
import { NotebookService } from '@/services/Notebook';
import { RagService } from '@/services/Rag';
import { ApiClientError } from '@/services/api';

import NotebookHeader from './NotebookHeader';
import NotebookTabsSection from './NotebookTabsSection';
import NotebookWelcomeSection from './NotebookWelcomeSection';
import SidebarLeft from './SidebarLeft';

const quickActions = ['Flashcards', 'Examen V/F', 'Opción múltiple', 'Preguntas abiertas'];

export default function NotebookWorkspace({ notebookId }: { notebookId: string }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const chatCooldown = useCountdown();
  const generationCooldown = useCountdown();
  const notebookQuery = useQuery({
    queryKey: ['notebooks', notebookId],
    queryFn: () => NotebookService.get(notebookId),
  });
  const documentsQuery = useQuery({
    queryKey: ['notebooks', notebookId, 'documents'],
    queryFn: () => RagService.listDocuments(notebookId, { limit: 100, offset: 0 }),
  });
  const conversationsQuery = useQuery({
    queryKey: ['notebooks', notebookId, 'conversations'],
    queryFn: () => RagService.listConversations(notebookId, { limit: 20, offset: 0 }),
  });
  const conversations = conversationsQuery.data?.data ?? [];
  const firstConversationId = conversations.find(
    (conversation) => conversation.conversation_id,
  )?.conversation_id;

  useEffect(() => {
    if (!activeConversationId && firstConversationId) {
      setActiveConversationId(firstConversationId);
    }
  }, [activeConversationId, firstConversationId]);

  const messagesQuery = useQuery({
    queryKey: ['conversations', activeConversationId, 'messages'],
    queryFn: () => RagService.listMessages(activeConversationId as string, { limit: 50, offset: 0 }),
    enabled: Boolean(activeConversationId),
  });
  const createConversation = useMutation({
    mutationFn: (name: string = 'Nueva conversación') => RagService.createConversation(notebookId, { name }),
    onSuccess: async (conversation) => {
      if (conversation.conversation_id) setActiveConversationId(conversation.conversation_id);
      await queryClient.invalidateQueries({ queryKey: ['notebooks', notebookId, 'conversations'] });
    },
  });
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      let conversationId = activeConversationId;
      if (!conversationId) {
        const conversation = await RagService.createConversation(notebookId, {
          name: content.slice(0, 80),
        });
        if (!conversation.conversation_id) {
          throw new Error('La API no devolvió el identificador de la conversación.');
        }
        conversationId = conversation.conversation_id;
        setActiveConversationId(conversationId);
      }
      await RagService.sendMessage(conversationId, { content });
      return conversationId;
    },
    onSuccess: async (conversationId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['notebooks', notebookId, 'conversations'] }),
        queryClient.invalidateQueries({ queryKey: ['conversations', conversationId, 'messages'] }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.retryAfterSeconds) {
        chatCooldown.start(error.retryAfterSeconds);
      }
    },
  });
  const updateNotebook = useMutation({
    mutationFn: (name: string) => NotebookService.update(notebookId, { name }),
    onSuccess: (notebook) => {
      queryClient.setQueryData(['notebooks', notebookId], notebook);
      void queryClient.invalidateQueries({ queryKey: ['notebooks'] });
    },
  });
  const generateResource = useMutation({
    mutationFn: async (action: string) => {
      if (action === 'Flashcards') {
        const result = await RagService.generateFlashcards(notebookId, { count: 10 });
        return `${result.data.length} flashcards generadas.`;
      }

      const payload = action === 'Examen V/F'
        ? { true_false_count: 10, multiple_choice_count: 0, open_count: 0 }
        : action === 'Opción múltiple'
          ? { true_false_count: 0, multiple_choice_count: 10, open_count: 0 }
          : { true_false_count: 0, multiple_choice_count: 0, open_count: 10 };
      const result = await ExamService.generateExam(notebookId, payload);
      return `Examen “${result.data.name}” generado correctamente.`;
    },
    onSuccess: async (message) => {
      setNotice(message);
      await queryClient.invalidateQueries({ queryKey: ['notebooks', notebookId, 'flashcards'] });
    },
    onError: (error) => {
      setNotice(null);
      if (error instanceof ApiClientError && error.retryAfterSeconds) {
        generationCooldown.start(error.retryAfterSeconds);
      }
    },
  });

  if (notebookQuery.isPending) {
    return <div className="grid h-screen place-items-center text-sm text-slate-500" role="status">Cargando cuaderno…</div>;
  }

  if (notebookQuery.isError) {
    return (
      <div className="grid h-screen place-items-center p-6">
        <p className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700" role="alert">
          {notebookQuery.error instanceof Error ? notebookQuery.error.message : 'No fue posible abrir el cuaderno.'}
        </p>
      </div>
    );
  }

  const interactionError = sendMessage.error ?? createConversation.error ?? generateResource.error;

  return (
    <div className="h-screen overflow-hidden bg-white text-slate-800">
      <div className="grid h-full min-h-0 lg:grid-cols-[254px_minmax(0,1fr)]">
        <SidebarLeft notebookId={notebookId} notebook={notebookQuery.data} />
        <main className="flex h-full min-w-0 flex-col overflow-hidden">
          <NotebookHeader
            title={notebookQuery.data.name || 'Cuaderno sin nombre'}
            onTitleChange={(name) => updateNotebook.mutate(name)}
          />
          <NotebookTabsSection
            notebookTitle={notebookQuery.data.name || notebookId}
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={setActiveConversationId}
            onCreate={() => createConversation.mutate('Nueva conversación')}
          />
          <NotebookWelcomeSection
            actions={quickActions}
            userName={user?.name}
            messages={messagesQuery.data?.data ?? []}
            sourceCount={documentsQuery.data?.data.length ?? 0}
            isSending={sendMessage.isPending || chatCooldown.isActive}
            isGenerating={generateResource.isPending || generationCooldown.isActive}
            error={interactionError instanceof Error
              ? `${interactionError.message}${chatCooldown.isActive || generationCooldown.isActive
                ? ` Intenta de nuevo en ${Math.max(chatCooldown.remainingSeconds, generationCooldown.remainingSeconds)}s.`
                : ''}`
              : null}
            statusMessage={notice}
            onSend={(content) => sendMessage.mutate(content)}
            onQuickAction={(action) => generateResource.mutate(action)}
          />
        </main>
      </div>
    </div>
  );
}
