import { useQuery } from '@tanstack/react-query';
import { Plus, UploadCloud, FileText } from 'lucide-react';
import { Button } from '@/components/Button';
import FileCard from './FileCard';
import { CollapsibleCard } from '@/components/CollapsibleCard';
import { SourceRagService, DocumentResponse } from '@/services/Source';

export type SourceItem = {
    name: string;
    type: string;
    pages: string;
    accent: string;
};

type SourcesSectionProps = {
    notebookId: string;
};

const mapDocumentToSourceItem = (doc: DocumentResponse): SourceItem => ({
    name: doc.name,
    type: doc.source_type || doc.mime_type || 'Documento',
    pages: `${(doc.size_bytes / 1024).toFixed(1)} KB`, 
    accent: 'bg-[#7452F5]',
});

export default function SourcesSection({ notebookId }: SourcesSectionProps) {
    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['sources', notebookId],
        queryFn: () => SourceRagService.getSourcesUploaded(notebookId),
        enabled: !!notebookId,
    });

    const documents = response?.data ?? [];
    const sources: SourceItem[] = documents.map(mapDocumentToSourceItem);

    return (
        <CollapsibleCard
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <UploadCloud className="size-5 text-[#7452F5]" />
                        <span>Fuentes</span>
                    </div>
                </div>
            }
            content={
                <div className="mt-3 space-y-2.5">
                    <Button variant="secondary" className="gap-2 w-full" type="button">
                        <Plus className="size-4" />
                        <span>Agregar Fuente</span>
                    </Button>

                    {isLoading && (
                        <p className="text-xs text-slate-400 text-center py-4">
                            Cargando documentos...
                        </p>
                    )}

                    {isError && (
                        <p className="text-xs text-red-500 text-center py-4">
                            Error al cargar las fuentes.
                        </p>
                    )}

                    {!isLoading && !isError && sources.length === 0 && (
                        <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-lg">
                            <FileText className="size-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-xs text-slate-500 leading-relaxed">
                                No se han cargado documentos, presiona el botón para agregar fuentes y estudiar.
                            </p>
                        </div>
                    )}

                    {!isLoading && !isError && sources.map((source) => (
                        <FileCard
                            key={`${source.name}-${source.pages}`}
                            title={source.name}
                            description={`${source.type} - ${source.pages}`}
                            icon={<span className={`grid h-5 w-4 place-items-center rounded-sm ${source.accent} text-[10px] font-bold text-white`}>PDF</span>}
                            action={
                                <Button variant="sidebarText" size="iconSm" className="rounded-full text-slate-400 hover:text-slate-700" type="button">
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
                                        <circle cx="12" cy="5" r="1.75" />
                                        <circle cx="12" cy="12" r="1.75" />
                                        <circle cx="12" cy="19" r="1.75" />
                                    </svg>
                                </Button>
                            }
                        />
                    ))}
                </div>
            }
        />
    );
}