import { api } from "@/services/api"

export interface DocumentResponse {
    document_id: string;
    notebook_id: string;
    name: string;
    description: string;
    source_type: string;
    status: string;
    processing_status: string;
    mime_type: string;
    size_bytes: number;
    created_at: string; 
    updated_at: string; 
}

interface DocumentListResponse {
    data: DocumentResponse[];
    limit: number;
    offset: number;
}

export const SourceRagService = {

    async getSourcesUploaded(notebookId: string) {
        const response = await api.get<DocumentListResponse>(`/documents/${notebookId}`);
        return response.data;
    },

}

