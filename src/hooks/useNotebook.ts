import { useQuery } from '@tanstack/react-query';
import { NotebookService } from '@/services/Notebook';

export function useNotebook(notebookId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['notebook', notebookId],
    queryFn: () => NotebookService.get(notebookId),
    enabled: !!notebookId,
  });

  return {
    notebook: data?.data,
    isLoading,
    error,
  };
}