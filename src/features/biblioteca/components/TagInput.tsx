"use client";

import { notebookTagService } from '@/services/NotebookTag';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState, useMemo } from 'react';
import { ClassNamesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface Option {
    readonly label: string;
    readonly value: string;
}

const createOption = (label: string, id?: string) => ({
    label,
    value: id ?? label.toLowerCase().replace(/\W/g, ''),
});

const selectClassNames: ClassNamesConfig<Option, false> = {
    control: (state) =>
        `!min-h-[48px] !rounded-[18px] !border !bg-white !px-2 !shadow-none !transition !cursor-pointer ${
            state.isFocused
                ? '!border-[color:var(--app-primary)] !ring-2 !ring-[color:var(--app-primary)]/10'
                : '!border-slate-200 hover:!border-[color:var(--app-primary)]'
        }`,
    valueContainer: () => '!px-2 !py-0',
    input: () => '!m-0 !p-0 !text-sm !text-slate-900',
    placeholder: () => '!text-slate-400 !text-sm',
    singleValue: () => '!text-slate-900 !text-sm',
    menu: () => '!mt-2 !overflow-hidden !rounded-[18px] !bg-white !p-1 !shadow-[0_24px_48px_rgba(15,23,42,0.14)] !z-50',
    option: (state) =>
        `!cursor-pointer !rounded-[12px] !px-3 !py-2.5 !text-sm !transition-colors ${
            state.isSelected
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

export default function TagInput({
    updateParentState,
}: {
    updateParentState: (value: string) => void;
}) {
    const [value, setValue] = useState<Option | null>(null);
    const queryClient = useQueryClient();

    const {
        data: responseData,
        isLoading: isLoadingTags,
    } = useQuery({
        queryKey: ['tags', 100, 0],
        queryFn: () => notebookTagService.getNotebookTags(),
    });

    const options: Option[] = useMemo(() => {
        const rawList = responseData?.data ?? [];
        if (!Array.isArray(rawList)) return [];
        
        return rawList.map((tag: any) => 
            createOption(tag.name ?? tag.label, tag.tag_id ?? tag.value)
        );
    }, [responseData]);

    const {
        mutate: createNotebookTag,
        isPending: isCreatingTag,
    } = useMutation({
        mutationFn: (newTagName: string) => notebookTagService.createNotebookTag(newTagName),
        onSuccess: (res, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            const createdOption = createOption(variables);
            setValue(createdOption);
            updateParentState(variables);
        },
    });

    const handleCreate = (inputValue: string) => {
        createNotebookTag(inputValue);
    };

    const handleChange = (newValue: Option | null) => {
        setValue(newValue);
        updateParentState(newValue ? newValue.label : '');
    };

    const isDisabled = isLoadingTags || isCreatingTag;

    return (
        <div className="space-y-2 w-full">
            <label htmlFor="tag-select" className="text-sm font-medium text-slate-700">
                Etiqueta disponible o nueva
            </label>
            <CreatableSelect
                inputId="tag-select"
                instanceId="tag-select-instance"
                isClearable
                isDisabled={isDisabled}
                isLoading={isDisabled}
                onChange={handleChange}
                onCreateOption={handleCreate}
                options={options}
                value={value}
                placeholder="Escoge o crea una etiqueta"
                formatCreateLabel={(inputValue) => `Crear etiqueta "${inputValue}"`}
                unstyled
                classNames={selectClassNames}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
        </div>
    );
}