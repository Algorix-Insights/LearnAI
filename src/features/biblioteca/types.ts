export type HighlightCard = {
  id: string;
  title: string;
  label: string;
  dueText: string;
  detail: string;
};

export type NotebookItem = {
  id: string;
  title: string;
  category: string;
  lastSeen: string;
  detail: string;
  dueDate: string;
  status?: string;
};
