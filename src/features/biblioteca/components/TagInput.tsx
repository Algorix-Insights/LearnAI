"use client";

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ClassNamesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { TagService } from '@/services/Tag';
import type { TagListResponse } from '@/services/contracts';

interface Option {
  readonly label: string;
  readonly value: string;
}

type TagInputProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

const tagsQueryKey = ['tags'] as const;
const TAGS_STALE_TIME = 10 * 60_000;

const selectClassNames: ClassNamesConfig<Option, false> = {
  control: (state) =>
    `!min-h-[48px] !rounded-[18px] !border !bg-white !px-2 !shadow-none !transition !cursor-pointer ${state.isFocused
      ? '!border-[color:var(--app-primary)] !ring-2 !ring-[color:var(--app-primary)]/10'
      : '!border-slate-200 hover:!border-[color:var(--app-primary)]'
    }`,
  valueContainer: () => '!px-2 !py-0',
  input: () => '!m-0 !p-0 !text-sm !text-slate-900',
  placeholder: () => '!text-slate-400 !text-sm',
  singleValue: () => '!text-slate-900 !text-sm',
  menu: () => '!mt-2 !overflow-hidden !rounded-[18px] !bg-white !p-1 !shadow-[0_24px_48px_rgba(15,23,42,0.14)] !z-50',
  option: (state) =>
    `!cursor-pointer !rounded-[12px] !px-3 !py-2.5 !text-sm !transition-colors ${state.isSelected
      ? '!bg-[color:var(--app-primary)]/12 !text-[color:var(--app-primary)] !font-semibold'
      : state.isFocused
        ? '!bg-slate-100 !text-slate-900'
        : '!bg-white !text-slate-700'
    }`,
  indicatorSeparator: () => '!bg-slate-200',
  dropdownIndicator: () => '!text-slate-400 hover:!text-slate-600',
  clearIndicator: () => '!text-slate-400 hover:!text-slate-600',
  menuPortal: () => '!z-50',
};

export function TagInput({ value, onChange }: TagInputProps) {
  const queryClient = useQueryClient();
  const tagsQuery = useQuery({
    queryKey: tagsQueryKey,
    queryFn: () => TagService.list({ limit: 100, offset: 0 }),
    staleTime: TAGS_STALE_TIME,
  });
  const createTagMutation = useMutation({
    mutationFn: (name: string) => TagService.create({ name: name.trim() }),
    onSuccess: (tag) => {
      queryClient.setQueryData<TagListResponse>(tagsQueryKey, (current) => ({
        data: current
          ? [...current.data.filter((item) => item.id !== tag.id), tag]
          : [tag],
        limit: current?.limit ?? 100,
        offset: current?.offset ?? 0,
      }));
      onChange(tag.id);
    },
  });

  const options = useMemo(
    () =>
      (tagsQuery.data?.data ?? []).map((tag) => ({
        label: tag.name,
        value: tag.id,
      })),
    [tagsQuery.data],
  );
  const selectedOption = options.find((option) => option.value === value) ?? null;

  return (
    <div className="w-full space-y-2">
      <label htmlFor="tag-select" className="text-sm font-medium text-slate-700">
        Etiqueta disponible o nueva
      </label>
      <CreatableSelect
        inputId="tag-select"
        instanceId="tag-select-instance"
        isClearable
        isDisabled={tagsQuery.isPending || createTagMutation.isPending}
        isLoading={tagsQuery.isPending || createTagMutation.isPending}
        onChange={(newValue) => onChange(newValue?.value ?? null)}
        onCreateOption={(inputValue) => {
          const name = inputValue.trim();
          if (name && name.length <= 100) createTagMutation.mutate(name);
        }}
        isValidNewOption={(inputValue) => {
          const name = inputValue.trim();
          return name.length > 0 && name.length <= 100;
        }}
        options={options}
        value={selectedOption}
        placeholder="Escoge o crea una etiqueta"
        formatCreateLabel={(inputValue) => `Crear etiqueta "${inputValue}"`}
        unstyled
        classNames={selectClassNames}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
      />
      {tagsQuery.isError || createTagMutation.isError ? (
        <p className="text-xs text-rose-600" role="alert">
          {createTagMutation.error instanceof Error
            ? createTagMutation.error.message
            : tagsQuery.error instanceof Error
              ? tagsQuery.error.message
              : 'No fue posible cargar las etiquetas.'}
        </p>
      ) : null}
    </div>
  );
}
