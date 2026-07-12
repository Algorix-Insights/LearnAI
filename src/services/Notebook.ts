import axios from 'axios';

const BASE_URL = '/api/v1/notebooks';

export const notebookService = {
    // GET /api/v1/notebooks
    getNotebooks: async () => {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching notebooks:', error);
            throw error;
        }
    },

    // POST /api/v1/notebooks
    createNotebook: async (notebookData: { title: string; description?: string }) => {
        try {
            const response = await axios.post(BASE_URL, notebookData);
            return response.data;
        } catch (error) {
            console.error('Error creating notebook:', error);
            throw error;
        }
    },

    // GET /api/v1/notebooks/{notebook_id}
    getNotebookById: async (notebookId: string | number) => {
        try {
            const response = await axios.get(`${BASE_URL}/${notebookId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching notebook with id ${notebookId}:`, error);
            throw error;
        }
    },

    // PATCH /api/v1/notebooks/{notebook_id}
    updateNotebook: async (notebookId: string | number, updateData: Partial<{ title: string; description: string }>) => {
        try {
            const response = await axios.patch(`${BASE_URL}/${notebookId}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating notebook with id ${notebookId}:`, error);
            throw error;
        }
    },

    // DELETE /api/v1/notebooks/{notebook_id}
    deleteNotebook: async (notebookId: string | number) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${notebookId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting notebook with id ${notebookId}:`, error);
            throw error;
        }
    }
};