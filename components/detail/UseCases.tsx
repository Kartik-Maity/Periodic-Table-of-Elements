'use client';
import React from 'react';
import type { Element } from '@/data/elements.schema';

const USE_ICONS: Record<string, string> = {
  'battery': '🔋', 'batteries': '🔋',
  'light': '💡', 'lighting': '💡', 'lamps': '💡', 'lamp': '💡',
  'rocket': '🚀', 'fuel': '⛽', 'nuclear': '☢️',
  'medicine': '💊', 'medical': '🏥', 'therapy': '🏥', 'treatment': '🏥',
  'computer': '💻', 'semiconductor': '💻', 'electronics': '💻', 'chip': '💻',
  'steel': '🏗️', 'construction': '🏗️', 'alloy': '⚙️', 'alloys': '⚙️',
  'glass': '🪟', 'jewellery': '💍', 'jewelry': '💍', 'coin': '🪙', 'coins': '🪙',
  'food': '🍽️', 'fertilizer': '🌱', 'fertilizers': '🌱', 'plant': '🌿',
  'water': '💧', 'purification': '💧',
  'aircraft': '✈️', 'aerospace': '✈️', 'jet': '✈️',
  'solar': '☀️', 'photovoltaic': '☀️',
  'magnet': '🧲', 'magnets': '🧲',
  'catalyst': '⚗️', 'catalysts': '⚗️',
  'wire': '🔌', 'wiring': '🔌', 'electrical': '🔌',
  'fireworks': '🎆', 'pigment': '🎨', 'pigments': '🎨', 'colour': '🎨', 'color': '🎨',
  'default': '🔬',
};

function getIcon(use: string): string {
  const lower = use.toLowerCase();
  for (const [key, icon] of Object.entries(USE_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return USE_ICONS.default;
}

interface UseCasesProps {
  element: Element;
}

export function UseCases({ element }: UseCasesProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Real-World Uses</h3>
      <div className="grid grid-cols-2 gap-2">
        {element.realWorldUses.map((use) => (
          <div
            key={use}
            className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-md)] px-3 py-2"
          >
            <span className="text-lg flex-shrink-0" aria-hidden="true">{getIcon(use)}</span>
            <span className="text-sm text-[var(--text-primary)] leading-snug">{use}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
