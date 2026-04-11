import type { Metadata } from 'next';
import { HomeClient } from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'Learn Periodic Table — Learn Chemistry Online',
  description:
    'Explore all 118 chemical elements with interactive details, quizzes, and electron configuration visualizers. Free for everyone.',
};

export default function HomePage() {
  return <HomeClient />;
}
