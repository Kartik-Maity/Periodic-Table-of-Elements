'use client';
import React, { useState, useCallback } from 'react';
import type { QuizQuestion } from '@/lib/quiz';
import { QuizTimer } from './QuizTimer';
import { CATEGORY_INFO } from '@/data/elements.schema';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  streak: number;
  xp: number;
  timeLimit: number | null;
  onAnswer: (answer: string, correct: boolean) => void;
  showHint?: boolean;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  streak,
  xp,
  timeLimit,
  onAnswer,
  showHint = false,
}: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const info = CATEGORY_INFO[question.element.category];

  const handleAnswer = useCallback((option: string) => {
    if (revealed || timedOut) return;
    setSelected(option);
    setRevealed(true);
    const correct = option === question.correctAnswer;
    setTimeout(() => onAnswer(option, correct), 1500);
  }, [revealed, timedOut, question.correctAnswer, onAnswer]);

  const handleTimeout = useCallback(() => {
    if (revealed) return;
    setTimedOut(true);
    setRevealed(true);
    setTimeout(() => onAnswer('', false), 1500);
  }, [revealed, onAnswer]);

  const getButtonStyle = (opt: string) => {
    if (!revealed) {
      return 'border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] active:scale-98';
    }
    if (opt === question.correctAnswer) {
      return 'border-green-500 bg-green-50 text-green-800 font-semibold';
    }
    if (opt === selected && opt !== question.correctAnswer) {
      return 'border-red-400 bg-red-50 text-red-700 quiz-wrong';
    }
    return 'border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-muted)] opacity-60';
  };

  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-md)] overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <span className="text-sm text-[var(--text-muted)]">
          Question <span className="font-bold text-[var(--text-primary)]">{questionNumber}</span> of {totalQuestions}
        </span>
        <div className="flex items-center gap-3">
          {streak >= 3 && (
            <span className="text-sm font-bold text-orange-500 streak-pop">
              🔥 {streak}
            </span>
          )}
          <span className="text-sm font-semibold text-[var(--accent)]">
            {xp} XP
          </span>
        </div>
      </div>

      {/* Timer */}
      {timeLimit && !revealed && (
        <div className="px-5 pt-4">
          <QuizTimer
            key={questionNumber}
            duration={timeLimit}
            onTimeout={handleTimeout}
            paused={revealed}
          />
        </div>
      )}

      {/* Question */}
      <div className="px-5 pt-5 pb-4">
        {/* Element context chip */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-[var(--radius-md)] font-bold text-lg"
            style={{ backgroundColor: info.bg, color: info.text, border: `1.5px solid ${info.border}` }}
          >
            {question.element.symbol}
          </div>
          <div>
            <div className="text-xs font-medium" style={{ color: info.text }}>{info.label}</div>
            <div className="text-xs text-[var(--text-muted)]">Atomic number {question.element.atomicNumber}</div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-[var(--text-primary)] leading-snug mb-5" id="quiz-question">
          {question.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5" role="group" aria-labelledby="quiz-question">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={revealed || timedOut}
              aria-pressed={selected === opt}
              className={`w-full min-h-[48px] px-4 py-3 rounded-[var(--radius-md)] border-2 text-left text-sm font-medium transition-all duration-150 ${getButtonStyle(opt)}`}
            >
              {opt === question.correctAnswer && revealed && <span className="mr-2">✅</span>}
              {opt === selected && opt !== question.correctAnswer && revealed && <span className="mr-2">❌</span>}
              {opt}
            </button>
          ))}
        </div>

        {/* Timeout message */}
        {timedOut && !selected && (
          <div className="mt-3 text-sm text-red-600 font-medium text-center">⏰ Time&apos;s up!</div>
        )}
      </div>

      {/* Explanation (after answer) */}
      {revealed && (
        <div className="px-5 pb-5 animate-fade-in">
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)] mr-1">Explanation:</span>
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
