'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RoomService } from '@/services/Room';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/Button';

type ShareNotebookDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notebookId: string;
  notebookName: string;
  onSuccess?: (roomId: string) => void;
};

export function ShareNotebookDialog({
  open,
  onOpenChange,
  notebookId,
  notebookName,
  onSuccess,
}: ShareNotebookDialogProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: `Sala de ${notebookName}`,
    description: '',
  });

  // Verificar si ya existe una sala con este cuaderno
  const existingRoomsQuery = useQuery({
    queryKey: ['rooms-with-notebook', notebookId],
    queryFn: () => RoomService.getRoomsByNotebook(notebookId),
    enabled: open,
  });

  const shareRoomMutation = useMutation({
    mutationFn: async () => {
      // 1. Crear la sala
      const room = await RoomService.create({
        name: form.name.trim(),
        description: form.description.trim() || null,
      });

      // 2. Asociar el cuaderno
      await RoomService.attachNotebook(room.room_id, notebookId);

      return room;
    },
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms-with-notebook', notebookId] });
      onSuccess?.(room.room_id);
      onOpenChange(false);
    },
  });

  // Si ya existe una sala con este cuaderno
  if (existingRoomsQuery.data?.data?.length > 0) {
    const existingRoom = existingRoomsQuery.data.data[0];
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ya estás compartiendo este cuaderno</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Este cuaderno ya está siendo compartido en la sala:
          </p>
          <div className="p-4 bg-gray-50 rounded-lg mt-2">
            <h4 className="font-medium">{existingRoom.name}</h4>
            <p className="text-sm text-gray-500">{existingRoom.description}</p>
          </div>
          <DialogFooter>
            <Button variant="pageOutline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button 
              variant="pageAccent" 
              onClick={() => {
                window.location.href = `/salas-de-estudio/${existingRoom.room_id}`;
              }}
            >
              Ir a la sala
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartir cuaderno en sala</DialogTitle>
          <p className="text-sm text-gray-500">
            Crea una sala para estudiar "{notebookName}" en equipo
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de la sala</label>
            <input
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre de la sala"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción (opcional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="¿Qué van a estudiar?"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              📚 Se compartirá el cuaderno <strong>"{notebookName}"</strong>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="pageOutline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="pageAccent"
            onClick={() => shareRoomMutation.mutate()}
            disabled={shareRoomMutation.isPending || !form.name.trim()}
          >
            {shareRoomMutation.isPending ? 'Creando...' : 'Crear y compartir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}