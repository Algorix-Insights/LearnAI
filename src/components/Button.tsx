import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonStyles = cva(
    "inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 cursor-pointer",
    {
        variants: {
            variant: {
                primary: "bg-[color:var(--app-primary)] text-white hover:opacity-95 shadow-sm rounded-lg",
                secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-lg",
                ghost: "bg-transparent text-slate-500 hover:text-slate-900 rounded-md",
                chip: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-full text-xs px-3 py-1.5",
                sidebarText: "bg-transparent text-sm text-slate-500 transition hover:text-slate-900",
                sidebarIcon: "rounded-full border border-[rgba(116,82,245,0.16)] text-[color:var(--app-primary)]",
                sidebarSquareIcon: "rounded-md border border-[rgba(116,82,245,0.2)] text-[color:var(--app-primary)]",
                sidebarAccent: "rounded-xl bg-[linear-gradient(135deg,var(--app-primary),#7c61ff)] text-white shadow-[0_14px_30px_rgba(116,82,245,0.26)] transition hover:opacity-95",
                pageOutline: "border border-[rgba(116,82,245,0.28)] bg-white text-slate-700 hover:border-[color:var(--app-primary)] hover:text-[color:var(--app-primary)] rounded-xl",
                pageAccent: "bg-[color:var(--app-primary)] text-white hover:opacity-95 shadow-sm rounded-xl",
                pageIcon: "rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700",
                pageComposerTrigger: "rounded-full border border-[rgba(116,82,245,0.12)] bg-white text-slate-500 shadow-[0_6px_16px_rgba(15,23,42,0.02)]",
                pageQuickAction: "rounded-full border border-[rgba(116,82,245,0.22)] bg-white text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.03)] transition hover:border-[color:var(--app-primary)] hover:text-[color:var(--app-primary)]",
            },
            size: {
                sm: "h-8 px-2.5 text-xs gap-1.5",
                md: "h-10 px-4 text-sm gap-2",
                lg: "h-12 px-6 text-base gap-2.5",
                auto: "h-auto w-fit px-4 py-2 text-sm gap-2",
                icon: "h-8 w-8 p-0",
                iconSm: "h-6 w-6 p-0",
                iconMd: "h-10 w-10 p-0",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, children, ...props }, ref) => {
        return (
            <button
                className={buttonStyles({ variant, size, className })}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";