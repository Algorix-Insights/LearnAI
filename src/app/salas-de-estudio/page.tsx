'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Users } from 'lucide-react';

import { ContentLoadingSkeleton } from '@/components/ContentLoadingSkeleton';
import { AppShell } from '@/layouts/app-shell';
import { RoomService } from '@/services/Room';
import type { RoomListResponse } from '@/services/contracts';

const ROOMS_STALE_TIME = 2 * 60_000;

export default function SalasDeEstudioPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const roomsQuery = useQuery({
    queryKey: ['rooms'],
    queryFn: () => RoomService.list({ limit: 20, offset: 0 }),
    staleTime: ROOMS_STALE_TIME,
  });
  const createRoom = useMutation({
    mutationFn: () => RoomService.create({
      name: name.trim(),
      description: description.trim() || undefined,
    }),
    onSuccess: (room) => {
      setName('');
      setDescription('');
      queryClient.setQueryData<RoomListResponse>(['rooms'], (current) => ({
        data: [
          room,
          ...(current?.data.filter((item) => item.room_id !== room.room_id) ?? []),
        ],
        limit: current?.limit ?? 20,
        offset: current?.offset ?? 0,
      }));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim() && !createRoom.isPending) createRoom.mutate();
  };

  return (
    <AppShell activeHref="/salas-de-estudio">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-[color:var(--app-border)] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
          <div className="grid gap-8 bg-[radial-gradient(circle_at_top_right,rgba(119,234,222,0.24),transparent_38%),linear-gradient(135deg,rgba(116,82,245,0.08),transparent_55%)] p-7 lg:grid-cols-[1fr_420px] lg:p-10">
            <div className="max-w-xl self-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] text-white shadow-lg">
                <Users className="h-6 w-6" />
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">Salas de estudio</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Crea un espacio para tu equipo. El servidor te registra como administrador y conserva la propiedad desde tu JWT.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur">
              <div>
                <label htmlFor="room-name" className="text-sm font-semibold text-slate-700">Nombre de la sala</label>
                <input
                  id="room-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={200}
                  required
                  placeholder="Algoritmos y cadenas"
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[color:var(--app-primary)] focus:ring-2 focus:ring-[color:var(--app-primary)]/10"
                />
              </div>
              <div>
                <label htmlFor="room-description" className="text-sm font-semibold text-slate-700">Descripción</label>
                <textarea
                  id="room-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={1000}
                  placeholder="Sala del equipo de estudio"
                  className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none transition focus:border-[color:var(--app-primary)] focus:ring-2 focus:ring-[color:var(--app-primary)]/10"
                />
              </div>
              {createRoom.isError ? (
                <p className="text-sm text-rose-600" role="alert">
                  {createRoom.error instanceof Error ? createRoom.error.message : 'No fue posible crear la sala.'}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={!name.trim() || createRoom.isPending}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] px-5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {createRoom.isPending ? 'Creando…' : 'Crear sala'}
              </button>
            </form>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--app-primary)]">Tus espacios</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Salas disponibles</h2>
            </div>
            <span className="text-sm text-slate-400">{roomsQuery.data?.data.length ?? 0} salas</span>
          </div>

          {roomsQuery.isPending ? (
            <ContentLoadingSkeleton
              count={3}
              label="Cargando salas"
              variant="room"
            />
          ) : roomsQuery.isError ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700" role="alert">
              {roomsQuery.error instanceof Error ? roomsQuery.error.message : 'No fue posible cargar las salas.'}
            </div>
          ) : roomsQuery.data.data.length === 0 ? (
            <div className="grid min-h-48 place-items-center rounded-3xl border border-dashed border-[color:var(--app-border)] bg-white/70 p-8 text-center text-sm text-slate-400">
              Crea tu primera sala para estudiar en equipo.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {roomsQuery.data.data.map((room) => (
                <article key={room.room_id} className="group rounded-3xl border border-[color:var(--app-border)] bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--app-primary)]/10 text-[color:var(--app-primary)]">
                      <Users className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Activa</span>
                  </div>
                  <h3 className="mt-5 truncate text-lg font-semibold text-slate-900">{room.name || 'Sala sin nombre'}</h3>
                  <p className="mt-2 line-clamp-3 min-h-12 text-sm leading-6 text-slate-500">
                    {room.description || 'Sin descripción.'}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
