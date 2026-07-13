"use client";

import { useState } from 'react';
import type { FormEvent } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import CreateNotebookIllustration from '@/assets/create-notebook-illustration.png';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { NotebookService } from '@/services/Notebook';
import type { NotebookListResponse } from '@/services/contracts';

import { InputDate } from './InputDate';
import { InputText } from './InputText';

type CreateNotebookDialogProps = {
  triggerLabel?: string;
  triggerClassName?: string;
  triggerIcon?: boolean;
};

function TagInputLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-2" role="status">
      <span className="sr-only">Cargando selector de etiquetas</span>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-12 w-full rounded-[18px]" />
    </div>
  );
}

const TagInput = dynamic(
  () => import('@/features/biblioteca/components/TagInput').then((module) => module.TagInput),
  { loading: TagInputLoading, ssr: false },
);

function getTodayInputValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function toDueDate(value: string) {
  return new Date(`${value}T23:59:00`).toISOString();
}

export function CreateNotebookDialog({
  triggerLabel = 'Nuevo cuaderno',
  triggerClassName,
  triggerIcon = false,
}: CreateNotebookDialogProps) {
  const queryClient = useQueryClient();
  const todayInputValue = getTodayInputValue();
  const [open, setOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [tagWarning, setTagWarning] = useState<string | null>(null);
  const [notebookForm, setNotebookForm] = useState({
    name: '',
    studyDeadlineEnabled: false,
    studyDeadline: todayInputValue,
  });

  const resetForm = () => {
    setNotebookForm({
      name: '',
      studyDeadlineEnabled: false,
      studyDeadline: todayInputValue,
    });
    setSelectedTagId(null);
  };

  const createNotebookMutation = useMutation({
    mutationFn: async () => {
      const notebook = await NotebookService.create({
        name: notebookForm.name.trim(),
        due_date:
          notebookForm.studyDeadlineEnabled && notebookForm.studyDeadline
            ? toDueDate(notebookForm.studyDeadline)
            : null,
      });

      if (!notebook.notebook_id) {
        throw new Error('La API creó el cuaderno sin devolver su identificador.');
      }

      let warning: string | null = null;
      if (selectedTagId) {
        try {
          await NotebookService.attachTag(notebook.notebook_id, selectedTagId);
        } catch (error) {
          warning = error instanceof Error
            ? `Cuaderno creado, pero no se pudo asociar la etiqueta: ${error.message}`
            : 'Cuaderno creado, pero no se pudo asociar la etiqueta.';
        }
      }

      return { notebook, warning };
    },
    onSuccess: ({ notebook, warning }) => {
      queryClient.setQueryData<NotebookListResponse>(['notebooks'], (current) => ({
        data: [
          notebook,
          ...(current?.data.filter(
            (item) => item.notebook_id !== notebook.notebook_id,
          ) ?? []),
        ],
        limit: current?.limit ?? 500,
        offset: current?.offset ?? 0,
      }));
      void queryClient.invalidateQueries({ queryKey: ['statistics'] });
      setTagWarning(warning);
      setOpen(false);
      resetForm();
    },
  });

  const setNotebookField = (
    field: keyof typeof notebookForm,
    value: string | boolean,
  ) => {
    setNotebookForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!notebookForm.name.trim()) return;
    createNotebookMutation.mutate();
  };

  return (
    <div className="space-y-2">
      <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setTagWarning(null);
        if (!nextOpen && !createNotebookMutation.isPending) resetForm();
      }}
      >
      <DialogTrigger
        render={
          <Button
            variant="default"
            size="default"
            className={`h-12 rounded-full px-6 text-sm font-semibold shadow-[0_16px_30px_rgba(116,82,245,0.24)] transition hover:bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] hover:text-white ${triggerClassName ?? ''}`}
          >
            {triggerIcon ? <Plus className="mr-2 h-4 w-4" /> : null}
            {triggerLabel}
          </Button>
        }
      />
      <DialogContent
        style={{ maxWidth: '28rem', width: '90vw' }}
        showCloseButton={false}
        className="rounded-[2rem] border border-[color:var(--app-border)] bg-white p-0 shadow-[0_28px_80px_rgba(15,23,42,0.18)]"
      >
        <div className="mt-6 flex max-h-[70vh] flex-col gap-3 overflow-y-auto px-4 no-scrollbar">
          <Image
            src={CreateNotebookIllustration}
            alt="Ilustración de creación de cuaderno"
            className="mx-auto rounded-lg"
          />

          <div className="space-y-1.5 px-1">
            <DialogTitle className="text-2xl font-semibold text-slate-900">
              Crear cuaderno
            </DialogTitle>

            <form
              id="create-notebook-form"
              className="mt-6 space-y-5"
              onSubmit={handleSubmit}
            >
              <InputText
                id="notebook-name"
                label="Nombre del cuaderno"
                placeholder="Ingrese el nombre del cuaderno"
                value={notebookForm.name}
                maxLength={200}
                onChange={(event) => setNotebookField('name', event.target.value)}
              />

              <TagInput value={selectedTagId} onChange={setSelectedTagId} />

              <InputDate
                id="date-required"
                label="Fecha límite de estudio"
                enabledLabel="Activar fecha límite"
                enabled={notebookForm.studyDeadlineEnabled}
                value={notebookForm.studyDeadline}
                onEnabledChange={(enabled) => {
                  setNotebookForm((current) => ({
                    ...current,
                    studyDeadlineEnabled: enabled,
                    studyDeadline: enabled
                      ? current.studyDeadline || todayInputValue
                      : '',
                  }));
                }}
                onValueChange={(studyDeadline) =>
                  setNotebookField('studyDeadline', studyDeadline)
                }
              />

              {createNotebookMutation.isError ? (
                <p className="text-sm text-rose-600" role="alert">
                  {createNotebookMutation.error instanceof Error
                    ? createNotebookMutation.error.message
                    : 'No fue posible crear el cuaderno.'}
                </p>
              ) : null}
            </form>
          </div>
        </div>

        <DialogFooter>
          <div className="flex flex-col-reverse gap-3 pb-4 pr-4 sm:flex-row sm:justify-end">
            <DialogClose
              disabled={createNotebookMutation.isPending}
              render={
                <Button
                  variant="outline"
                  size="default"
                  className="h-12 rounded-full border-slate-200 px-5 text-slate-600"
                />
              }
            >
              Cancelar
            </DialogClose>

            <Button
              form="create-notebook-form"
              type="submit"
              variant="default"
              size="default"
              disabled={
                createNotebookMutation.isPending || !notebookForm.name.trim()
              }
              className="h-12 rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] px-6 text-white shadow-[0_16px_30px_rgba(116,82,245,0.24)] hover:bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))]"
            >
              {createNotebookMutation.isPending
                ? 'Guardando…'
                : 'Crear cuaderno'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      </Dialog>
      {tagWarning ? (
        <p className="max-w-56 text-xs text-amber-700" role="status">
          {tagWarning}
        </p>
      ) : null}
    </div>
  );
}
