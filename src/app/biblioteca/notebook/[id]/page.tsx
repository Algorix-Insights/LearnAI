import NotebookWorkspace from '@/features/notebook/components/NotebookWorkspace';

type NotebookPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotebookPage({ params }: NotebookPageProps) {
  const { id } = await params;
  return <NotebookWorkspace notebookId={id} />;
}
