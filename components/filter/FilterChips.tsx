'use client';
import React from 'react';
import { useFilterStore } from '@/store/filterStore';
import { CATEGORY_INFO } from '@/data/elements.schema';

export function FilterChips() {
  const { filters, setCategories, setStates, setBlocks, setPeriods, setGroups, clearFilters, hasActiveFilters } = useFilterStore();

  if (!hasActiveFilters()) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-[var(--accent-light)] border-b border-[var(--border)]" role="group" aria-label="Active filters">
      <span className="text-xs font-semibold text-[var(--accent)]">Filtered:</span>

      {filters.categories.map(cat => {
        const info = CATEGORY_INFO[cat];
        return (
          <button
            key={cat}
            onClick={() => setCategories(filters.categories.filter(c => c !== cat))}
            aria-label={`Remove ${info.label} filter`}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
            style={{ backgroundColor: info.bg, color: info.text, borderColor: info.border }}
          >
            {info.label} ×
          </button>
        );
      })}

      {filters.states.map(s => (
        <button key={s} onClick={() => setStates(filters.states.filter(x => x !== s))}
          aria-label={`Remove ${s} filter`}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-[var(--accent)] bg-white text-[var(--accent)]">
          {s} ×
        </button>
      ))}

      {filters.blocks.map(b => (
        <button key={b} onClick={() => setBlocks(filters.blocks.filter(x => x !== b))}
          aria-label={`Remove block ${b} filter`}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-[var(--accent)] bg-white text-[var(--accent)]">
          Block {b.toUpperCase()} ×
        </button>
      ))}

      {(filters.periods[0] !== 1 || filters.periods[1] !== 7) && (
        <button onClick={() => setPeriods([1, 7])}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-[var(--accent)] bg-white text-[var(--accent)]">
          Period {filters.periods[0]}–{filters.periods[1]} ×
        </button>
      )}

      {(filters.groups[0] !== 1 || filters.groups[1] !== 18) && (
        <button onClick={() => setGroups([1, 18])}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-[var(--accent)] bg-white text-[var(--accent)]">
          Group {filters.groups[0]}–{filters.groups[1]} ×
        </button>
      )}

      <button onClick={clearFilters} className="ml-auto text-xs font-medium text-[var(--accent)] hover:underline">
        Clear all
      </button>
    </div>
  );
}
