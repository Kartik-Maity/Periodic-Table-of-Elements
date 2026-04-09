'use client';
import React from 'react';
import type { Element } from '@/data/elements.schema';
import { PropertyGrid } from '@/components/detail/PropertyGrid';
import { ElectronVisualizer } from '@/components/detail/ElectronVisualizer';
import { UseCases } from '@/components/detail/UseCases';
import { CATEGORY_INFO } from '@/data/elements.schema';
import Link from 'next/link';
import { getPreviousElement, getNextElement } from '@/lib/elements';

export function ElementPageClient({ element: el }: { element: Element }) {
  const info = CATEGORY_INFO[el.category];
  const prev = getPreviousElement(el.atomicNumber);
  const next = getNextElement(el.atomicNumber);

  return (
    <div className="space-y-8">
      {/* About */}
      <section className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">About {el.name}</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">{el.description}</p>
      </section>

      {/* Properties + Visualizer */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <PropertyGrid element={el} />
        </div>
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Electron Configuration</h2>
          <div className="space-y-3 mb-4">
            <div className="font-mono text-sm bg-[var(--bg-secondary)] px-3 py-2 rounded-[var(--radius-md)] border border-[var(--border)] break-all">
              {el.electronConfiguration}
            </div>
            <div className="font-mono text-sm bg-[var(--bg-secondary)] px-3 py-2 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--text-secondary)]">
              {el.electronConfigShort}
            </div>
          </div>
          <ElectronVisualizer element={el} />
        </div>
      </section>

      {/* Uses */}
      <section className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <UseCases element={el} />
      </section>

      {/* Fun fact */}
      <section
        className="flex gap-4 p-5 rounded-[var(--radius-lg)]"
        style={{ backgroundColor: info.bg, border: `1px solid ${info.border}` }}
      >
        <span className="text-3xl flex-shrink-0" aria-hidden="true">💡</span>
        <div>
          <h2 className="text-base font-semibold mb-1" style={{ color: info.text }}>Fun Fact</h2>
          <p className="text-sm" style={{ color: info.text + 'dd' }}>{el.funFact}</p>
        </div>
      </section>

      {/* Navigation */}
      <nav className="flex gap-3" aria-label="Navigate between elements">
        {prev ? (
          <Link href={`/element/${prev.symbol.toLowerCase()}`}
            className="flex-1 p-4 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] transition-all no-underline group">
            <div className="text-xs text-[var(--text-muted)] mb-1">← Previous</div>
            <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">{prev.name}</div>
            <div className="text-sm text-[var(--text-muted)]">{prev.symbol} · #{prev.atomicNumber}</div>
          </Link>
        ) : <div className="flex-1" />}

        <Link href="/" className="px-4 py-2 bg-[var(--accent)] text-white rounded-[var(--radius-lg)] font-medium hover:bg-[var(--accent-hover)] transition-colors no-underline self-center text-sm">
          ← All Elements
        </Link>

        {next ? (
          <Link href={`/element/${next.symbol.toLowerCase()}`}
            className="flex-1 p-4 bg-white border border-[var(--border)] rounded-[var(--radius-lg)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] transition-all no-underline group text-right">
            <div className="text-xs text-[var(--text-muted)] mb-1">Next →</div>
            <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">{next.name}</div>
            <div className="text-sm text-[var(--text-muted)]">{next.symbol} · #{next.atomicNumber}</div>
          </Link>
        ) : <div className="flex-1" />}
      </nav>
    </div>
  );
}
