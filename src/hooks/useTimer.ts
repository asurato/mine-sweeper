import { useState, useEffect, useCallback } from 'react';
import { MAX_TIMER } from '../game/constants';

export function useTimer(isRunning: boolean) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev >= MAX_TIMER) return prev;
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = useCallback(() => {
    setTime(0);
  }, []);

  return { time, reset };
}
