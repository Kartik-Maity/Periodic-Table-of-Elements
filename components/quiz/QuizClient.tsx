'use client';
import React, { useState, useCallback } from 'react';
import { QuizCard } from '@/components/quiz/QuizCard';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { ScoreBoard } from '@/components/quiz/ScoreBoard';
import { QUIZ_MODES, generateQuestions, calculateXP, getStreakMilestone, getBadgesEarned, BADGES } from '@/lib/quiz';
import type { QuizMode, QuizQuestion } from '@/lib/quiz';
import { CATEGORY_INFO } from '@/data/elements.schema';
import type { ElementCategory } from '@/data/elements.schema';

const CATEGORIES: ElementCategory[] = [
  'alkali-metal', 'alkaline-earth-metal', 'transition-metal',
  'post-transition-metal', 'metalloid', 'nonmetal', 'halogen', 'noble-gas', 'lanthanide', 'actinide',
];

type Phase = 'home' | 'playing' | 'done';

function getStoredBadges(): string[] {
  try { return JSON.parse(localStorage.getItem('quiz-badges') ?? '[]'); } catch { return []; }
}
function saveBadges(badges: string[]) {
  try { localStorage.setItem('quiz-badges', JSON.stringify(badges)); } catch {}
}
function getCompletedModes(): QuizMode[] {
  try { return JSON.parse(localStorage.getItem('quiz-completed-modes') ?? '[]'); } catch { return []; }
}
function saveCompletedMode(mode: QuizMode) {
  try {
    const existing = getCompletedModes();
    if (!existing.includes(mode)) {
      localStorage.setItem('quiz-completed-modes', JSON.stringify([...existing, mode]));
    }
  } catch {}
}

export function QuizClient() {
  const [phase, setPhase] = useState<Phase>('home');
  const [selectedMode, setSelectedMode] = useState<QuizMode>('practice');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [streakMsg, setStreakMsg] = useState<string | null>(null);

  const [finalTime, setFinalTime] = useState(0);

  const startQuiz = () => {
    const cfg = QUIZ_MODES[selectedMode];
    const qs = generateQuestions(cfg.questionCount, selectedCategory ?? undefined);
    setQuestions(qs);
    setCurrentIdx(0);
    setScore(0);
    setXP(0);
    setStreak(0);
    setMaxStreak(0);
    setStartTime(Date.now());
    setFinalTime(0);
    setNewBadges([]);
    setPhase('playing');
  };

  const handleAnswer = useCallback((_: string, correct: boolean) => {
    const earnedXP = calculateXP(correct, streak);
    const newStreak = correct ? streak + 1 : 0;
    const newScore = correct ? score + 1 : score;

    setStreak(newStreak);
    setMaxStreak(ms => Math.max(ms, newStreak));
    setScore(newScore);
    setXP(x => x + earnedXP);

    const msg = getStreakMilestone(newStreak);
    if (msg) { setStreakMsg(msg); setTimeout(() => setStreakMsg(null), 2000); }

    // Survival mode: 3 wrong = game over
    const isSurvival = selectedMode === 'survival';
    const wrongCount = (currentIdx + 1) - newScore;
    const survivalDead = isSurvival && !correct && wrongCount >= 3;

    const isLast = currentIdx >= questions.length - 1;

    if (isLast || survivalDead) {
      // Finish
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      setFinalTime(timeTaken);
      const existing = getStoredBadges();
      const completed = getCompletedModes();
      const earned = getBadgesEarned(selectedMode, newScore, questions.length, maxStreak, timeTaken, completed, existing);
      const allBadges = [...new Set([...existing, ...earned])];
      saveBadges(allBadges);
      saveCompletedMode(selectedMode);
      setNewBadges(earned);
      setTimeout(() => setPhase('done'), 300);
    } else {
      setCurrentIdx(i => i + 1);
    }
  }, [streak, score, currentIdx, questions.length, selectedMode, startTime, maxStreak]);

  if (phase === 'home') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-title)' }}>
            🎯 Chemistry Quiz
          </h1>
          <p className="text-[var(--text-secondary)]">Test your knowledge of the periodic table across 5 exciting modes.</p>
        </div>

        {/* Badges display */}
        {getStoredBadges().length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[var(--radius-lg)]">
            <div className="text-sm font-semibold text-amber-700 mb-2">Your Badges</div>
            <div className="flex gap-2 flex-wrap">
              {BADGES.map(b => (
                <div key={b.id} title={`${b.name}: ${b.description}`}
                  className={`text-2xl transition-opacity ${getStoredBadges().includes(b.id) ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                  {b.emoji}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode selection */}
        <div className="grid gap-3 mb-6">
          {(Object.entries(QUIZ_MODES) as [QuizMode, typeof QUIZ_MODES[QuizMode]][]).map(([mode, cfg]) => {
            const meta = {
              practice: { icon: '📚', desc: '10 questions · No timer · Hints available', color: '#10B981' },
              standard: { icon: '🎯', desc: '15 questions · 30s per question', color: '#3B82F6' },
              speed:    { icon: '⚡', desc: '20 questions · 15s per question', color: '#F59E0B' },
              survival: { icon: '💀', desc: 'Unlimited · 3 wrong = game over', color: '#EF4444' },
              category: { icon: '📖', desc: '10 questions · Choose a category', color: '#8B5CF6' },
            }[mode];

            return (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                aria-pressed={selectedMode === mode}
                className={`flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border-2 text-left transition-all ${selectedMode === mode ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-[var(--border)] bg-white hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)]'}`}
              >
                <span className="text-3xl">{meta.icon}</span>
                <div>
                  <div className="font-semibold capitalize" style={{ color: selectedMode === mode ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {mode === 'speed' ? 'Speed Round' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">{meta.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Category picker for category mode */}
        {selectedMode === 'category' && (
          <div className="mb-6 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)]">
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-3">Choose Category</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const info = CATEGORY_INFO[cat];
                return (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    aria-pressed={selectedCategory === cat}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                    style={{
                      backgroundColor: selectedCategory === cat ? info.bg : 'transparent',
                      color: selectedCategory === cat ? info.text : 'var(--text-secondary)',
                      borderColor: selectedCategory === cat ? info.border : 'var(--border)',
                    }}>
                    {info.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={startQuiz}
          disabled={selectedMode === 'category' && !selectedCategory}
          className="w-full py-4 bg-[var(--accent)] text-white rounded-[var(--radius-lg)] font-bold text-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-md)]"
        >
          Start Quiz 🚀
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <ScoreBoard
        mode={selectedMode}
        score={score}
        total={questions.length}
        xp={xp}
        streak={maxStreak}
        timeTaken={finalTime}
        newBadges={newBadges}
        earnedBadges={getStoredBadges()}
        onPlayAgain={() => { setPhase('home'); }}
        onHome={() => { setPhase('home'); }}
      />
    );
  }

  const current = questions[currentIdx];
  const cfg = QUIZ_MODES[selectedMode];

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setPhase('home')} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          ← Quit
        </button>
        <div className="text-sm font-medium text-[var(--text-secondary)] capitalize">
          {selectedMode === 'speed' ? 'Speed Round' : selectedMode}
        </div>
      </div>

      <div className="mb-4">
        <ProgressBar current={currentIdx} total={questions.length} label="Questions" />
      </div>

      {/* Streak message */}
      {streakMsg && (
        <div className="mb-3 text-center text-base font-bold text-orange-500 animate-fade-in">
          {streakMsg}
        </div>
      )}

      <QuizCard
        key={currentIdx}
        question={current}
        questionNumber={currentIdx + 1}
        totalQuestions={questions.length}
        streak={streak}
        xp={xp}
        timeLimit={cfg.timePerQuestion}
        onAnswer={handleAnswer}
        showHint={selectedMode === 'practice'}
      />
    </div>
  );
}
