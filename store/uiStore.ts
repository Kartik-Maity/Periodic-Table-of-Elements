'use client';
import { create } from 'zustand';
import type { Element } from '@/data/elements.schema';

interface UIStore {
  selectedElement: Element | null;
  zoom: number;
  viewMode: 'compact' | 'standard' | 'detailed';
  highlightCategory: string | null;
  setSelectedElement: (el: Element | null) => void;
  setZoom: (z: number) => void;
  setViewMode: (m: 'compact' | 'standard' | 'detailed') => void;
  setHighlightCategory: (cat: string | null) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedElement: null,
  zoom: 1,
  viewMode: 'standard',
  highlightCategory: null,

  setSelectedElement: (el) => set({ selectedElement: el }),
  setZoom: (zoom) => set({ zoom: Math.min(2, Math.max(0.5, zoom)) }),
  setViewMode: (viewMode) => set({ viewMode }),
  setHighlightCategory: (cat) => set({ highlightCategory: cat }),
  zoomIn:    () => set((s) => ({ zoom: Math.min(2, s.zoom + 0.15) })),
  zoomOut:   () => set((s) => ({ zoom: Math.max(0.5, s.zoom - 0.15) })),
  resetZoom: () => set({ zoom: 1, viewMode: 'standard' }),
}));
