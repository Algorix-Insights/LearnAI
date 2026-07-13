import { ComponentProps } from "react";
import { Input } from "./ui/input";
import { FieldDescription, FieldLabel } from "./ui/field";
import { Field } from "./ui/field";

interface InputFieldProps extends ComponentProps<typeof Input> {
    id: string;
    label: string;
    placeholder: string;
    error?: string;
}

const InputField = ({ id, label, placeholder, error, ...inputProps }: InputFieldProps) => {
    const errorId = `${id}-error`;
    const describedBy = [
        inputProps['aria-describedby'],
        error ? errorId : undefined,
    ].filter(Boolean).join(' ') || undefined;

    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                id={id}
                placeholder={placeholder}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                {...inputProps}
                aria-invalid={inputProps['aria-invalid'] ?? Boolean(error)}
                aria-describedby={describedBy}
            />
            {error && (
                <FieldDescription id={errorId} role="alert" className="text-red-500">
                    {error}
                </FieldDescription>
            )}
        </Field>
    );
};

export default InputField;
