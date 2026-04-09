import type { Metadata } from 'next';
import { CompareClient } from '@/components/compare/CompareClient';

export const metadata: Metadata = {
  title: 'Compare Elements — Periodic Table',
  description: 'Compare any two chemical elements side by side — properties, atomic mass, melting points, and more.',
};

export default function ComparePage() {
  return <CompareClient />;
}
