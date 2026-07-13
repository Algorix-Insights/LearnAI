import { SignUpFormData } from '@/features/auth/signUpSchema';
import { api } from '@/services/api';

type RegisterData = Omit<SignUpFormData, 'repeatPassword'>;
type SendOtpData = {
    email: string;
    shouldCreateUser?: boolean;
};

function unwrapResponse<T>(payload: { data?: T } | T) {
    return (payload as { data?: T }).data ?? payload;
}

const route = '/auth';

export const AuthService = {
    register: async (data: RegisterData) => {
        const { name, lastname: last_name, email, password } = data;
        const response = await api.post(`${route}/register`, { name, last_name, email, password });
        return unwrapResponse(response.data);
    },
    login: async ({email, password}: {email: string, password: string}) => {
        const response = await api.post(`${route}/login`, { email, password });
        return unwrapResponse(response.data);
    },
    sendOtp: async ({ email, shouldCreateUser = false }: SendOtpData) => {
        const response = await api.post(`${route}/otp`, { email, should_create_user: shouldCreateUser });
        return unwrapResponse(response.data);
    },
    verifyOtp: async ({email, token}: {email: string, token: string}) => {
        const response = await api.post(`${route}/verify-otp`, { email, token });
        return unwrapResponse(response.data);
    }
};

// register response 200: 
// {
//   "data": {
//     "access_token": "string",
//     "refresh_token": "string",
//     "token_type": "bearer",
//     "expires_in": 0,
//     "user": {
//       "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       "name": "string",
//       "last_name": "string",
//       "email": "string",
//       "streak": 0,
//       "status": "string",
//       "profile_image_path": "string",
//       "profile_image_mime_type": "string",
//       "profile_image_size_bytes": 0,
//       "created_at": "2026-07-12T06:46:31.727Z",
//       "updated_at": "2026-07-12T06:46:31.727Z",
//       "last_login": "2026-07-12T06:46:31.727Z",
//       "additionalProp1": {}
//     },
//     "message": "string",
//     "additionalProp1": {}
//   }
// }

// login response 200:
// {
//   "data": {
//     "access_token": "string",
//     "refresh_token": "string",
//     "token_type": "bearer",
//     "expires_in": 0,
//     "user": {
//       "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       "name": "string",
//       "last_name": "string",
//       "email": "string",
//       "streak": 0,
//       "status": "string",
//       "profile_image_path": "string",
//       "profile_image_mime_type": "string",
//       "profile_image_size_bytes": 0,
//       "created_at": "2026-07-12T06:46:31.740Z",
//       "updated_at": "2026-07-12T06:46:31.740Z",
//       "last_login": "2026-07-12T06:46:31.740Z",
//       "additionalProp1": {}
//     },
//     "message": "string",
//     "additionalProp1": {}
//   }
// }

// sendOtp response 200:
// {
//   "data": {
//     "message": "string",
//     "additionalProp1": {}
//   }
// }

// verifyOtp response 200:
// {
//   "data": {
//     "access_token": "string",
//     "refresh_token": "string",
//     "token_type": "bearer",
//     "expires_in": 0,
//     "user": {
//       "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       "name": "string",
//       "last_name": "string",
//       "email": "string",
//       "streak": 0,
//       "status": "string",
//       "profile_image_path": "string",
//       "profile_image_mime_type": "string",
//       "profile_image_size_bytes": 0,
//       "created_at": "2026-07-12T06:46:31.747Z",
//       "updated_at": "2026-07-12T06:46:31.747Z",
//       "last_login": "2026-07-12T06:46:31.747Z",
//       "additionalProp1": {}
//     },
//     "message": "string",
//     "additionalProp1": {}
//   }
// }