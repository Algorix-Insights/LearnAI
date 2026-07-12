import axios from 'axios';
export const notebookTagService = {
    getNotebookTags: async () => {
        try {
            const response = await axios.get('/api/notebook-tags');
            return response.data;
        } catch (error) {
            console.error('Error fetching notebook tags:', error);
            throw error;
        }
    }
};