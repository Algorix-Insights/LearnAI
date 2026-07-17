"use client";

import { useDeferredValue, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { ContentLoadingSkeleton } from '@/components/ContentLoadingSkeleton';
import { RoomService } from '@/services/Room';
import type { Room, RoomListResponse } from '@/services/contracts';

import type { RoomHighlightCard, RoomItem } from '../types';
import { SalasHeroSection } from './SalasHeroSection';
import { SalasHighlightsSection } from './SalasHighlightsSection';
import { SalasListSection } from './SalasListSection';

const ROOMS_STALE_TIME = 5 * 60_000;

function hasRoomId(room: Room): room is Room & { room_id: string } {
  return Boolean(room.room_id);
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(date);
}

function formatCreatedText(value: string | null) {
  const formatted = formatDate(value);
  return formatted ? `Creada el ${formatted}` : 'Sin fecha de creación';
}

function sortByRecent(rooms: Array<Room & { room_id: string }>) {
  return [...rooms].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });
}

function toRoomItem(room: Room & { room_id: string }): RoomItem {
  return {
    id: room.room_id,
    title: room.name || 'Sala sin nombre',
    detail: room.description || 'Sin descripción',
    createdText: formatCreatedText(room.created_at),
  };
}

function toHighlightCards(rooms: Array<Room & { room_id: string }>): RoomHighlightCard[] {
  return sortByRecent(rooms)
    .slice(0, 3)
    .map((room) => ({
      id: room.room_id,
      title: room.name || 'Sala sin nombre',
      label: 'Reciente',
      createdText: formatCreatedText(room.created_at),
      detail: room.description || 'Sala de estudio',
    }));
}

function selectRooms(response: RoomListResponse) {
  return response.data.filter(hasRoomId);
}

const EMPTY_ROOMS: ReturnType<typeof selectRooms> = [];

export function SalasContent() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const roomsQuery = useQuery({
    queryKey: ['rooms'],
    queryFn: () => RoomService.list({ limit: 500, offset: 0 }),
    select: selectRooms,
    staleTime: ROOMS_STALE_TIME,
  });

  const rooms = roomsQuery.data ?? EMPTY_ROOMS;

  const roomItems = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLocaleLowerCase('es-MX');
    const filtered = normalizedSearch
      ? rooms.filter((room) =>
          [room.name, room.description].some((value) =>
            value?.toLocaleLowerCase('es-MX').includes(normalizedSearch),
          ),
        )
      : rooms;

    return sortByRecent(filtered).map(toRoomItem);
  }, [deferredSearch, rooms]);

  const highlights = useMemo(() => toHighlightCards(rooms), [rooms]);

  return (
    <div className="flex flex-col gap-8 pb-4">
      <SalasHeroSection search={search} onSearchChange={setSearch} />

      {highlights.length > 0 ? <SalasHighlightsSection cards={highlights} /> : null}

      {roomsQuery.isPending ? (
        <ContentLoadingSkeleton count={4} label="Cargando salas" variant="notebook" />
      ) : null}

      {roomsQuery.isError ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700" role="alert">
          {roomsQuery.error instanceof Error ? roomsQuery.error.message : 'No fue posible cargar las salas.'}
        </div>
      ) : null}

      {!roomsQuery.isPending && !roomsQuery.isError ? (
        <SalasListSection rooms={roomItems} />
      ) : null}
    </div>
  );
}