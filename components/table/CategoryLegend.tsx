'use client';
import React from 'react';
import { CATEGORY_INFO } from '@/data/elements.schema';
import type { ElementCategory } from '@/data/elements.schema';
import { useFilterStore } from '@/store/filterStore';

export function CategoryLegend() {
  const { filters, setCategories } = useFilterStore();

  const toggleCategory = (cat: ElementCategory) => {
    const current = filters.categories;
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    setCategories(next);
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 px-4 py-2"
      role="group"
      aria-label="Filter by element category"
    >
      {(Object.entries(CATEGORY_INFO) as [ElementCategory, typeof CATEGORY_INFO[ElementCategory]][]).map(
        ([cat, info]) => {
          const isActive = filters.categories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              aria-pressed={isActive}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border transition-all duration-150 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]"
              style={{
                backgroundColor: isActive ? info.bg : 'transparent',
                color: isActive ? info.text : 'var(--text-secondary)',
                borderColor: isActive ? info.border : 'var(--border)',
                boxShadow: isActive ? `0 0 0 1.5px ${info.border}` : 'none',
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: info.text }}
                aria-hidden="true"
              />
              {info.label}
            </button>
          );
        }
      )}
    </div>
  );
}
