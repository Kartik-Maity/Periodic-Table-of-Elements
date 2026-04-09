'use client';
import React from 'react';
import type { Element } from '@/data/elements.schema';
import { CATEGORY_INFO } from '@/data/elements.schema';
import {
  formatTemperature,
  formatDensity,
  formatElectronegativity,
  formatIonizationEnergy,
  formatOxidationStates,
} from '@/lib/elements';

interface PropertyGridProps {
  element: Element;
}

export function PropertyGrid({ element: el }: PropertyGridProps) {
  const info = CATEGORY_INFO[el.category];

  const props = [
    { label: 'Period',          value: String(el.period) },
    { label: 'Group',           value: el.group ? String(el.group) : 'N/A' },
    { label: 'Block',           value: el.block.toUpperCase() },
    { label: 'Category',        value: info.label },
    { label: 'Electronegativity', value: formatElectronegativity(el.electronegativity) + (el.electronegativity ? ' (Pauling)' : '') },
    { label: 'Ionization Energy', value: formatIonizationEnergy(el.ionizationEnergy) },
    { label: 'Melting Point',   value: formatTemperature(el.meltingPoint) },
    { label: 'Boiling Point',   value: formatTemperature(el.boilingPoint) },
    { label: 'Density',         value: formatDensity(el.density) },
    { label: 'Oxidation States',value: formatOxidationStates(el.oxidationStates) },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Properties</h3>
      <div className="grid grid-cols-2 gap-2">
        {props.map(({ label, value }) => (
          <div
            key={label}
            className="bg-[var(--bg-secondary)] rounded-[var(--radius-md)] px-3 py-2.5 border border-[var(--border)]"
          >
            <div className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide mb-0.5">
              {label}
            </div>
            <div className="text-sm font-medium text-[var(--text-primary)] break-words leading-snug">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
