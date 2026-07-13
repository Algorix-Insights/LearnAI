"use client";

import { useState } from 'react';
import CreateNotebookIllustration from '@/assets/create-notebook-illustration.png';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { FormEvent } from 'react';
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogTitle, DialogClose, DialogContent, DialogFooter } from '@/components/ui/dialog';
import TagInput from '@/features/biblioteca/components/TagInput';
import { InputText } from './InputText';
import { InputDate } from './InputDate';
import { notebookService } from '@/services/Notebook';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type CreateCuadernoDialogProps = {
  triggerLabel?: string;
  triggerClassName?: string;
  triggerIcon?: boolean;
};

function getTodayInputValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function CreateNotebookDialog({
  triggerLabel = 'Nuevo cuaderno',
  triggerClassName,
  triggerIcon = false,
}: CreateCuadernoDialogProps) {
  const todayInputValue = getTodayInputValue();

  const [notebookForm, setNotebookForm] = useState({
    name: 'Cuaderno',
    studyDeadlineEnabled: false,
    studyDeadline: todayInputValue,
    selectedTag: 'General',
  });

  const queryClient = useQueryClient();

  const { mutate: createNotebook, isPending } = useMutation({
    mutationFn: notebookService.createNotebook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notebooks'] });
    },
  });

  const setNotebookField = (field: keyof typeof notebookForm, value: string | boolean) => {
    setNotebookForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createNotebook({
      name: notebookForm.name,
      dueDate: notebookForm.studyDeadlineEnabled && notebookForm.studyDeadline
        ? new Date(notebookForm.studyDeadline).toISOString()
        : new Date().toISOString(),
    });
  };

  return (
    <Dialog>
      <DialogTrigger render={
        <Button
          variant="default"
          size="default"
          className={`h-12 rounded-full px-6 text-sm font-semibold shadow-[0_16px_30px_rgba(116,82,245,0.24)] transition hover:bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] hover:text-white ${triggerClassName}`}
        >
          {triggerIcon && <Plus className="mr-2 h-4 w-4" />}
          {triggerLabel}
        </Button>
      } />
      <DialogContent
        style={{ maxWidth: '28rem', width: '90vw' }}
        showCloseButton={false}
        className="rounded-[2rem] border border-[color:var(--app-border)] bg-white p-0 shadow-[0_28px_80px_rgba(15,23,42,0.18)]"
      >
        <div className="mt-6 flex flex-col gap-3 no-scrollbar max-h-[70vh] overflow-y-auto px-4">
          <Image
            src={CreateNotebookIllustration}
            alt="Ilustración de creación de cuaderno"
            className="mx-auto rounded-lg"
          />

          <div className="space-y-1.5 px-1">
            <DialogTitle className="text-2xl font-semibold text-slate-900">Crear cuaderno</DialogTitle>

            <form id="create-notebook-form" className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <InputText
                id="notebook-name"
                label="Nombre del cuaderno"
                placeholder="Ingrese el nombre del cuaderno"
                value={notebookForm.name}
                onChange={(e) => setNotebookField('name', e.target.value)}
              />

              <TagInput updateParentState={(value) => setNotebookField('selectedTag', value)} />

              <InputDate
                id="date-required"
                label="Fecha límite de estudio"
                enabledLabel="Activar fecha límite"
                enabled={notebookForm.studyDeadlineEnabled}
                value={notebookForm.studyDeadline}
                onEnabledChange={(enabled) => {
                  setNotebookForm((prev) => ({
                    ...prev,
                    studyDeadlineEnabled: enabled,
                    studyDeadline: enabled ? prev.studyDeadline || todayInputValue : '',
                  }));
                }}
                onValueChange={(studyDeadline) => setNotebookField('studyDeadline', studyDeadline)}
              />
            </form>
          </div>
        </div>
        <DialogFooter>
          <div className="flex flex-col-reverse gap-3 pb-4 pr-4 sm:flex-row sm:justify-end">
            <DialogClose render={<Button variant="outline" size="default" className="h-12 rounded-full border-slate-200 px-5 text-slate-600" />}>
              Cancelar
            </DialogClose>

            <Button
              form="create-notebook-form"
              type="submit"
              disabled={isPending}
              variant="default"
              size="default"
              className="h-12 rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] px-6 text-white shadow-[0_16px_30px_rgba(116,82,245,0.24)] hover:bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))]"
            >
              {isPending ? 'Creando...' : 'Crear Notebook'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}