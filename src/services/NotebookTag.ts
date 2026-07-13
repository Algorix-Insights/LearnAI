import { api } from '@/services/api';

export const notebookTagService = {
    getNotebookTags: async () => {
        try {
            const response = await api.get('/tags');
            return response.data;
        } catch (error) {
            console.error('Error fetching notebook tags:', error);
            throw error;
        }
    },
    createNotebookTag: async (tagName: string) => {
        try {
            const response = await api.post('/tags', { name: tagName });
            return response.data;
        } catch (error) {
            console.error('Error creating notebook tag:', error);
            throw error;
        }
    },

};