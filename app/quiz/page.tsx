import type { Metadata } from 'next';
import { QuizClient } from '@/components/quiz/QuizClient';

export const metadata: Metadata = {
  title: 'Chemistry Quiz — Test Your Element Knowledge',
  description: 'Test your knowledge of the periodic table with 5 quiz modes: Practice, Standard, Speed Round, Survival, and Category quizzes.',
};

export default function QuizPage() {
  return <QuizClient />;
}
