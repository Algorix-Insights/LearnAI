import { api } from '@/services/api';

const BASE_URL = '/notebooks';

export type NotebookStatus = 'active' | 'inactive' | 'archived' | string;

export type Notebook = {
    notebook_id: string;
    name: string;
    description: string;
    grade: number;
    summary: string;
    is_dominated: boolean;
    is_favorite: boolean;
    status: NotebookStatus;
    spent_time: number;
    last_seen_at: string;
    due_date: string;
};

export type NotebookListParams = {
    limit?: number;
    offset?: number;
};

export type NotebookListResponse = {
    data: Notebook[];
    limit: number;
    offset: number;
};

export type CreateNotebookPayload = {
    name: string;
    description: string;
    grade: number;
    summary: string;
    is_dominated: boolean;
    is_favorite: boolean;
    status: NotebookStatus;
    spent_time: number;
    last_seen_at: string;
    due_date: string;
};

export type NotebookResponse = {
    data: Notebook;
};

function buildQueryParams(params?: NotebookListParams) {
    const searchParams = new URLSearchParams();

    if (typeof params?.limit === 'number') {
        searchParams.set('limit', String(params.limit));
    }

    if (typeof params?.offset === 'number') {
        searchParams.set('offset', String(params.offset));
    }

    return searchParams.toString();
}

export const notebookService = {
    async getNotebooks(params?: NotebookListParams) {
        const query = buildQueryParams(params);
        const response = await api.get<NotebookListResponse>(`${BASE_URL}${query ? `?${query}` : ''}`);
        return response.data;
    },

    async createNotebook(notebookData: {
        name: string;
        dueDate: string;
    }) {
        const { name, dueDate: due_date } = notebookData;
        const last_seen_at = new Date().toISOString();
        const response = await api.post<NotebookResponse>(BASE_URL, {
            name,
            due_date,
            description: "",
            grade: 0,
            summary: "",
            is_dominated: false,
            is_favorite: false,
            status: "active",
            spent_time: 0,
            last_seen_at,
        });
        console.log('Notebook created:', response.data);
        return response.data;
    },

    async getNotebookById(notebookId: string) {
        const response = await api.get<NotebookResponse>(`${BASE_URL}/${notebookId}`);
        return response.data;
    },

    // Time spent management
    async updateSpentTime({ notebookId, spentTime }: { notebookId: string; spentTime: number }) {
        const response = await api.patch<NotebookResponse>(`${BASE_URL}/${notebookId}`, { spent_time: spentTime });
        return response.data;
    },

    async getSpentTime(notebookId: string) {
        const response = await api.get<NotebookResponse>(`${BASE_URL}/${notebookId}`);
        return response.data.data.spent_time;
    },

    // due date management
    async updateDueDate({ notebookId, dueDate }: { notebookId: string; dueDate: string }) {
        const response = await api.patch<NotebookResponse>(`${BASE_URL}/${notebookId}`, { due_date: dueDate });
        return response.data;
    },
};