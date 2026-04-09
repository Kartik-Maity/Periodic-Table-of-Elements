'use client';
import React from 'react';
import { useUIStore } from '@/store/uiStore';
import { useFilterStore } from '@/store/filterStore';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';

export function TableControls() {
  const { zoom, viewMode, zoomIn, zoomOut, resetZoom, setViewMode } = useUIStore();
  const { hasActiveFilters, toggleOpen, clearFilters } = useFilterStore();
  const activeFilters = hasActiveFilters();

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-primary)]">
      {/* Zoom controls */}
      <div className="flex items-center gap-1 border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden">
        <Tooltip content="Zoom out">
          <button
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            aria-label="Zoom out"
            className="px-2.5 py-1.5 text-sm font-medium hover:bg-[var(--bg-tertiary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            −
          </button>
        </Tooltip>
        <span className="px-2 text-xs text-[var(--text-muted)] min-w-[44px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Tooltip content="Zoom in">
          <button
            onClick={zoomIn}
            disabled={zoom >= 2}
            aria-label="Zoom in"
            className="px-2.5 py-1.5 text-sm font-medium hover:bg-[var(--bg-tertiary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </Tooltip>
      </div>

      {/* View mode toggle */}
      <div
        role="radiogroup"
        aria-label="View mode"
        className="flex items-center gap-0 border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden"
      >
        {(['compact', 'standard', 'detailed'] as const).map((mode) => (
          <button
            key={mode}
            role="radio"
            aria-checked={viewMode === mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              viewMode === mode
                ? 'bg-[var(--accent)] text-white'
                : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Reset */}
      <Tooltip content="Reset view">
        <Button variant="ghost" size="sm" onClick={resetZoom} aria-label="Reset view">
          ↺ Reset
        </Button>
      </Tooltip>

      {/* Filter button */}
      <Button
        variant={activeFilters ? 'primary' : 'secondary'}
        size="sm"
        onClick={toggleOpen}
        aria-label={`Open filters${activeFilters ? ' (filters active)' : ''}`}
        className="ml-auto"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        Filters
        {activeFilters && (
          <span className="ml-1 w-4 h-4 rounded-full bg-white/30 text-[10px] font-bold flex items-center justify-center">
            ●
          </span>
        )}
      </Button>

      {activeFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      )}
    </div>
  );
}
