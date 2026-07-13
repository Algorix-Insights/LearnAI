import Link from 'next/link';
import { ChevronLeft, X } from 'lucide-react';

import { Button } from '@/components/Button';

type SidebarHeaderProps = {
    onClose?: () => void;
    closeButtonRef?: React.Ref<HTMLButtonElement>;
};

export default function SidebarHeader({ onClose, closeButtonRef }: SidebarHeaderProps) {
    return (
        <div className="flex h-16 items-center justify-between border-b border-[rgba(116,82,245,0.12)] px-4">
            <Link
                href="/biblioteca"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7452F5]/30"
            >
                <ChevronLeft className="size-4 text-[color:var(--app-primary)]" />
                <span>Biblioteca</span>
            </Link>

            <Button
                ref={closeButtonRef}
                variant="pageIcon"
                size="icon"
                type="button"
                className="lg:hidden"
                onClick={onClose}
                aria-label="Cerrar panel de recursos"
            >
                <X className="size-4" />
            </Button>
        </div>
    );
}
