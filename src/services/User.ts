import { API_UPLOAD_TIMEOUT_MS, api, unwrapData } from '@/services/api';
import type {
  ProfilePhoto,
  ProfilePhotoDeleteResponse,
  ProfilePhotoResponse,
  ProfilePhotoUploadPayload,
  UpdateUserProfilePayload,
  User,
  UserResponse,
} from '@/services/contracts';

const route = '/users/me';

async function getProfile(): Promise<User> {
  const response = await api.get<UserResponse>(route);
  return unwrapData(response.data);
}

async function updateProfile(payload: UpdateUserProfilePayload): Promise<User> {
  const response = await api.patch<UserResponse>(route, payload);
  return unwrapData(response.data);
}

async function uploadProfilePhoto(
  payload: ProfilePhotoUploadPayload | File,
): Promise<ProfilePhoto> {
  const file = 'file' in payload ? payload.file : payload;
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ProfilePhotoResponse>(
    `${route}/profile-photo`,
    formData,
    {
      timeout: API_UPLOAD_TIMEOUT_MS,
    },
  );

  return unwrapData(response.data);
}

async function getProfilePhoto(): Promise<ProfilePhoto> {
  const response = await api.get<ProfilePhotoResponse>(`${route}/profile-photo`);
  return unwrapData(response.data);
}

async function deleteProfilePhoto(): Promise<ProfilePhotoDeleteResponse> {
  const response = await api.delete<ProfilePhotoDeleteResponse>(
    `${route}/profile-photo`,
  );
  return unwrapData(response.data);
}

export const UserService = {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  getProfilePhoto,
  deleteProfilePhoto,
  getMe: getProfile,
  updateMe: updateProfile,
  uploadPhoto: uploadProfilePhoto,
  getPhoto: getProfilePhoto,
  deletePhoto: deleteProfilePhoto,
};

export const userService = UserService;
