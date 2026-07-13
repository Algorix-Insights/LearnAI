import { api, unwrapData } from '@/services/api';
import type {
  AuthForgotPasswordPayload,
  AuthLoginPayload,
  AuthMessage,
  AuthMessageResponse,
  AuthOtpPayload,
  AuthRegisterPayload,
  AuthResponse,
  AuthSession,
  AuthUpdatePasswordPayload,
  AuthVerifyOtpPayload,
  User,
  UserResponse,
} from '@/services/contracts';

const route = '/auth';

export const AuthService = {
  register: async (payload: AuthRegisterPayload): Promise<AuthSession> => {
    const response = await api.post<AuthResponse>(`${route}/register`, payload);
    return unwrapData(response.data);
  },

  login: async (payload: AuthLoginPayload): Promise<AuthSession> => {
    const response = await api.post<AuthResponse>(`${route}/login`, payload);
    return unwrapData(response.data);
  },

  sendOtp: async (payload: AuthOtpPayload): Promise<AuthMessage> => {
    const response = await api.post<AuthMessageResponse>(`${route}/otp`, payload);
    return unwrapData(response.data);
  },

  verifyOtp: async (payload: AuthVerifyOtpPayload): Promise<AuthSession> => {
    const response = await api.post<AuthResponse>(`${route}/verify-otp`, payload);
    return unwrapData(response.data);
  },

  forgotPassword: async (
    payload: AuthForgotPasswordPayload,
  ): Promise<AuthMessage> => {
    const response = await api.post<AuthMessageResponse>(
      `${route}/forgot-password`,
      payload,
    );
    return unwrapData(response.data);
  },

  resetPassword: async (
    payload: AuthUpdatePasswordPayload,
  ): Promise<AuthMessage> => {
    const response = await api.post<AuthMessageResponse>(
      `${route}/reset-password`,
      payload,
    );
    return unwrapData(response.data);
  },

  logout: async (): Promise<AuthMessage> => {
    const response = await api.post<AuthMessageResponse>(`${route}/logout`);
    return unwrapData(response.data);
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<UserResponse>(`${route}/me`);
    return unwrapData(response.data);
  },
};
