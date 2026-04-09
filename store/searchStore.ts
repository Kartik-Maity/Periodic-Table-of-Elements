'use client';
import { create } from 'zustand';
import type { Element } from '@/data/elements.schema';

interface SearchStore {
  query: string;
  results: Element[];
  isOpen: boolean;
  setQuery: (q: string) => void;
  setResults: (r: Element[]) => void;
  setIsOpen: (open: boolean) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  results: [],
  isOpen: false,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setIsOpen: (isOpen) => set({ isOpen }),
  clear: () => set({ query: '', results: [], isOpen: false }),
}));
