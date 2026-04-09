'use client';
import React, { useCallback, useRef } from 'react';
import { ElementCard } from '@/components/table/ElementCard';
import { elements } from '@/lib/elements';
import type { Element } from '@/data/elements.schema';
import { useUIStore } from '@/store/uiStore';
import { useFilterStore } from '@/store/filterStore';

// IUPAC standard layout: [atomicNumber, column, row]
// row: 1-7 for main table, 9-10 for lanthanides/actinides
type CellDef = { n: number; col: number; row: number };

function buildLayout(): CellDef[] {
  const cells: CellDef[] = [];
  const el = elements;

  el.forEach((e) => {
    const n = e.atomicNumber;
    let col = e.group ?? 0;
    let row = e.period;

    // Lanthanides (57-71) → row 9, col 3-17
    if (n >= 57 && n <= 71) {
      row = 9;
      col = n - 57 + 3;
    }
    // Actinides (89-103) → row 10, col 3-17
    else if (n >= 89 && n <= 103) {
      row = 10;
      col = n - 89 + 3;
    }
    // La placeholder in row 6 col 3 handled by gap
    if (col > 0) {
      cells.push({ n, col, row });
    }
  });
  return cells;
}

const LAYOUT = buildLayout();

function isElementVisible(el: Element, filters: ReturnType<typeof useFilterStore.getState>['filters']): boolean {
  const f = filters;
  if (f.categories.length > 0 && !f.categories.includes(el.category)) return false;
  if (f.states.length > 0 && !f.states.includes(el.state)) return false;
  if (f.blocks.length > 0 && !f.blocks.includes(el.block)) return false;
  if (el.period < f.periods[0] || el.period > f.periods[1]) return false;
  if (el.group !== null && (el.group < f.groups[0] || el.group > f.groups[1])) return false;
  const year = typeof el.yearDiscovered === 'number' ? el.yearDiscovered : 0;
  if (year > 0 && (year < f.yearRange[0] || year > f.yearRange[1])) return false;
  return true;
}

export function PeriodicTable() {
  const { selectedElement, setSelectedElement, zoom, viewMode } = useUIStore();
  const { filters } = useFilterStore();
  const gridRef = useRef<HTMLDivElement>(null);

  const hasFilters =
    filters.categories.length > 0 ||
    filters.states.length > 0 ||
    filters.blocks.length > 0 ||
    filters.periods[0] !== 1 ||
    filters.periods[1] !== 7;

  // Cell size based on viewMode
  const cellSize = {
    compact:  viewMode === 'compact'  ? 44 : viewMode === 'standard' ? 56 : 68,
    standard: 56,
    detailed: 68,
  }[viewMode] * zoom;

  const gap = Math.max(2, 3 * zoom);

  const handleSelect = useCallback((el: Element) => {
    setSelectedElement(selectedElement?.atomicNumber === el.atomicNumber ? null : el);
  }, [selectedElement, setSelectedElement]);

  const handleKeyNav = useCallback(
    (e: React.KeyboardEvent, el: Element) => {
      const cell = LAYOUT.find((c) => c.n === el.atomicNumber);
      if (!cell) return;
      let target: CellDef | undefined;

      if (e.key === 'ArrowRight')
        target = LAYOUT.find((c) => c.row === cell.row && c.col === cell.col + 1);
      else if (e.key === 'ArrowLeft')
        target = LAYOUT.find((c) => c.row === cell.row && c.col === cell.col - 1);
      else if (e.key === 'ArrowDown')
        target = LAYOUT.find((c) => c.col === cell.col && c.row === cell.row + 1);
      else if (e.key === 'ArrowUp')
        target = LAYOUT.find((c) => c.col === cell.col && c.row === cell.row - 1);

      if (target) {
        e.preventDefault();
        const btn = gridRef.current?.querySelector(`[data-element="${elements[target.n - 1].symbol}"]`) as HTMLElement;
        btn?.focus();
      }
    },
    []
  );

  return (
    <div className="scroll-x px-4 pb-4" aria-label="Periodic table of elements">
      <div
        ref={gridRef}
        role="grid"
        aria-label="Periodic table grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(18, ${cellSize}px)`,
          gridTemplateRows: `repeat(10, ${cellSize * (6 / 5)}px)`,
          gap: `${gap}px`,
          width: 'max-content',
          position: 'relative',
        }}
      >
        {/* Period labels */}
        {[1,2,3,4,5,6,7].map((p) => (
          <div
            key={p}
            style={{
              gridColumn: 1,
              gridRow: p,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {p !== 1 && (
              <span
                className="text-[10px] font-semibold text-[var(--text-muted)]"
                aria-label={`Period ${p}`}
              >
                {p}
              </span>
            )}
          </div>
        ))}

        {/* Group labels */}
        {Array.from({ length: 18 }, (_, i) => i + 1).map((g) => (
          <div
            key={g}
            style={{ gridColumn: g, gridRow: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          >
            <span className="text-[9px] font-semibold text-[var(--text-muted)]">{g}</span>
          </div>
        ))}

        {/* Lanthanide / Actinide connector labels */}
        <div
          className="flex items-center justify-center text-[9px] text-[var(--text-muted)] font-medium"
          style={{ gridColumn: '1 / span 2', gridRow: 9 }}
        >
          Ln →
        </div>
        <div
          className="flex items-center justify-center text-[9px] text-[var(--text-muted)] font-medium"
          style={{ gridColumn: '1 / span 2', gridRow: 10 }}
        >
          Ac →
        </div>

        {/* Element cells */}
        {LAYOUT.map(({ n, col, row }) => {
          const el = elements[n - 1];
          const visible = !hasFilters || isElementVisible(el, filters);
          return (
            <div
              key={n}
              style={{
                gridColumn: col,
                gridRow: row,
              }}
              role="gridcell"
            >
              <ElementCard
                element={el}
                isSelected={selectedElement?.atomicNumber === n}
                isDimmed={hasFilters && !visible}
                onClick={handleSelect}
                size={viewMode === 'compact' ? 'sm' : viewMode === 'detailed' ? 'lg' : 'md'}
                onKeyDown={handleKeyNav}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
