'use client';
import React, { useEffect, useState } from 'react';
import type { QuizQuestion } from '@/lib/quiz';

interface QuizTimerProps {
  duration: number; // seconds
  onTimeout: () => void;
  paused?: boolean;
  key?: string | number;
}

export function QuizTimer({ duration, onTimeout, paused = false }: QuizTimerProps) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (paused || remaining <= 0) return;
    const t = setInterval(() => setRemaining(r => {
      if (r <= 1) { clearInterval(t); onTimeout(); return 0; }
      return r - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [paused, onTimeout, remaining]);

  const pct = (remaining / duration) * 100;
  const color = pct > 50 ? '#22C55E' : pct > 25 ? '#F59E0B' : '#EF4444';

  return (
    <div className="space-y-1" aria-label={`${remaining} seconds remaining`}>
      <div className="flex justify-between items-center text-xs text-[var(--text-muted)]">
        <span>Time</span>
        <span className="font-bold tabular-nums" style={{ color }}>{remaining}s</span>
      </div>
      <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%`, backgroundColor: color }}
          role="progressbar"
          aria-valuenow={remaining}
          aria-valuemin={0}
          aria-valuemax={duration}
        />
      </div>
    </div>
  );
}
