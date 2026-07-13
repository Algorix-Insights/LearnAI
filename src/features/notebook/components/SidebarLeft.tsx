"use client";

import { useState, UIEvent } from 'react';
import { useParams } from 'next/navigation';
import DueDateCard from './DueDateCard';
import ResourcesSection from './ResourcesSection';
import SidebarHeader from './SidebarHeader';
import SourcesSection from './SourcesSection';
import StudyTimerCard from './StudyTimerCard';
import SummaryCard from './SummaryCard';

const generatedResources = [
    { name: 'Git y Github, un viaje...', type: 'PDF', pages: '124 Páginas' },
    { name: 'Git y Github, un viaje...', type: 'PDF', pages: '124 Páginas' },
    { name: 'Git y Github, un viaje...', type: 'PDF', pages: '124 Páginas' },
];

export default function SidebarLeft() {
    const params = useParams();
    const notebookId = (params?.notebook_id ?? params?.id ?? '') as string;

    const [showTopMask, setShowTopMask] = useState(false);
    const [showBottomMask, setShowBottomMask] = useState(false);

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        setShowTopMask(scrollTop > 2);
        setShowBottomMask(scrollTop + clientHeight < scrollHeight - 2);
    };

    const topGradient = showTopMask ? 'rgba(0,0,0,0) 0%, rgba(0,0,0,1) 4%' : 'rgba(0,0,0,1) 0%';
    const bottomGradient = showBottomMask ? 'rgba(0,0,0,1) 96%, rgba(0,0,0,0) 100%' : 'rgba(0,0,0,1) 100%';

    return (
        <aside className="relative flex h-full min-h-0 flex-col border-r border-[rgba(116,82,245,0.12)] bg-white/72 backdrop-blur-xl">
            <SidebarHeader />

            <div 
                onScroll={handleScroll}
                className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4 hover-scroll transition-all duration-300"
                style={{
                    maskImage: `linear-gradient(to bottom, ${topGradient}, ${bottomGradient})`,
                    WebkitMaskImage: `linear-gradient(to bottom, ${topGradient}, ${bottomGradient})`
                }}
            >
                <StudyTimerCard notebookId={notebookId} />
                <DueDateCard notebookId={notebookId} />
                <SummaryCard  notebookId={notebookId}/>
                <SourcesSection notebookId={notebookId} />
                <ResourcesSection resources={generatedResources} />
            </div>
        </aside>
    );
}