import { api, unwrapData } from '@/services/api';
import type {
  AddRoomMemberPayload,
  AddRoomNotebookPayload,
  ApiEnvelope,
  CreateRoomPayload,
  PaginationParams,
  Room,
  RoomListResponse,
  RoomMember,
  RoomNotebook,
  RoomNotebookResponse,
  RoomResponse,
  UpdateRoomPayload,
} from '@/services/contracts';

const route = '/rooms';

async function list(params: PaginationParams = {}): Promise<RoomListResponse> {
  const response = await api.get<RoomListResponse>(route, { params });
  return response.data;
}

async function create(payload: CreateRoomPayload): Promise<Room> {
  const response = await api.post<RoomResponse>(route, payload);
  return unwrapData(response.data);
}

async function get(roomId: string): Promise<Room> {
  const response = await api.get<RoomResponse>(`${route}/${roomId}`);
  return unwrapData(response.data);
}

async function update(roomId: string, payload: UpdateRoomPayload): Promise<Room> {
  const response = await api.patch<RoomResponse>(`${route}/${roomId}`, payload);
  return unwrapData(response.data);
}

async function remove(roomId: string): Promise<Room> {
  const response = await api.delete<RoomResponse>(`${route}/${roomId}`);
  return unwrapData(response.data);
}

async function addMember(
  roomId: string,
  payload: AddRoomMemberPayload,
): Promise<RoomMember> {
  const response = await api.post<ApiEnvelope<RoomMember>>(
    `${route}/${roomId}/members`,
    payload,
  );
  return unwrapData(response.data);
}

async function removeMember(
  roomId: string,
  memberId: string,
): Promise<RoomMember> {
  const response = await api.delete<ApiEnvelope<RoomMember>>(
    `${route}/${roomId}/members/${memberId}`,
  );
  return unwrapData(response.data);
}

async function addNotebook(
  roomId: string,
  payload: AddRoomNotebookPayload,
): Promise<RoomNotebook> {
  const response = await api.post<RoomNotebookResponse>(
    `${route}/${roomId}/notebooks`,
    payload,
  );
  return unwrapData(response.data);
}

async function removeNotebook(
  roomId: string,
  notebookId: string,
): Promise<RoomNotebook> {
  const response = await api.delete<RoomNotebookResponse>(
    `${route}/${roomId}/notebooks/${notebookId}`,
  );
  return unwrapData(response.data);
}

export const RoomService = {
  list,
  create,
  get,
  getById: get,
  update,
  remove,
  delete: remove,
  addMember,
  removeMember,
  addNotebook,
  removeNotebook,
  getRooms: list,
  createRoom: create,
  getRoomById: get,
  updateRoom: update,
  deleteRoom: remove,
  addMemberToRoom: addMember,
  removeMemberFromRoom: removeMember,
  addNotebookToRoom: addNotebook,
  removeNotebookFromRoom: removeNotebook,
};

export const roomService = RoomService;
