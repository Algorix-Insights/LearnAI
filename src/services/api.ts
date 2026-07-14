import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';

import { AUTH_UNAUTHORIZED_EVENT } from '@/lib/auth';
import { clearAuthSession, getAccessToken } from '@/lib/auth-client';

const configuredApiUrl = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://learnaiapi.algorixinsights.com'
).replace(/\/+$/, '');

export const API_BASE_URL = configuredApiUrl.endsWith('/api/v1')
  ? configuredApiUrl
  : `${configuredApiUrl}/api/v1`;

export const API_UPLOAD_TIMEOUT_MS = 120_000;
export const API_AI_TIMEOUT_MS = 180_000;
const DEFAULT_RATE_LIMIT_RETRY_SECONDS = 60;
const DEFAULT_AI_RATE_LIMIT_RETRY_SECONDS = 3_600;

export type ApiValidationError = {
  field: string;
  type: string;
};

type ApiErrorPayload = {
  detail?: string;
  errors?: ApiValidationError[];
};

const PUBLIC_AUTH_PATHS = new Set([
  '/auth/register',
  '/auth/login',
  '/auth/otp',
  '/auth/verify-otp',
  '/auth/forgot-password',
]);

export class ApiClientError extends Error {
  readonly status: number | null;
  readonly validationErrors: ApiValidationError[];
  readonly retryAfterSeconds: number | null;

  constructor({
    message,
    status = null,
    validationErrors = [],
    retryAfterSeconds = null,
  }: {
    message: string;
    status?: number | null;
    validationErrors?: ApiValidationError[];
    retryAfterSeconds?: number | null;
  }) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.validationErrors = validationErrors;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function clearExpiredAuthSession() {
  if (typeof document === 'undefined') return;

  clearAuthSession();
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
}

function isPublicAuthRequest(error: unknown) {
  if (!axios.isAxiosError(error)) return false;
  const requestPath = error.config?.url?.split('?')[0];
  return requestPath ? PUBLIC_AUTH_PATHS.has(requestPath) : false;
}

function getRequestBearerToken(error: unknown) {
  if (!axios.isAxiosError(error)) return null;

  const headers = error.config?.headers as
    | {
        get?: (name: string) => unknown;
        Authorization?: unknown;
        authorization?: unknown;
      }
    | undefined;
  const value =
    (typeof headers?.get === 'function'
      ? headers.get('Authorization')
      : undefined) ??
    headers?.Authorization ??
    headers?.authorization;

  if (typeof value !== 'string') return null;
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function requestUsesCurrentSession(error: unknown) {
  const requestToken = getRequestBearerToken(error);
  const currentToken = getAccessToken();
  return Boolean(requestToken && currentToken && requestToken === currentToken);
}

function parseRetryAfter(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.ceil(value));
  }

  if (typeof value !== 'string' || !value.trim()) return null;

  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, Math.ceil(seconds));

  const retryDate = Date.parse(value);
  if (Number.isNaN(retryDate)) return null;

  return Math.max(0, Math.ceil((retryDate - Date.now()) / 1000));
}

export function toApiClientError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) return error;

  if (!axios.isAxiosError<ApiErrorPayload>(error)) {
    return new ApiClientError({ message: 'Ocurrió un error inesperado.' });
  }

  const axiosError = error as AxiosError<ApiErrorPayload>;
  const status = axiosError.response?.status ?? null;
  const payload = axiosError.response?.data;
  const parsedRetryAfterSeconds = parseRetryAfter(
    axiosError.response?.headers?.['retry-after'],
  );
  const isAiRateLimit =
    status === 429 &&
    /(?:operaciones|recursos) de ia/i.test(payload?.detail ?? '');
  // Some CORS deployments omit Retry-After from exposed response headers.
  // Keep the UI from entering an immediate retry loop even in that case.
  const retryAfterSeconds =
    parsedRetryAfterSeconds ??
    (status === 429
      ? isAiRateLimit
        ? DEFAULT_AI_RATE_LIMIT_RETRY_SECONDS
        : DEFAULT_RATE_LIMIT_RETRY_SECONDS
      : null);

  let message = payload?.detail;
  if (!message && axiosError.code === 'ECONNABORTED') {
    message = 'La API tardó demasiado en responder.';
  }
  if (!message && !axiosError.response) {
    message = 'No fue posible conectar con la API.';
  }

  return new ApiClientError({
    message: message || 'La solicitud no pudo completarse.',
    status,
    validationErrors: payload?.errors ?? [],
    retryAfterSeconds,
  });
}

export function unwrapData<T>(payload: { data: T } | T): T {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiClientError(error);

    if (
      apiError.status === 401 &&
      !isPublicAuthRequest(error) &&
      requestUsesCurrentSession(error)
    ) {
      clearExpiredAuthSession();
    }

    return Promise.reject(apiError);
  },
);
