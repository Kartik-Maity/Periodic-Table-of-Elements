'use client';
import { create } from 'zustand';
import type { ElementCategory } from '@/data/elements.schema';

export interface FilterState {
  categories: ElementCategory[];
  states: ('solid' | 'liquid' | 'gas' | 'unknown')[];
  periods: [number, number];
  groups: [number, number];
  blocks: ('s' | 'p' | 'd' | 'f')[];
  yearRange: [number, number];
}

interface FilterStore {
  filters: FilterState;
  isOpen: boolean;
  setCategories: (cats: ElementCategory[]) => void;
  setStates: (states: ('solid' | 'liquid' | 'gas' | 'unknown')[]) => void;
  setPeriods: (range: [number, number]) => void;
  setGroups: (range: [number, number]) => void;
  setBlocks: (blocks: ('s' | 'p' | 'd' | 'f')[]) => void;
  setYearRange: (range: [number, number]) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  states: [],
  periods: [1, 7],
  groups: [1, 18],
  blocks: [],
  yearRange: [1669, 2010],
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: DEFAULT_FILTERS,
  isOpen: false,

  setCategories: (categories) =>
    set((s) => ({ filters: { ...s.filters, categories } })),

  setStates: (states) =>
    set((s) => ({ filters: { ...s.filters, states } })),

  setPeriods: (periods) =>
    set((s) => ({ filters: { ...s.filters, periods } })),

  setGroups: (groups) =>
    set((s) => ({ filters: { ...s.filters, groups } })),

  setBlocks: (blocks) =>
    set((s) => ({ filters: { ...s.filters, blocks } })),

  setYearRange: (yearRange) =>
    set((s) => ({ filters: { ...s.filters, yearRange } })),

  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),

  clearFilters: () => set({ filters: DEFAULT_FILTERS }),

  hasActiveFilters: () => {
    const f = get().filters;
    return (
      f.categories.length > 0 ||
      f.states.length > 0 ||
      f.blocks.length > 0 ||
      f.periods[0] !== 1 ||
      f.periods[1] !== 7 ||
      f.groups[0] !== 1 ||
      f.groups[1] !== 18 ||
      f.yearRange[0] !== 1669 ||
      f.yearRange[1] !== 2010
    );
  },
}));
