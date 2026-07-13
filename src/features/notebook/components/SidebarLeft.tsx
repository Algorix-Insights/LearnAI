'use client';

import { useState, type UIEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useCountdown } from '@/hooks/use-countdown';
import { RagService } from '@/services/Rag';
import { ApiClientError } from '@/services/api';
import type { FlashcardListResponse, Notebook } from '@/services/contracts';

import DueDateCard from './DueDateCard';
import ResourcesSection from './ResourcesSection';
import SidebarHeader from './SidebarHeader';
import SourcesSection from './SourcesSection';
import StudyTimerCard from './StudyTimerCard';
import SummaryCard from './SummaryCard';

type SidebarLeftProps = {
  notebookId: string;
  notebook?: Notebook;
  onClose?: () => void;
  closeButtonRef?: React.Ref<HTMLButtonElement>;
};

async function listNotebookFlashcards(notebookId: string): Promise<FlashcardListResponse> {
  const limit = 100;
  const maxFlashcards = 1000;
  const flashcards: FlashcardListResponse['data'] = [];
  let offset = 0;

  while (offset < maxFlashcards) {
    const page = await RagService.listFlashcards(notebookId, { limit, offset });
    flashcards.push(...page.data);
    if (page.data.length < limit) break;
    offset += limit;
  }

  return { data: flashcards, limit, offset: 0 };
}

export default function SidebarLeft({ notebookId, notebook, onClose, closeButtonRef }: SidebarLeftProps) {
  const queryClient = useQueryClient();
  const [showTopMask, setShowTopMask] = useState(false);
  const [showBottomMask, setShowBottomMask] = useState(false);
  const uploadCooldown = useCountdown();
  const flashcardCooldown = useCountdown();
  const documentsQuery = useQuery({
    queryKey: ['notebooks', notebookId, 'documents'],
    queryFn: () => RagService.listDocuments(notebookId, { limit: 100, offset: 0 }),
  });
  const flashcardsQuery = useQuery({
    queryKey: ['notebooks', notebookId, 'flashcards'],
    queryFn: () => listNotebookFlashcards(notebookId),
  });
  const uploadDocument = useMutation({
    mutationFn: (file: File) => RagService.uploadDocument(notebookId, { file }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['notebooks', notebookId, 'documents'] }),
        queryClient.invalidateQueries({ queryKey: ['statistics'] }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.retryAfterSeconds) {
        uploadCooldown.start(error.retryAfterSeconds);
      }
    },
  });
  const deleteDocument = useMutation({
    mutationFn: (documentId: string) => RagService.deleteDocument(notebookId, documentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notebooks', notebookId, 'documents'] });
    },
  });
  const generateFlashcards = useMutation({
    mutationFn: () => RagService.generateFlashcards(notebookId, { count: 10 }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['notebooks', notebookId, 'flashcards'] }),
        queryClient.invalidateQueries({ queryKey: ['statistics'] }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.retryAfterSeconds) {
        flashcardCooldown.start(error.retryAfterSeconds);
      }
    },
  });

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    setShowTopMask(target.scrollTop > 2);
    setShowBottomMask(target.scrollTop + target.clientHeight < target.scrollHeight - 2);
  };
  const topGradient = showTopMask ? 'rgba(0,0,0,0) 0%, rgba(0,0,0,1) 4%' : 'rgba(0,0,0,1) 0%';
  const bottomGradient = showBottomMask ? 'rgba(0,0,0,1) 96%, rgba(0,0,0,0) 100%' : 'rgba(0,0,0,1) 100%';
  const sourceError = uploadDocument.error ?? deleteDocument.error ?? documentsQuery.error;
  const resourceError = generateFlashcards.error ?? flashcardsQuery.error;
  const hasProcessedSources = (documentsQuery.data?.data ?? []).some(
    (document) => document.processing_status === 'completed',
  );

  return (
    <aside className="relative flex h-full min-h-0 flex-col border-r border-[rgba(116,82,245,0.12)] bg-white/72 backdrop-blur-xl">
      <SidebarHeader onClose={onClose} closeButtonRef={closeButtonRef} />
      <div
        onScroll={handleScroll}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4 transition-all duration-300 hover-scroll"
        style={{
          maskImage: `linear-gradient(to bottom, ${topGradient}, ${bottomGradient})`,
          WebkitMaskImage: `linear-gradient(to bottom, ${topGradient}, ${bottomGradient})`,
        }}
      >
        <StudyTimerCard notebookId={notebookId} />
        <DueDateCard dueDate={notebook?.due_date} />
        <SummaryCard summary={notebook?.summary} />
        <SourcesSection
          sources={documentsQuery.data?.data ?? []}
          isLoading={documentsQuery.isPending}
          isUploading={uploadDocument.isPending || uploadCooldown.isActive}
          retryAfterSeconds={uploadCooldown.remainingSeconds}
          error={sourceError instanceof Error ? sourceError.message : null}
          onUpload={(file) => uploadDocument.mutate(file)}
          onDelete={(documentId) => deleteDocument.mutate(documentId)}
        />
        <ResourcesSection
          notebookId={notebookId}
          resources={flashcardsQuery.data?.data ?? []}
          canGenerate={hasProcessedSources}
          isSourceLoading={documentsQuery.isPending}
          isLoading={flashcardsQuery.isPending}
          isListError={flashcardsQuery.isError}
          isGenerating={generateFlashcards.isPending || flashcardCooldown.isActive}
          retryAfterSeconds={flashcardCooldown.remainingSeconds}
          error={resourceError instanceof Error ? resourceError.message : null}
          onGenerate={() => generateFlashcards.mutate()}
          onRetry={() => void flashcardsQuery.refetch()}
        />
      </div>
    </aside>
  );
}
