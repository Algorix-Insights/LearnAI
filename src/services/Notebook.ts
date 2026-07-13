import { api, unwrapData } from '@/services/api';
import type {
  ApiEnvelope,
  CreateNotebookPayload,
  Notebook,
  NotebookListResponse,
  NotebookResponse,
  NotebookTag,
  PaginationParams,
  UpdateNotebookPayload,
} from '@/services/contracts';

const route = '/notebooks';

async function list(params: PaginationParams = {}): Promise<NotebookListResponse> {
  const response = await api.get<NotebookListResponse>(route, { params });
  return response.data;
}

async function create(payload: CreateNotebookPayload): Promise<Notebook> {
  const response = await api.post<NotebookResponse>(route, payload);
  return unwrapData(response.data);
}

async function get(notebookId: string): Promise<Notebook> {
  const response = await api.get<NotebookResponse>(`${route}/${notebookId}`);
  return unwrapData(response.data);
}

async function update(
  notebookId: string,
  payload: UpdateNotebookPayload,
): Promise<Notebook> {
  const response = await api.patch<NotebookResponse>(
    `${route}/${notebookId}`,
    payload,
  );
  return unwrapData(response.data);
}

async function remove(notebookId: string): Promise<Notebook> {
  const response = await api.delete<NotebookResponse>(`${route}/${notebookId}`);
  return unwrapData(response.data);
}

async function attachTag(
  notebookId: string,
  tagId: string,
): Promise<NotebookTag> {
  const response = await api.post<ApiEnvelope<NotebookTag>>(
    `${route}/${notebookId}/tags/${tagId}`,
  );
  return unwrapData(response.data);
}

async function detachTag(
  notebookId: string,
  tagId: string,
): Promise<NotebookTag> {
  const response = await api.delete<ApiEnvelope<NotebookTag>>(
    `${route}/${notebookId}/tags/${tagId}`,
  );
  return unwrapData(response.data);
}

export const NotebookService = {
  list,
  create,
  get,
  getById: get,
  update,
  remove,
  delete: remove,
  attachTag,
  detachTag,
  getNotebooks: list,
  createNotebook: create,
  getNotebookById: get,
  updateNotebook: update,
  deleteNotebook: remove,
  attachTagToNotebook: attachTag,
  detachTagFromNotebook: detachTag,
};

export const notebookService = NotebookService;
