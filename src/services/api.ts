import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';

import { AUTH_COOKIE } from '@/lib/auth';

export const API_BASE_URL = '/backend';

export const API_UPLOAD_TIMEOUT_MS = 120_000;
export const API_AI_TIMEOUT_MS = 180_000;

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

function getAuthTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookieValue = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${AUTH_COOKIE}=`))
    ?.slice(`${AUTH_COOKIE}=`.length);

  return cookieValue ? decodeURIComponent(cookieValue) : null;
}

function clearExpiredAuthCookie() {
  if (typeof document === 'undefined') return;

  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
  window.dispatchEvent(new Event('learnai:unauthorized'));
}

function isPublicAuthRequest(error: unknown) {
  if (!axios.isAxiosError(error)) return false;
  const requestPath = error.config?.url?.split('?')[0];
  return requestPath ? PUBLIC_AUTH_PATHS.has(requestPath) : false;
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
  const retryAfterSeconds = parseRetryAfter(
    axiosError.response?.headers?.['retry-after'],
  );

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
  const token = getAuthTokenFromCookie();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiClientError(error);

    if (apiError.status === 401 && !isPublicAuthRequest(error)) {
      clearExpiredAuthCookie();
    }

    return Promise.reject(apiError);
  },
);
