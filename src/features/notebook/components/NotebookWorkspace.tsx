'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AppRouteLoading } from '@/components/AppRouteLoading';
import { useAuth } from '@/features/auth/AuthProvider';
import { useCountdown } from '@/hooks/use-countdown';
import { ExamService } from '@/services/Exam';
import { NotebookService } from '@/services/Notebook';
import { RagService } from '@/services/Rag';
import { ApiClientError } from '@/services/api';
import type { MessageListResponse, RagSource } from '@/services/contracts';

import NotebookHeader from './NotebookHeader';
import NotebookTabsSection from './NotebookTabsSection';
import NotebookWelcomeSection from './NotebookWelcomeSection';
import SidebarLeft from './SidebarLeft';

const quickActions = ['Flashcards', 'Examen V/F', 'Opción múltiple', 'Preguntas abiertas'];

type ChatSubmission = {
  content: string;
  conversationId: string | null;
  clientMessageId: string;
  submittedAt: string;
};

type RetryableChatSubmission = Pick<ChatSubmission, 'content' | 'conversationId'>;

async function listConversationMessages(conversationId: string): Promise<MessageListResponse> {
  const limit = 100;
  const maxMessages = 1000;
  const messages: MessageListResponse['data'] = [];
  let offset = 0;

  while (offset < maxMessages) {
    const page = await RagService.listMessages(conversationId, { limit, offset });
    messages.push(...page.data);
    if (page.data.length < limit) break;
    offset += limit;
  }

  return { data: messages, limit, offset: 0 };
}

export default function NotebookWorkspace({ notebookId }: { notebookId: string }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<ChatSubmission | null>(null);
  const [retryableMessage, setRetryableMessage] = useState<RetryableChatSubmission | null>(null);
  const [failedConversationId, setFailedConversationId] = useState<string | null>(null);
  const [sourcesByMessage, setSourcesByMessage] = useState<Record<string, RagSource[]>>({});
  const mutationConversationIdRef = useRef<string | null>(null);
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
  const documents = documentsQuery.data?.data ?? [];
  const hasProcessedSources = documents.some((document) => document.processing_status === 'completed');
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
    queryFn: () => listConversationMessages(activeConversationId as string),
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
    mutationFn: async (submission: ChatSubmission) => {
      let conversationId = submission.conversationId;
      if (!conversationId) {
        const conversation = await RagService.createConversation(notebookId, {
          name: submission.content.slice(0, 80),
        });
        if (!conversation.conversation_id) {
          throw new Error('La API no devolvió el identificador de la conversación.');
        }
        conversationId = conversation.conversation_id;
        setActiveConversationId(conversationId);
        setPendingMessage((current) => current?.clientMessageId === submission.clientMessageId
          ? { ...current, conversationId }
          : current);
      }
      mutationConversationIdRef.current = conversationId;
      return RagService.sendMessage(conversationId, { content: submission.content });
    },
    onSuccess: (response, submission) => {
      const conversationId = response.data.conversation_id ?? mutationConversationIdRef.current;
      if (response.data.message_id && response.sources.length > 0) {
        setSourcesByMessage((current) => ({
          ...current,
          [response.data.message_id as string]: response.sources,
        }));
      }
      if (conversationId) {
        queryClient.setQueryData<MessageListResponse>(
          ['conversations', conversationId, 'messages'],
          (current) => {
            const existing = current?.data ?? [];
            if (response.data.message_id && existing.some((message) => message.message_id === response.data.message_id)) return current;

            const maxOrder = existing.reduce((maximum, message) => Math.max(maximum, message.order_message ?? 0), 0);
            const assistantOrder = response.data.order_message ?? maxOrder + 2;
            const userOrder = Math.max(assistantOrder - 1, 1);
            const hasPersistedUser = existing.some((message) => (
              message.role === 'user'
              && message.order_message === userOrder
            ));
            const userMessage = {
              message_id: submission.clientMessageId,
              conversation_id: conversationId,
              role: 'user' as const,
              content: submission.content,
              order_message: userOrder,
              created_at: submission.submittedAt,
            };
            const data = [
              ...existing,
              ...(hasPersistedUser ? [] : [userMessage]),
              response.data,
            ].sort((left, right) => (left.order_message ?? Number.MAX_SAFE_INTEGER) - (right.order_message ?? Number.MAX_SAFE_INTEGER));

            return {
              data,
              limit: current?.limit ?? 100,
              offset: current?.offset ?? 0,
            };
          },
        );
      }
      setRetryableMessage(null);
      setFailedConversationId(null);
      setPendingMessage(null);
    },
    onError: (error, submission) => {
      const conversationId = mutationConversationIdRef.current;
      const canSafelyRetry = mutationConversationIdRef.current === null
        || (error instanceof ApiClientError && error.status === 429);
      setRetryableMessage(canSafelyRetry ? { content: submission.content, conversationId } : null);
      setFailedConversationId(conversationId);
      if (error instanceof ApiClientError && error.retryAfterSeconds) {
        chatCooldown.start(error.retryAfterSeconds);
      }
    },
    onSettled: async (_response, error) => {
      const conversationId = mutationConversationIdRef.current;
      const requests = [
        queryClient.invalidateQueries({ queryKey: ['notebooks', notebookId, 'conversations'] }),
      ];
      if (error && conversationId && !(error instanceof ApiClientError && error.status === 429)) {
        requests.push(queryClient.invalidateQueries({ queryKey: ['conversations', conversationId, 'messages'] }));
      }
      await Promise.all(requests);
      if (error) setPendingMessage(null);
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
    return <AppRouteLoading label="Cargando cuaderno" variant="notebook" />;
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

  const pendingMessageForActiveConversation = pendingMessage?.conversationId === activeConversationId
    ? pendingMessage.content
    : null;
  const isSendingActiveConversation = sendMessage.isPending
    && pendingMessage?.conversationId === activeConversationId;
  const activeRetryableMessage = retryableMessage?.conversationId === activeConversationId
    ? retryableMessage
    : null;
  const sendErrorForActiveConversation = sendMessage.isError
    && failedConversationId === activeConversationId
    ? sendMessage.error
    : null;
  const chatError = sendErrorForActiveConversation ?? messagesQuery.error ?? conversationsQuery.error ?? createConversation.error;
  const interactionError = chatError ?? generateResource.error;
  const handleSend = (content: string, conversationId: string | null = activeConversationId) => {
    if (!hasProcessedSources) {
      setNotice('Sube y procesa una fuente antes de iniciar el chat.');
      return;
    }
    const submission: ChatSubmission = {
      content,
      conversationId,
      clientMessageId: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    setNotice(null);
    setRetryableMessage(null);
    setFailedConversationId(null);
    setPendingMessage(submission);
    mutationConversationIdRef.current = null;
    sendMessage.reset();
    sendMessage.mutate(submission);
  };
  const retryChat = () => {
    if (activeRetryableMessage) {
      handleSend(activeRetryableMessage.content, activeRetryableMessage.conversationId);
      return;
    }
    if (sendMessage.isError || messagesQuery.isError) {
      sendMessage.reset();
      void messagesQuery.refetch();
      return;
    }
    if (conversationsQuery.isError) {
      void conversationsQuery.refetch();
      return;
    }
    if (createConversation.isError) createConversation.mutate('Nueva conversación');
  };

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
            sourcesByMessage={sourcesByMessage}
            pendingMessage={pendingMessageForActiveConversation}
            sourceCount={documents.length}
            isLoadingMessages={Boolean(activeConversationId) && messagesQuery.isPending}
            isSending={isSendingActiveConversation}
            isSendDisabled={sendMessage.isPending || chatCooldown.isActive || !hasProcessedSources}
            sendDisabledReason={documentsQuery.isPending
              ? 'Comprobando fuentes…'
              : !hasProcessedSources
                ? 'Sube y procesa una fuente para habilitar el chat.'
                : chatCooldown.isActive
                  ? `Chat disponible en ${chatCooldown.remainingSeconds}s.`
                : sendMessage.isPending && !isSendingActiveConversation
                  ? 'LearnAI está respondiendo en otra conversación.'
                : undefined}
            hasProcessedSources={hasProcessedSources}
            isLoadingSources={documentsQuery.isPending}
            isGenerating={generateResource.isPending || generationCooldown.isActive}
            error={interactionError instanceof Error
              ? `${interactionError.message}${sendErrorForActiveConversation && !activeRetryableMessage
                ? ' Tu pregunta puede haberse guardado; actualiza la conversación antes de volver a enviarla.'
                : ''}${chatCooldown.isActive || generationCooldown.isActive
                ? ` Intenta de nuevo en ${Math.max(chatCooldown.remainingSeconds, generationCooldown.remainingSeconds)}s.`
                : ''}`
              : null}
            statusMessage={notice}
            onSend={handleSend}
            onRetry={chatError ? retryChat : undefined}
            retryLabel={activeRetryableMessage ? 'Reintentar pregunta' : sendErrorForActiveConversation ? 'Actualizar conversación' : 'Reintentar'}
            canRetry={!chatCooldown.isActive}
            onQuickAction={(action) => generateResource.mutate(action)}
          />
        </main>
      </div>
    </div>
  );
}
