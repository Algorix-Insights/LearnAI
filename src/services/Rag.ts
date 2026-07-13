import {
  API_AI_TIMEOUT_MS,
  API_UPLOAD_TIMEOUT_MS,
  api,
  unwrapData,
} from '@/services/api';
import type {
  ChatResponse,
  Conversation,
  ConversationCreatePayload,
  ConversationListResponse,
  ConversationResponse,
  Document,
  DocumentListResponse,
  DocumentResponse,
  DocumentUploadResult,
  DocumentUploadPayload,
  DocumentUploadResponse,
  FlashcardGenerationPayload,
  FlashcardGenerationResponse,
  FlashcardListResponse,
  MessageListResponse,
  PaginationParams,
  SendMessagePayload,
  UUID,
} from '@/services/contracts';

const notebookPath = (notebookId: UUID) => `/notebooks/${notebookId}`;
const conversationPath = (conversationId: UUID) =>
  `/conversations/${conversationId}`;

export const RagService = {
  listDocuments: async (
    pagination: PaginationParams = {},
  ): Promise<DocumentListResponse> => {
    const response = await api.get<DocumentListResponse>('/documents', {
      params: pagination,
    });

    return response.data;
  },

  getDocument: async (documentId: UUID): Promise<Document> => {
    const response = await api.get<DocumentResponse>(`/documents/${documentId}`);
    return unwrapData(response.data);
  },

  uploadDocument: async (
    notebookId: UUID,
    payload: DocumentUploadPayload,
  ): Promise<DocumentUploadResult> => {
    const formData = new FormData();
    formData.append('file', payload.file);

    if (payload.description !== undefined) {
      formData.append('description', payload.description);
    }

    const response = await api.post<DocumentUploadResponse>(
      `${notebookPath(notebookId)}/documents/upload`,
      formData,
      { timeout: API_UPLOAD_TIMEOUT_MS },
    );

    return unwrapData(response.data);
  },

  deleteDocument: async (
    notebookId: UUID,
    documentId: UUID,
  ): Promise<Document> => {
    const response = await api.delete<DocumentResponse>(
      `${notebookPath(notebookId)}/documents/${documentId}`,
    );

    return unwrapData(response.data);
  },

  createConversation: async (
    notebookId: UUID,
    payload: ConversationCreatePayload = {},
  ): Promise<Conversation> => {
    const response = await api.post<ConversationResponse>(
      `${notebookPath(notebookId)}/conversations`,
      payload,
    );

    return unwrapData(response.data);
  },

  listConversations: async (
    notebookId: UUID,
    pagination: PaginationParams = {},
  ): Promise<ConversationListResponse> => {
    const response = await api.get<ConversationListResponse>(
      `${notebookPath(notebookId)}/conversations`,
      { params: pagination },
    );

    return response.data;
  },

  listMessages: async (
    conversationId: UUID,
    pagination: PaginationParams = {},
  ): Promise<MessageListResponse> => {
    const response = await api.get<MessageListResponse>(
      `${conversationPath(conversationId)}/messages`,
      { params: pagination },
    );

    return response.data;
  },

  sendMessage: async (
    conversationId: UUID,
    payload: SendMessagePayload,
  ): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>(
      `${conversationPath(conversationId)}/messages`,
      payload,
      { timeout: API_AI_TIMEOUT_MS },
    );

    return response.data;
  },

  generateFlashcards: async (
    notebookId: UUID,
    payload: FlashcardGenerationPayload = {},
  ): Promise<FlashcardGenerationResponse> => {
    const response = await api.post<FlashcardGenerationResponse>(
      `${notebookPath(notebookId)}/flashcards/generate`,
      payload,
      { timeout: API_AI_TIMEOUT_MS },
    );

    return response.data;
  },

  listFlashcards: async (
    notebookId: UUID,
    pagination: PaginationParams = {},
  ): Promise<FlashcardListResponse> => {
    const response = await api.get<FlashcardListResponse>(
      `${notebookPath(notebookId)}/flashcards`,
      { params: pagination },
    );

    return response.data;
  },
};

export const ragService = RagService;
