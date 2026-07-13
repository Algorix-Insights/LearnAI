import { api, unwrapData } from '@/services/api';
import type {
  ApiEnvelope,
  CreateTagPayload,
  NotebookTag,
  PaginationParams,
  Tag,
  TagListResponse,
  TagResponse,
} from '@/services/contracts';

const route = '/tags';

async function list(params: PaginationParams = {}): Promise<TagListResponse> {
  const response = await api.get<TagListResponse>(route, { params });
  return response.data;
}

async function create(payload: CreateTagPayload): Promise<Tag> {
  const response = await api.post<TagResponse>(route, payload);
  return unwrapData(response.data);
}

async function get(tagId: string): Promise<Tag> {
  const response = await api.get<TagResponse>(`${route}/${tagId}`);
  return unwrapData(response.data);
}

async function attachToNotebook(
  notebookId: string,
  tagId: string,
): Promise<NotebookTag> {
  const response = await api.post<ApiEnvelope<NotebookTag>>(
    `/notebooks/${notebookId}/tags/${tagId}`,
  );
  return unwrapData(response.data);
}

async function detachFromNotebook(
  notebookId: string,
  tagId: string,
): Promise<NotebookTag> {
  const response = await api.delete<ApiEnvelope<NotebookTag>>(
    `/notebooks/${notebookId}/tags/${tagId}`,
  );
  return unwrapData(response.data);
}

export const TagService = {
  list,
  create,
  get,
  getById: get,
  attachToNotebook,
  detachFromNotebook,
  getTags: list,
  createTag: create,
  getTagById: get,
  attachTagToNotebook: attachToNotebook,
  detachTagFromNotebook: detachFromNotebook,
};

export const tagService = TagService;
