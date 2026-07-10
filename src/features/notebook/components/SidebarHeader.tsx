import { ChevronDown, ChevronLeft } from 'lucide-react';

import { Button } from '@/components/Button';

export default function SidebarHeader() {
    return (
        <div className="flex h-16 items-center justify-between border-b border-[rgba(116,82,245,0.12)] px-4">
            <Button variant="sidebarText" size="auto" className="gap-2 px-0 py-0" type="button">
                <ChevronLeft className="size-4 text-[color:var(--app-primary)]" />
                <span>Biblioteca</span>
            </Button>

            <Button variant="sidebarText" size="auto" className="gap-1 px-0 py-0" type="button">
                <span>Recientes</span>
                <ChevronDown className="size-4" />
            </Button>
        </div>
    );
}