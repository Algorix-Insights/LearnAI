import type { PaginationParams } from '@/services/contracts';
import { TagService } from '@/services/Tag';

export { TagService, tagService } from '@/services/Tag';

export const notebookTagService = {
  getNotebookTags: (params: PaginationParams = {}) => TagService.list(params),
  attachTagToNotebook: TagService.attachToNotebook,
  detachTagFromNotebook: TagService.detachFromNotebook,
};
