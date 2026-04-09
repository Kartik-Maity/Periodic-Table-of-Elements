'use client';
import React from 'react';
import type { QuizMode } from '@/lib/quiz';
import { BADGES } from '@/lib/quiz';
import { Button } from '@/components/ui/Button';

interface ScoreBoardProps {
  mode: QuizMode;
  score: number;
  total: number;
  xp: number;
  streak: number;
  timeTaken: number;
  newBadges: string[];
  earnedBadges: string[];
  onPlayAgain: () => void;
  onHome: () => void;
}

export function ScoreBoard({
  mode, score, total, xp, streak, timeTaken, newBadges, earnedBadges, onPlayAgain, onHome,
}: ScoreBoardProps) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;

  const grade =
    pct === 100 ? { emoji: '🏆', text: 'Perfect!', color: '#F59E0B' } :
    pct >= 80   ? { emoji: '⭐', text: 'Excellent!', color: '#10B981' } :
    pct >= 60   ? { emoji: '👍', text: 'Good job!', color: '#3B82F6' } :
    pct >= 40   ? { emoji: '📚', text: 'Keep studying!', color: '#8B5CF6' } :
                  { emoji: '💪', text: 'Practice more!', color: '#EF4444' };

  return (
    <div className="max-w-md mx-auto py-8 px-4 animate-fade-in">
      {/* Grade */}
      <div className="text-center mb-8">
        <div className="text-7xl mb-3" aria-hidden="true">{grade.emoji}</div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-title)', color: grade.color }}>
          {grade.text}
        </h2>
        <p className="text-[var(--text-muted)] text-sm capitalize">{mode} mode complete</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'Score',    value: `${score} / ${total}`,  icon: '🎯' },
          { label: 'Accuracy', value: `${pct}%`,              icon: '📊' },
          { label: 'Best Streak', value: `${streak}`,        icon: '🔥' },
          { label: 'Time',     value: `${mins}m ${secs}s`,    icon: '⏱️' },
          { label: 'XP Earned', value: `+${xp}`,             icon: '✨' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] p-4 text-center">
            <div className="text-2xl mb-1" aria-hidden="true">{icon}</div>
            <div className="text-xl font-bold text-[var(--text-primary)]">{value}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* New badges */}
      {newBadges.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[var(--radius-lg)]">
          <h3 className="text-sm font-bold text-amber-700 mb-3">🎉 New Badges Earned!</h3>
          <div className="flex flex-wrap gap-2">
            {newBadges.map(id => {
              const badge = BADGES.find(b => b.id === id);
              return badge ? (
                <div key={id} className="flex items-center gap-2 bg-white border border-amber-200 rounded-full px-3 py-1.5">
                  <span className="text-lg">{badge.emoji}</span>
                  <div>
                    <div className="text-xs font-semibold text-amber-800">{badge.name}</div>
                    <div className="text-[10px] text-amber-600">{badge.description}</div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* All badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Your Badges</h3>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map(id => {
              const badge = BADGES.find(b => b.id === id);
              return badge ? (
                <div key={id} title={badge.description}
                  className="w-10 h-10 flex items-center justify-center text-2xl rounded-full border border-[var(--border)] bg-[var(--bg-secondary)]">
                  {badge.emoji}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" size="lg" onClick={onHome} className="flex-1">
          ← Home
        </Button>
        <Button variant="primary" size="lg" onClick={onPlayAgain} className="flex-1">
          Play Again
        </Button>
      </div>
    </div>
  );
}
