'use client';
import React, { useEffect, useRef, useState } from 'react';
import { searchElements } from '@/lib/search';
import { useSearchStore } from '@/store/searchStore';
import { useUIStore } from '@/store/uiStore';
import type { Element } from '@/data/elements.schema';
import { CATEGORY_INFO } from '@/data/elements.schema';

export function SearchBar() {
  const { query, isOpen, setQuery, setResults, setIsOpen, clear } = useSearchStore();
  const { setSelectedElement } = useUIStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { results } = useSearchStore();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const res = searchElements(query, 8);
    setResults(res.map((r) => r.element));
    setIsOpen(res.length > 0);
  }, [query, setResults, setIsOpen]);

  const handleSelect = (el: Element) => {
    setSelectedElement(el);
    clear();
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      clear();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setTimeout(() => setIsOpen(false), 150);
    }
  };

  return (
    <div className="relative w-full max-w-sm" onBlur={handleBlur}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          id="element-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search element, symbol, number…"
          autoComplete="off"
          aria-label="Search elements"
          aria-autocomplete="list"
          aria-controls={isOpen ? 'search-results' : undefined}
          aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
          className="w-full h-10 pl-9 pr-10 text-sm bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-full)] placeholder-[var(--text-muted)] text-[var(--text-primary)] transition-all focus:bg-white focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-light)] outline-none"
        />
        {query && (
          <button
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          aria-label="Search results"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden z-50 animate-fade-in"
        >
          {results.map((el, i) => {
            const info = CATEGORY_INFO[el.category];
            return (
              <li
                key={el.atomicNumber}
                id={`result-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={() => handleSelect(el)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                  i === activeIndex ? 'bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {/* Symbol chip */}
                <span
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] font-bold text-sm"
                  style={{ backgroundColor: info.bg, color: info.text, border: `1px solid ${info.border}` }}
                >
                  {el.symbol}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-[var(--text-primary)]">{el.name}</span>
                    <span className="text-xs text-[var(--text-muted)]">#{el.atomicNumber}</span>
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: info.text }}
                  >
                    {info.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] px-4 py-3 text-sm text-[var(--text-muted)] z-50">
          No results for &quot;{query}&quot;. Try a symbol like &quot;Fe&quot; or name like &quot;iron&quot;.
        </div>
      )}
    </div>
  );
}
