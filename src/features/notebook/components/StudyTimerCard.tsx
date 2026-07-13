"use client";

import { Clock, Pause, Play } from 'lucide-react';
import { Button } from '@/components/Button';
import { notebookService } from '@/services/Notebook';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

type StudyTimerCardProps = {
    notebookId: string;
};

function formatTime(totalSeconds: number) {
    const dur = dayjs.duration(totalSeconds, 'seconds');
    const hours = String(dur.hours()).padStart(2, '0');
    const minutes = String(dur.minutes()).padStart(2, '0');
    const seconds = String(dur.seconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export default function StudyTimerCard({ notebookId }: StudyTimerCardProps) {
    const queryClient = useQueryClient();
    const [isRunning, setIsRunning] = useState(false);
    const [spentTime, setSpentTime] = useState<number>(0);

    const spentTimeRef = useRef(spentTime);
    spentTimeRef.current = spentTime;

    const isRunningRef = useRef(isRunning);
    isRunningRef.current = isRunning;

    const { data: notebookData } = useQuery({
        queryKey: ['notebook', notebookId],
        queryFn: () => notebookService.getNotebookById(notebookId),
        enabled: !!notebookId,
    });

    useEffect(() => {
        if (notebookData?.data?.spent_time !== undefined) {
            setSpentTime(notebookData.data.spent_time);
        }
    }, [notebookData]);

    const { mutate: updateSpentTime } = useMutation({
        mutationFn: (newSpentTime: number) =>
            notebookService.updateSpentTime({ notebookId, spentTime: newSpentTime }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notebook', notebookId] });
        },
    });

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning) {
            interval = setInterval(() => {
                setSpentTime((prev) => {
                    const nextTime = prev + 1;
                    if (nextTime % 60 === 0) {
                        updateSpentTime(nextTime);
                    }
                    return nextTime;
                });
            }, 1000);
        } else if (!isRunning && interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, updateSpentTime]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && isRunningRef.current) {
                updateSpentTime(spentTimeRef.current);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [updateSpentTime]);

    const toggleTimer = () => {
        if (isRunning) {
            updateSpentTime(spentTime);
        }
        setIsRunning((prev) => !prev);
    };

    const formattedTime = formatTime(spentTime);

    return (
        <div className="space-y-2 bg-white/90 border border-[rgba(116,82,245,0.12)] shadow-sm rounded-md p-3">
            <div className="flex items-center gap-3 ">
                <Clock className="size-6.5 text-[#7452F5]" />

                <span className="flex-1 text-lg p-3 text-center rounded-lg bg-[#F5F3FF] font-medium tracking-tight text-slate-800">
                    {formattedTime}
                </span>

                <Button
                    variant="sidebarIcon"
                    size="icon"
                    type="button"
                    onClick={toggleTimer}
                    className="border-2 border-[var(--primary)] flex items-center justify-center cursor-pointer"
                >
                    {isRunning ? (
                        <Pause className="size-4 text-[#7452F5]" />
                    ) : (
                        <div
                            className="size-3 bg-gradient-to-br from-[#77EADE] to-[#7452F5] ml-0.5"
                            style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }}
                        />
                    )}
                </Button>
            </div>
            <div>
                <p className="text-xs text-center text-slate-500">Tiempo de estudio acumulado: {formattedTime}</p>
            </div>
        </div>
    );
}