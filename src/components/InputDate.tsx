"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputDateProps = {
    id: string;
    label: string;
    enabledLabel?: string;
    enabled: boolean;
    value: string;
    onEnabledChange: (enabled: boolean) => void;
    onValueChange: (value: string) => void;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
};

function getTodayInputValue() {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function InputDate({
    id,
    label,
    enabledLabel = "Tiene fecha límite",
    enabled,
    value,
    onEnabledChange,
    onValueChange,
    className,
    labelClassName = "text-sm font-medium text-slate-700",
    inputClassName = "h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--app-primary)] focus:ring-2 focus:ring-[color:var(--app-primary)]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
}: InputDateProps) {
    const minDate = getTodayInputValue();

    return (
        <div className={cn("space-y-2", className)}>
            {/* Contenedor superior: Label del campo + Checkbox a la par */}
            <div className="flex items-center justify-between gap-4">
                <FieldLabel htmlFor={id} className={labelClassName}>
                    {label}
                </FieldLabel>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-600">
                    <Checkbox
                        checked={enabled}
                        onCheckedChange={(checked) => {
                            const nextEnabled = checked === true;

                            onEnabledChange(nextEnabled);

                            if (!nextEnabled) {
                                onValueChange("");
                                return;
                            }

                            if (!value) {
                                onValueChange(minDate);
                            }
                        }}
                    />
                    <span>{enabledLabel}</span>
                </label>
            </div>

            {/* Input de fecha */}
            <Field className="w-full">
                <Input
                    id={id}
                    type="date"
                    value={enabled ? value : ""}
                    min={minDate}
                    disabled={!enabled}
                    onChange={(event) => {
                        const nextValue = event.target.value;

                        if (nextValue && nextValue < minDate) {
                            onValueChange(minDate);
                            return;
                        }

                        onValueChange(nextValue);
                    }}
                    className={inputClassName}
                />
            </Field>
        </div>
    );
}