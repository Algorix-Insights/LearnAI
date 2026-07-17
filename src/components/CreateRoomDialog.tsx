"use client";

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RoomService } from '@/services/Room';
import type { RoomListResponse } from '@/services/contracts';

type CreateRoomDialogProps = {
  triggerLabel?: string;
  triggerClassName?: string;
  triggerIcon?: boolean;
};

export function CreateRoomDialog({
  triggerLabel = 'Nueva sala',
  triggerClassName,
  triggerIcon = false,
}: CreateRoomDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const resetForm = () => setForm({ name: '', description: '' });

  const createRoomMutation = useMutation({
    mutationFn: () =>
      RoomService.create({
        name: form.name.trim(),
        description: form.description.trim() || null,
      }),
    onSuccess: (room) => {
      queryClient.setQueryData<RoomListResponse>(['rooms'], (current) => ({
        data: [
          room,
          ...(current?.data.filter((item) => item.room_id !== room.room_id) ?? []),
        ],
        limit: current?.limit ?? 500,
        offset: current?.offset ?? 0,
      }));
      void queryClient.invalidateQueries({ queryKey: ['rooms'], refetchType: 'active' });
      setOpen(false);
      resetForm();
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    createRoomMutation.mutate();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen && !createRoomMutation.isPending) resetForm();
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
          <div className="space-y-1.5 px-1">
            <DialogTitle className="text-2xl font-semibold text-slate-900">
              Crear sala de estudio
            </DialogTitle>

            <form id="create-room-form" className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="room-name" className="text-sm font-medium text-slate-700">
                  Nombre de la sala
                </label>
                <input
                  id="room-name"
                  type="text"
                  maxLength={200}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ej. Algoritmos y cadenas"
                  className="w-full rounded-[18px] border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[color:var(--app-primary)] focus:ring-2 focus:ring-[color:var(--app-primary)]/10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="room-description" className="text-sm font-medium text-slate-700">
                  Descripción (opcional)
                </label>
                <textarea
                  id="room-description"
                  maxLength={500}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="¿Para qué es esta sala?"
                  className="w-full resize-none rounded-[18px] border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[color:var(--app-primary)] focus:ring-2 focus:ring-[color:var(--app-primary)]/10"
                />
              </div>

              {createRoomMutation.isError ? (
                <p className="text-sm text-rose-600" role="alert">
                  {createRoomMutation.error instanceof Error
                    ? createRoomMutation.error.message
                    : 'No fue posible crear la sala.'}
                </p>
              ) : null}
            </form>
          </div>
        </div>

        <DialogFooter>
          <div className="flex flex-col-reverse gap-3 pb-4 pr-4 sm:flex-row sm:justify-end">
            <DialogClose
              disabled={createRoomMutation.isPending}
              render={
                <Button variant="outline" size="default" className="h-12 rounded-full border-slate-200 px-5 text-slate-600" />
              }
            >
              Cancelar
            </DialogClose>

            <Button
              form="create-room-form"
              type="submit"
              variant="default"
              size="default"
              disabled={createRoomMutation.isPending || !form.name.trim()}
              className="h-12 rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] px-6 text-white shadow-[0_16px_30px_rgba(116,82,245,0.24)] hover:bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))]"
            >
              {createRoomMutation.isPending ? 'Guardando…' : 'Crear sala'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}