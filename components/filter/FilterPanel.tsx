'use client';
import React from 'react';
import { useFilterStore } from '@/store/filterStore';
import { CATEGORY_INFO } from '@/data/elements.schema';
import type { ElementCategory } from '@/data/elements.schema';

export function FilterPanel() {
  const { filters, isOpen, setOpen, setCategories, setStates, setBlocks, setPeriods, setGroups, clearFilters, hasActiveFilters } = useFilterStore();

  if (!isOpen) return null;

  const toggleCategory = (cat: ElementCategory) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    setCategories(next);
  };

  const toggleState = (s: 'solid' | 'liquid' | 'gas' | 'unknown') => {
    const next = filters.states.includes(s)
      ? filters.states.filter(x => x !== s)
      : [...filters.states, s];
    setStates(next);
  };

  const toggleBlock = (b: 's' | 'p' | 'd' | 'f') => {
    const next = filters.blocks.includes(b)
      ? filters.blocks.filter(x => x !== b)
      : [...filters.blocks, b];
    setBlocks(next);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Filter elements"
        aria-modal="true"
        className="fixed bottom-0 left-0 right-0 lg:left-4 lg:top-[var(--header-height)] lg:bottom-4 lg:right-auto lg:w-72 z-50 bg-white rounded-t-2xl lg:rounded-2xl shadow-[var(--shadow-lg)] overflow-y-auto animate-slide-in-up lg:animate-fade-in"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-[var(--text-primary)]">Filter Elements</h2>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <button onClick={clearFilters} className="text-xs text-[var(--accent)] hover:underline font-medium">
                Clear all
              </button>
            )}
            <button onClick={() => setOpen(false)} aria-label="Close filters" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
              ✕
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Category */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Category</h3>
            <div className="flex flex-col gap-1.5">
              {(Object.entries(CATEGORY_INFO) as [ElementCategory, typeof CATEGORY_INFO[ElementCategory]][]).map(([cat, info]) => {
                const active = filters.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    aria-pressed={active}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-[var(--radius-md)] border transition-all text-left"
                    style={{
                      backgroundColor: active ? info.bg : 'transparent',
                      borderColor: active ? info.border : 'var(--border)',
                      color: active ? info.text : 'var(--text-secondary)',
                    }}
                  >
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: info.text }} />
                    <span className="text-sm font-medium">{info.label}</span>
                    {active && <span className="ml-auto text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* State */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">State of Matter</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['solid', 'liquid', 'gas', 'unknown'] as const).map((s) => {
                const icon = { solid: '🔵', liquid: '💧', gas: '💨', unknown: '❓' }[s];
                const active = filters.states.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleState(s)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border text-sm font-medium capitalize transition-all ${active ? 'bg-[var(--accent-light)] border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                  >
                    <span>{icon}</span>
                    {s}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Block */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Block</h3>
            <div className="grid grid-cols-4 gap-2">
              {(['s', 'p', 'd', 'f'] as const).map((b) => {
                const active = filters.blocks.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() => toggleBlock(b)}
                    aria-pressed={active}
                    className={`py-2 rounded-[var(--radius-md)] border text-sm font-bold font-mono transition-all ${active ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Period range */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Period: {filters.periods[0]} – {filters.periods[1]}
            </h3>
            <div className="flex gap-3 items-center">
              <input type="range" min={1} max={7} value={filters.periods[0]}
                onChange={e => setPeriods([+e.target.value, Math.max(+e.target.value, filters.periods[1])])}
                className="flex-1 accent-[var(--accent)]" aria-label="Minimum period" />
              <span className="text-sm text-[var(--text-muted)] w-4 text-center">{filters.periods[0]}</span>
              <input type="range" min={1} max={7} value={filters.periods[1]}
                onChange={e => setPeriods([Math.min(filters.periods[0], +e.target.value), +e.target.value])}
                className="flex-1 accent-[var(--accent)]" aria-label="Maximum period" />
              <span className="text-sm text-[var(--text-muted)] w-4 text-center">{filters.periods[1]}</span>
            </div>
          </section>

          {/* Group range */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Group: {filters.groups[0]} – {filters.groups[1]}
            </h3>
            <div className="flex gap-3 items-center">
              <input type="range" min={1} max={18} value={filters.groups[0]}
                onChange={e => setGroups([+e.target.value, Math.max(+e.target.value, filters.groups[1])])}
                className="flex-1 accent-[var(--accent)]" aria-label="Minimum group" />
              <span className="text-xs text-[var(--text-muted)] w-5 text-center">{filters.groups[0]}</span>
              <input type="range" min={1} max={18} value={filters.groups[1]}
                onChange={e => setGroups([Math.min(filters.groups[0], +e.target.value), +e.target.value])}
                className="flex-1 accent-[var(--accent)]" aria-label="Maximum group" />
              <span className="text-xs text-[var(--text-muted)] w-5 text-center">{filters.groups[1]}</span>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[var(--border)] p-4">
          <button
            onClick={() => setOpen(false)}
            className="w-full py-2.5 bg-[var(--accent)] text-white rounded-[var(--radius-md)] font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
