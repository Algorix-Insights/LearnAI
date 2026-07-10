import { Clock } from 'lucide-react';
import { Button } from '@/components/Button';

export default function StudyTimerCard() {
    return (
        <div className="flex items-center gap-3 rounded-md border border-[rgba(116,82,245,0.12)] bg-white/90 p-3 shadow-sm">
            <Clock className="size-6.5 text-[#7452F5]" />

            <span className="flex-1 text-lg p-3 text-center rounded-lg bg-[#F5F3FF] font-medium tracking-tight text-slate-800">
                00:05:00
            </span>

            <Button variant="sidebarIcon" size="icon" type="button" className="border-2 border-[var(--primary)] flex items-center justify-center">
                {/* Triángulo rotado a la derecha (Play) con margen izquierdo óptico para centrarlo bien */}
                <div
                    className="size-3 bg-gradient-to-br from-[#77EADE] to-[#7452F5] ml-0.5"
                    style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }}
                />
            </Button>
        </div>
    );
}