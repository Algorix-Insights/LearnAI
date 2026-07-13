"use client";

import { useCallback, useEffect, useState } from 'react';

export function useCountdown() {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const start = useCallback((seconds: number) => {
    const normalizedSeconds = Math.max(0, Math.ceil(seconds));
    setRemainingSeconds(normalizedSeconds);
    setDeadline(
      normalizedSeconds > 0 ? Date.now() + normalizedSeconds * 1_000 : null,
    );
  }, []);

  useEffect(() => {
    if (deadline === null) return;

    const update = () => {
      const nextValue = Math.max(0, Math.ceil((deadline - Date.now()) / 1_000));
      setRemainingSeconds(nextValue);
      if (nextValue === 0) setDeadline(null);
    };

    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  return {
    isActive: remainingSeconds > 0,
    remainingSeconds,
    start,
  };
}
