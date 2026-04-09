'use client';
import React from 'react';
import type { Element } from '@/data/elements.schema';
import { CATEGORY_INFO } from '@/data/elements.schema';
import { formatTemperature, formatDensity, formatElectronegativity, formatIonizationEnergy, formatOxidationStates } from '@/lib/elements';

interface ComparePanelProps {
  elementA: Element | null;
  elementB: Element | null;
}

type PropDef = {
  label: string;
  getValue: (e: Element) => string;
  getNum: (e: Element) => number | null;
};

const PROPS: PropDef[] = [
  { label: 'Atomic Number',      getValue: e => String(e.atomicNumber),               getNum: e => e.atomicNumber },
  { label: 'Atomic Mass (u)',     getValue: e => e.atomicMass.toFixed(3),              getNum: e => e.atomicMass },
  { label: 'Period',              getValue: e => String(e.period),                     getNum: e => e.period },
  { label: 'Group',               getValue: e => e.group ? String(e.group) : 'N/A',   getNum: e => e.group },
  { label: 'Block',               getValue: e => e.block.toUpperCase(),                getNum: () => null },
  { label: 'Category',            getValue: e => CATEGORY_INFO[e.category].label,      getNum: () => null },
  { label: 'State',               getValue: e => e.state,                              getNum: () => null },
  { label: 'Electronegativity',   getValue: e => formatElectronegativity(e.electronegativity), getNum: e => e.electronegativity },
  { label: 'Ionization Energy',   getValue: e => formatIonizationEnergy(e.ionizationEnergy),   getNum: e => e.ionizationEnergy },
  { label: 'Melting Point (K)',   getValue: e => e.meltingPoint ? `${e.meltingPoint} K` : 'N/A', getNum: e => e.meltingPoint },
  { label: 'Boiling Point (K)',   getValue: e => e.boilingPoint ? `${e.boilingPoint} K` : 'N/A', getNum: e => e.boilingPoint },
  { label: 'Density',             getValue: e => formatDensity(e.density),             getNum: e => e.density },
  { label: 'Electron Shells',     getValue: e => e.electronShells.join(', '),          getNum: e => e.electronShells.length },
  { label: 'Oxidation States',    getValue: e => formatOxidationStates(e.oxidationStates), getNum: () => null },
];

function Bar({ value, maxValue }: { value: number; maxValue: number }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden mt-1">
      <div
        className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ComparePanel({ elementA, elementB }: ComparePanelProps) {
  if (!elementA && !elementB) return null;

  const infoA = elementA ? CATEGORY_INFO[elementA.category] : null;
  const infoB = elementB ? CATEGORY_INFO[elementB.category] : null;

  return (
    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]">
      {/* Header row */}
      <div className="grid grid-cols-3 border-b border-[var(--border)]">
        <div className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-end">
          Property
        </div>
        {[elementA, elementB].map((el, i) => {
          const info = i === 0 ? infoA : infoB;
          return (
            <div key={i} className="p-4 border-l border-[var(--border)] text-center" style={{ backgroundColor: info?.bg ?? 'var(--bg-secondary)' }}>
              {el ? (
                <>
                  <div className="text-2xl font-bold" style={{ color: info?.text }}>{el.symbol}</div>
                  <div className="text-sm font-medium mt-0.5" style={{ color: info?.text + 'cc' }}>{el.name}</div>
                </>
              ) : (
                <div className="text-[var(--text-muted)] text-sm italic">Select element</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Properties */}
      {PROPS.map(({ label, getValue, getNum }) => {
        const valA = elementA ? getNum(elementA) : null;
        const valB = elementB ? getNum(elementB) : null;
        const maxVal = Math.max(valA ?? 0, valB ?? 0);
        const aHigher = valA !== null && valB !== null && valA > valB;
        const bHigher = valA !== null && valB !== null && valB > valA;

        return (
          <div key={label} className="grid grid-cols-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
            <div className="px-4 py-3 text-xs font-medium text-[var(--text-secondary)] flex items-center">
              {label}
            </div>
            {[elementA, elementB].map((el, i) => {
              const isHigher = i === 0 ? aHigher : bHigher;
              const num = el ? getNum(el) : null;
              return (
                <div
                  key={i}
                  className="px-4 py-3 border-l border-[var(--border)] text-center"
                  style={{ backgroundColor: isHigher ? 'var(--accent-light)' : undefined }}
                >
                  <span
                    className={`text-sm font-medium ${isHigher ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}
                  >
                    {el ? getValue(el) : '—'}
                  </span>
                  {num !== null && maxVal > 0 && (
                    <Bar value={num} maxValue={maxVal} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
