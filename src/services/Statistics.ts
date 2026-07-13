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
const idempotencyKeyPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{15,127}$/;

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
  if (!idempotencyKeyPattern.test(idempotencyKey)) {
    throw new TypeError(
      'Idempotency-Key debe tener entre 16 y 128 caracteres válidos.',
    );
  }

  const response = await api.post<LearningEventResponse>(
    learningEventsRoute,
    payload,
    { headers: { 'Idempotency-Key': idempotencyKey } },
  );
  return unwrapData(response.data);
}

export function createLearningEventIdempotencyKey() {
  return crypto.randomUUID();
}

export const StatisticsService = {
  get: getStatistics,
  getStatistics,
  getUserStatistics: getStatistics,
  recordLearningEvent,
  createLearningEvent: recordLearningEvent,
};

export const statisticsService = StatisticsService;
