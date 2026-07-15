import { API_AI_TIMEOUT_MS, api, unwrapData } from '@/services/api';
import type {
  AttemptResult,
  AttemptSession,
  AttemptSessionResponse,
  ExamGenerationPayload,
  ExamGenerationResponse,
  ExamListResponse,
  FinishedAttemptResponse,
  PaginationParams,
  SavedAttemptAnswer,
  SavedAttemptAnswerResponse,
  SubmitAttemptAnswerPayload,
  UUID,
} from '@/services/contracts';

const notebookPath = (notebookId: UUID) => `/notebooks/${notebookId}`;
const attemptPath = (attemptId: UUID) => `/attempts/${attemptId}`;

export const ExamService = {
  listExams: async (
    notebookId: UUID,
    pagination: PaginationParams = {},
  ): Promise<ExamListResponse> => {
    const response = await api.get<ExamListResponse>('/exams', {
      params: { ...pagination, notebook_id: notebookId },
    });

    return response.data;
  },

  generateExam: async (
    notebookId: UUID,
    payload: ExamGenerationPayload = {},
  ): Promise<ExamGenerationResponse> => {
    const response = await api.post<ExamGenerationResponse>(
      `/notebooks/${notebookId}/exams/generate`,
      payload,
      { timeout: API_AI_TIMEOUT_MS },
    );

    return response.data;
  },

  startAttempt: async (examId: UUID): Promise<AttemptSession> => {
    const response = await api.post<AttemptSessionResponse>(
      `/exams/${examId}/attempts`,
      {},
    );

    return unwrapData(response.data);
  },

  getAttempt: async (attemptId: UUID): Promise<AttemptSession> => {
    const response = await api.get<AttemptSessionResponse>(
      attemptPath(attemptId),
    );

    return unwrapData(response.data);
  },

  submitAnswer: async (
    attemptId: UUID,
    questionId: UUID,
    payload: SubmitAttemptAnswerPayload,
  ): Promise<SavedAttemptAnswer> => {
    const response = await api.put<SavedAttemptAnswerResponse>(
      `${attemptPath(attemptId)}/answers/${questionId}`,
      payload,
    );

    return unwrapData(response.data);
  },

  finishAttempt: async (attemptId: UUID): Promise<AttemptResult> => {
    const response = await api.post<FinishedAttemptResponse>(
      `${attemptPath(attemptId)}/finish`,
      {},
      { timeout: API_AI_TIMEOUT_MS },
    );

    return unwrapData(response.data);
  },
};

export const examService = ExamService;
