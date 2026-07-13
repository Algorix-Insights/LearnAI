import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "./ui/input";

type InputTextProps = {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
};

export function InputText({
    id,
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    disabled = false,
    maxLength,
    className = "",
    labelClassName = "text-sm font-medium text-slate-700",
    inputClassName = "h-12 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--app-primary)] focus:ring-2 focus:ring-[color:var(--app-primary)]/10",
}: InputTextProps) {
    return (
        <Field className={className}>
            <FieldLabel htmlFor={id} className={labelClassName}>
                {label}
            </FieldLabel>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                className={inputClassName}
            />
        </Field>
    );
}
