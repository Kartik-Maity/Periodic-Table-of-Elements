import type { Element } from '@/data/elements.schema';
import { elements } from '@/lib/elements';

export type QuizMode = 'practice' | 'standard' | 'speed' | 'survival' | 'category';

export interface QuizQuestion {
  id: string;
  type: 'symbol-to-name' | 'name-to-symbol' | 'atomic-number' | 'category-id' | 'property-fact' | 'true-false';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  element: Element;
}

export interface QuizConfig {
  mode: QuizMode;
  questionCount: number;
  timePerQuestion: number | null;
  category?: string;
}

export const QUIZ_MODES: Record<QuizMode, QuizConfig> = {
  practice:  { mode: 'practice',  questionCount: 10, timePerQuestion: null },
  standard:  { mode: 'standard',  questionCount: 15, timePerQuestion: 30 },
  speed:     { mode: 'speed',     questionCount: 20, timePerQuestion: 15 },
  survival:  { mode: 'survival',  questionCount: 999, timePerQuestion: null },
  category:  { mode: 'category',  questionCount: 10, timePerQuestion: null },
};

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  description: string;
}

export const BADGES: Badge[] = [
  { id: 'first-quiz',   emoji: '🎯', name: 'First Quiz',   description: 'Complete any quiz' },
  { id: 'perfect',      emoji: '⭐', name: 'Perfect Score', description: '100% on Standard mode' },
  { id: 'speed-demon',  emoji: '⚡', name: 'Speed Demon',  description: 'Complete Speed Round under 3 min' },
  { id: 'on-fire',      emoji: '🔥', name: 'On Fire',       description: '10-answer streak' },
  { id: 'champion',     emoji: '🏆', name: 'Champion',      description: 'Complete all quiz modes' },
  { id: 'survivor',     emoji: '💀', name: 'Survivor',      description: 'Reach 30 in Survival mode' },
];

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRandomElements(exclude?: Element, count = 3): Element[] {
  const pool = elements.filter((e) => e !== exclude);
  return shuffleArray(pool).slice(0, count);
}

function generateSymbolToNameQuestion(el: Element): QuizQuestion {
  const wrong = getRandomElements(el, 3);
  const options = shuffleArray([el.name, ...wrong.map((e) => e.name)]);
  return {
    id: `stn-${el.atomicNumber}`,
    type: 'symbol-to-name',
    question: `What element has the symbol "${el.symbol}"?`,
    options,
    correctAnswer: el.name,
    explanation: `${el.symbol} is the symbol for ${el.name} (atomic number ${el.atomicNumber}).`,
    element: el,
  };
}

function generateNameToSymbolQuestion(el: Element): QuizQuestion {
  const wrong = getRandomElements(el, 3);
  const options = shuffleArray([el.symbol, ...wrong.map((e) => e.symbol)]);
  return {
    id: `nts-${el.atomicNumber}`,
    type: 'name-to-symbol',
    question: `What is the chemical symbol for ${el.name}?`,
    options,
    correctAnswer: el.symbol,
    explanation: `The symbol for ${el.name} is ${el.symbol}.`,
    element: el,
  };
}

function generateAtomicNumberQuestion(el: Element): QuizQuestion {
  const wrongNums = getRandomElements(el, 3).map((e) => String(e.atomicNumber));
  const options = shuffleArray([String(el.atomicNumber), ...wrongNums]);
  return {
    id: `an-${el.atomicNumber}`,
    type: 'atomic-number',
    question: `What is the atomic number of ${el.name}?`,
    options,
    correctAnswer: String(el.atomicNumber),
    explanation: `${el.name} has an atomic number of ${el.atomicNumber}.`,
    element: el,
  };
}

function generateCategoryQuestion(el: Element): QuizQuestion {
  const allCategories = [...new Set(elements.map((e) => e.category))];
  const wrongCats = shuffleArray(allCategories.filter((c) => c !== el.category)).slice(0, 3);
  const options = shuffleArray([el.category, ...wrongCats]);
  const formatCat = (c: string) => c.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    id: `cat-${el.atomicNumber}`,
    type: 'category-id',
    question: `${el.name} belongs to which category?`,
    options: options.map(formatCat),
    correctAnswer: formatCat(el.category),
    explanation: `${el.name} is a ${formatCat(el.category)}.`,
    element: el,
  };
}

function generateTrueFalseQuestion(el: Element): QuizQuestion {
  const isTrue = Math.random() > 0.5;
  let question: string;
  let correctAnswer: string;
  let explanation: string;

  if (isTrue) {
    if (Math.random() > 0.5) {
      question = `${el.name} has the symbol ${el.symbol}. True or False?`;
      correctAnswer = 'True';
      explanation = `Correct! ${el.name}'s symbol is ${el.symbol}.`;
    } else {
      const fakePeriod = el.period === 1 ? 2 : el.period - 1;
      question = `${el.name} is in period ${el.period}. True or False?`;
      correctAnswer = 'True';
      explanation = `Correct! ${el.name} is indeed in period ${el.period}.`;
      void fakePeriod;
    }
  } else {
    const wrongEl = getRandomElements(el, 1)[0];
    question = `${el.name} has the symbol ${wrongEl.symbol}. True or False?`;
    correctAnswer = 'False';
    explanation = `False! ${el.name}'s symbol is ${el.symbol}, not ${wrongEl.symbol}.`;
  }

  return {
    id: `tf-${el.atomicNumber}-${Date.now()}`,
    type: 'true-false',
    question,
    options: ['True', 'False'],
    correctAnswer,
    explanation,
    element: el,
  };
}

export function generateQuestions(count: number, category?: string): QuizQuestion[] {
  let pool = category ? elements.filter((e) => e.category === category) : elements;
  // Use only well-known elements for better quiz quality
  if (!category) {
    pool = elements.filter((e) => e.atomicNumber <= 86);
  }

  const selected = shuffleArray(pool).slice(0, Math.min(count, pool.length));
  const generators = [
    generateSymbolToNameQuestion,
    generateNameToSymbolQuestion,
    generateAtomicNumberQuestion,
    generateCategoryQuestion,
    generateTrueFalseQuestion,
  ];

  return selected.map((el) => {
    const gen = generators[Math.floor(Math.random() * generators.length)];
    return gen(el);
  });
}

export function calculateXP(correct: boolean, streak: number, timeBonus: number = 0): number {
  if (!correct) return 0;
  const base = 10;
  const streakBonus = Math.min(streak * 2, 20);
  return base + streakBonus + timeBonus;
}

export function getStreakMilestone(streak: number): string | null {
  if (streak === 20) return '🏆 Incredible! 20-streak!';
  if (streak === 10) return '⚡ Amazing! 10-streak!';
  if (streak === 5)  return '🔥 On fire! 5-streak!';
  return null;
}

export function getBadgesEarned(
  mode: QuizMode,
  score: number,
  total: number,
  streak: number,
  timeTaken: number,
  completedModes: QuizMode[],
  existingBadges: string[]
): string[] {
  const newBadges: string[] = [];
  const add = (id: string) => {
    if (!existingBadges.includes(id) && !newBadges.includes(id)) newBadges.push(id);
  };

  add('first-quiz');
  if (mode === 'standard' && score === total) add('perfect');
  if (mode === 'speed' && timeTaken < 180) add('speed-demon');
  if (streak >= 10) add('on-fire');
  if (mode === 'survival' && score >= 30) add('survivor');

  const allModes: QuizMode[] = ['practice', 'standard', 'speed', 'survival', 'category'];
  const doneAfter = [...new Set([...completedModes, mode])];
  if (allModes.every((m) => doneAfter.includes(m))) add('champion');

  return newBadges;
}
