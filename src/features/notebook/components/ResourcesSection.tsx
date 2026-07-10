import { Plus, Star } from 'lucide-react';

import { Button } from '@/components/Button';

import FileCard from './FileCard';
import { CollapsibleCard } from '@/components/CollapsibleCard';

export type ResourceItem = {
    name: string;
    type: string;
    pages: string;
};

type ResourcesSectionProps = {
    resources: ResourceItem[];
};

export default function ResourcesSection({ resources }: ResourcesSectionProps) {
    return (
        <CollapsibleCard
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Star className="size-5 text-[#7452F5]" />
                        <span>Recursos</span>
                    </div>
                </div>
            }

            content={
                <div className="mt-3 space-y-2.5">
                    <Button variant="secondary" className="gap-2 w-full">
                        <Plus className="size-4" />
                        <span>Generar recurso</span>
                    </Button>
                    {resources.map((resource) => (
                        <FileCard
                            key={`${resource.name}-${resource.pages}`}
                            title={resource.name}
                            description={`${resource.type} - ${resource.pages}`}
                            icon={<span className={`grid h-5 w-4 place-items-center rounded-sm text-[10px] font-bold text-white`}>PDF</span>}
                            action={
                                <Button variant="sidebarText" size="iconSm" className="rounded-full text-slate-400 hover:text-slate-700" type="button">
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
                                        <circle cx="12" cy="5" r="1.75" />
                                        <circle cx="12" cy="12" r="1.75" />
                                        <circle cx="12" cy="19" r="1.75" />
                                    </svg>
                                </Button>
                            }
                        />
                    ))}
                </div>
            }
        />
    );
}