import { CalendarClock } from 'lucide-react';

export default function DueDateCard() {
    return (
        <div className="rounded-md border border-[rgba(116,82,245,0.12)] bg-white/80 p-3 shadow-sm">
            <div className="flex items-center gap-3">
                <div className=" text-[color:var(--app-primary)]">
                    <CalendarClock className="size-6.5" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-700">Fecha Límite:</p>
                    <p className="mt-1 text-xs font-medium text-[color:var(--app-primary)]">Mayo 7, 2026</p>
                </div>
            </div>
        </div>
    );
}