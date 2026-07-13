import { api, unwrapData } from '@/services/api';
import type {
  CreateLearningEventPayload,
  LearningEvent,
  LearningEventResponse,
  UserStatistics,
  UserStatisticsParams,
  UserStatisticsResponse,
} from '@/services/contracts';

const statisticsRoute = '/users/me/statistics';
const learningEventsRoute = '/users/me/learning-events';

async function getStatistics(
  params: UserStatisticsParams = {},
): Promise<UserStatistics> {
  const response = await api.get<UserStatisticsResponse>(statisticsRoute, {
    params,
  });
  return unwrapData(response.data);
}

async function recordLearningEvent(
  payload: CreateLearningEventPayload,
  idempotencyKey: string,
): Promise<LearningEvent> {
  const response = await api.post<LearningEventResponse>(
    learningEventsRoute,
    payload,
    { headers: { 'Idempotency-Key': idempotencyKey } },
  );
  return unwrapData(response.data);
}

export const StatisticsService = {
  get: getStatistics,
  getStatistics,
  getUserStatistics: getStatistics,
  recordLearningEvent,
  createLearningEvent: recordLearningEvent,
};

export const statisticsService = StatisticsService;
