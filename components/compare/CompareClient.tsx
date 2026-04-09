'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ComparePanel } from '@/components/compare/ComparePanel';
import { elements, getElementBySymbol } from '@/lib/elements';
import type { Element } from '@/data/elements.schema';
import { CATEGORY_INFO } from '@/data/elements.schema';
import { searchElements } from '@/lib/search';

function ElementPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Element | null;
  onChange: (el: Element | null) => void;
}) {
  const [query, setQuery] = useState(value?.name ?? '');
  const [open, setOpen] = useState(false);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    return searchElements(query, 6).map(x => x.element);
  }, [query]);

  const select = (el: Element) => {
    onChange(el);
    setQuery(el.name);
    setOpen(false);
  };

  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) onChange(null);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search element…"
          className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-[var(--radius-lg)] text-sm focus:border-[var(--accent)] focus:outline-none focus:shadow-[0_0_0_3px_var(--accent-light)] transition-all"
        />
        {value && (
          <div
            className="flex items-center gap-3 mt-2 p-3 rounded-[var(--radius-lg)] border"
            style={{ backgroundColor: CATEGORY_INFO[value.category].bg, borderColor: CATEGORY_INFO[value.category].border }}
          >
            <div
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-[var(--radius-md)] font-bold text-xl"
              style={{ color: CATEGORY_INFO[value.category].text }}
            >
              {value.symbol}
            </div>
            <div>
              <div className="font-semibold" style={{ color: CATEGORY_INFO[value.category].text }}>{value.name}</div>
              <div className="text-xs" style={{ color: CATEGORY_INFO[value.category].text + 'bb' }}>
                #{value.atomicNumber} · {CATEGORY_INFO[value.category].label}
              </div>
            </div>
            <button
              onClick={() => { onChange(null); setQuery(''); }}
              className="ml-auto text-sm opacity-60 hover:opacity-100"
              aria-label="Clear selection"
            >✕</button>
          </div>
        )}

        {open && results.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden z-20">
            {results.map(el => {
              const info = CATEGORY_INFO[el.category];
              return (
                <li key={el.atomicNumber}
                  onMouseDown={() => select(el)}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
                  <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded font-bold text-sm"
                    style={{ backgroundColor: info.bg, color: info.text }}>
                    {el.symbol}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{el.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">#{el.atomicNumber}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function CompareClient() {
  return (
    <React.Suspense fallback={<div className="text-center py-16 text-[var(--text-muted)]">Loading comparison...</div>}>
      <CompareClientInner />
    </React.Suspense>
  );
}

function CompareClientInner() {
  const params = useSearchParams();
  const [elementA, setElementA] = useState<Element | null>(() => {
    const sym = params.get('a');
    return sym ? getElementBySymbol(sym) ?? null : null;
  });
  const [elementB, setElementB] = useState<Element | null>(() => {
    const sym = params.get('b');
    return sym ? getElementBySymbol(sym) ?? null : null;
  });

  const swap = () => {
    setElementA(elementB);
    setElementB(elementA);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-title)' }}>
          ⇄ Compare Elements
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">Select two elements to compare their properties side by side.</p>
      </div>

      {/* Pickers + swap */}
      <div className="flex items-end gap-4 mb-8">
        <ElementPicker label="Element A" value={elementA} onChange={setElementA} />
        <button
          onClick={swap}
          aria-label="Swap elements"
          className="flex-shrink-0 mb-0 w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-white hover:bg-[var(--accent-light)] hover:border-[var(--accent)] transition-all text-lg font-bold text-[var(--text-secondary)]"
        >⇄</button>
        <ElementPicker label="Element B" value={elementB} onChange={setElementB} />
      </div>

      {(elementA || elementB) ? (
        <ComparePanel elementA={elementA} elementB={elementB} />
      ) : (
        <div className="text-center py-16 text-[var(--text-muted)]">
          <div className="text-6xl mb-4" aria-hidden="true">⚗️</div>
          <p className="text-lg font-medium">Search for two elements to compare</p>
          <p className="text-sm mt-1">Try comparing Hydrogen vs Helium, or Gold vs Silver.</p>
        </div>
      )}
    </div>
  );
}
