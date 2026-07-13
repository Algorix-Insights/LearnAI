import { notebookService } from '@/services/Notebook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarClock, Pencil, Check, X } from 'lucide-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default function DueDateCard({
    notebookId,
}: {
    notebookId: string;
}) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [tempDate, setTempDate] = useState('');

    const {
        data: notebookData
    } = useQuery({
        queryKey: ['notebook', notebookId],
        queryFn: () => notebookService.getNotebookById(notebookId),
    });

    const updateDateMutation = useMutation({
        mutationFn: (newDate: string | null) => 
            notebookService.updateNotebook(notebookId, { due_date: newDate || "" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notebook', notebookId] });
            setIsEditing(false);
        },
    });

    const dueDate = notebookData?.data?.due_date;

    const handleSave = () => {
        const isoDate = tempDate ? dayjs(tempDate).toISOString() : null;
        updateDateMutation.mutate(isoDate);
    };

    const handleStartEditing = () => {
        setTempDate(dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : '');
        setIsEditing(true);
    };

    return (
        <div className="group relative rounded-md border border-[rgba(116,82,245,0.12)] bg-white/80 p-3 shadow-sm transition-all">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="text-[color:var(--app-primary)]">
                        <CalendarClock className="size-6.5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">Fecha Límite:</p>
                        
                        {isEditing ? (
                            <div className="mt-1 flex items-center gap-1.5">
                                <input
                                    type="date"
                                    value={tempDate}
                                    onChange={(e) => setTempDate(e.target.value)}
                                    className="rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-700 focus:border-[color:var(--app-primary)] focus:outline-none"
                                />
                                <button
                                    onClick={handleSave}
                                    disabled={updateDateMutation.isPending}
                                    className="text-green-600 hover:text-green-700"
                                    title="Guardar"
                                >
                                    <Check className="size-4" />
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                    title="Cancelar"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <p className="mt-1 text-xs font-medium text-[color:var(--app-primary)]">
                                {dueDate 
                                    ? dayjs(dueDate).format('MMMM D, YYYY') 
                                    : 'Sin fecha delimitada'}
                            </p>
                        )}
                    </div>
                </div>

                {!isEditing && (
                    <button
                        onClick={handleStartEditing}
                        className="opacity-0 transition-opacity group-hover:opacity-100 text-slate-400 hover:text-[color:var(--app-primary)] p-1"
                        title="Editar fecha"
                    >
                        <Pencil className="size-4" />
                    </button>
                )}
            </div>
        </div>
    );
}