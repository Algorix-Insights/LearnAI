export type HighlightCard = {
  title: string;
  label: string;
  dueText: string;
  sources: string;
  accent: string;
};

export type NotebookItem = {
  title: string;
  category: string;
  lastSeen: string;
  sources: string;
  dueDate: string;
  status?: string;
};