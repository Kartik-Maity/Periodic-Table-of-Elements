'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import type { Element } from '@/data/elements.schema';
import { CATEGORY_INFO } from '@/data/elements.schema';
import { useUIStore } from '@/store/uiStore';
import { getPreviousElement, getNextElement, formatAtomicMass, formatTemperature, formatDensity, formatElectronegativity, formatIonizationEnergy, formatOxidationStates } from '@/lib/elements';
import { ElectronVisualizer } from './ElectronVisualizer';
import { PropertyGrid } from './PropertyGrid';
import { UseCases } from './UseCases';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';

function useIsMobile() {
  const [mobile, setMobile] = React.useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

interface ElementPanelProps {
  compareMode?: boolean;
  onCompareSelect?: (el: Element) => void;
}

export function ElementPanel({ compareMode = false, onCompareSelect }: ElementPanelProps) {
  const { selectedElement, setSelectedElement } = useUIStore();
  const el = selectedElement;
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const close = useCallback(() => setSelectedElement(null), [setSelectedElement]);

  // Close on Esc
  useEffect(() => {
    if (!el) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [el, close]);

  // Lock body scroll on mobile
  useEffect(() => {
    if (isMobile && el) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, el]);

  const prev = el ? getPreviousElement(el.atomicNumber) : undefined;
  const next = el ? getNextElement(el.atomicNumber) : undefined;

  const handleCopyLink = () => {
    if (!el) return;
    navigator.clipboard.writeText(`${window.location.origin}/element/${el.symbol.toLowerCase()}`);
  };

  const handleCompare = () => {
    if (!el) return;
    router.push(`/compare?a=${el.symbol}`);
  };

  if (!el) return null;

  const info = CATEGORY_INFO[el.category];

  const stateLabel = { solid: '🔵 Solid', liquid: '💧 Liquid', gas: '💨 Gas', unknown: '❓ Unknown' }[el.state];

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${el.name} element details`}
      className={`${isMobile ? 'panel-sheet animate-slide-in-up' : 'panel-drawer animate-slide-in-right'} flex flex-col`}
      tabIndex={-1}
    >
      {/* ① Hero */}
      <div
        className="flex-shrink-0 px-6 py-6 relative"
        style={{ backgroundColor: info.bg, borderBottom: `2px solid ${info.border}` }}
      >
        {/* Close */}
        <button
          onClick={close}
          aria-label="Close element panel"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 text-[var(--text-secondary)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Mobile drag indicator */}
        {isMobile && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-black/20" />
        )}

        <div className="flex items-start gap-5">
          {/* Big symbol */}
          <div
            className="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-[var(--radius-lg)] font-bold text-4xl shadow-sm"
            style={{ backgroundColor: info.border + '60', color: info.text }}
          >
            {el.symbol}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold" style={{ color: info.text, fontFamily: 'var(--font-title)' }}>
              {el.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-sm font-medium" style={{ color: info.text + 'cc' }}>
                #{el.atomicNumber}
              </span>
              <span className="text-sm font-medium font-mono" style={{ color: info.text + 'cc' }}>
                {formatAtomicMass(el.atomicMass)} u
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge bg={info.border + '80'} color={info.text} border={info.border}>
                {stateLabel}
              </Badge>
              <Badge bg={info.border + '80'} color={info.text} border={info.border}>
                {info.label}
              </Badge>
            </div>
            <p className="text-xs mt-2" style={{ color: info.text + 'bb' }}>
              Discovered by {el.discoveredBy}, {el.yearDiscovered}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* ② Properties Grid */}
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <PropertyGrid element={el} />
        </div>

        {/* ③ Electron Configuration */}
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Electron Configuration
          </h3>
          <div className="space-y-2">
            <div className="font-mono text-sm bg-[var(--bg-secondary)] px-3 py-2 rounded-[var(--radius-md)] border border-[var(--border)] break-all">
              {el.electronConfiguration}
            </div>
            <div className="font-mono text-sm bg-[var(--bg-secondary)] px-3 py-2 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--text-secondary)]">
              {el.electronConfigShort}
            </div>
          </div>
          <div className="mt-4">
            <ElectronVisualizer element={el} />
          </div>
        </div>

        {/* ④ Description */}
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">About</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{el.description}</p>
        </div>

        {/* ⑤ Real-world uses */}
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <UseCases element={el} />
        </div>

        {/* ⑥ Fun Fact */}
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <div
            className="flex gap-3 p-4 rounded-[var(--radius-lg)]"
            style={{ backgroundColor: info.bg, border: `1px solid ${info.border}` }}
          >
            <span className="text-2xl flex-shrink-0" aria-hidden="true">💡</span>
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: info.text }}>Fun Fact</h3>
              <p className="text-sm" style={{ color: info.text + 'dd' }}>{el.funFact}</p>
            </div>
          </div>
        </div>

        {/* ⑦ Navigation Footer */}
        <div className="px-6 py-5 space-y-3">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!prev}
              onClick={() => prev && setSelectedElement(prev)}
              aria-label={prev ? `Previous element: ${prev.name}` : 'No previous element'}
              className="flex-1"
            >
              ← {prev?.name ?? 'First'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!next}
              onClick={() => next && setSelectedElement(next)}
              aria-label={next ? `Next element: ${next.name}` : 'No next element'}
              className="flex-1"
            >
              {next?.name ?? 'Last'} →
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleCompare} className="flex-1">
              ⇄ Compare
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCopyLink}>
              🔗 Share
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push(`/element/${el.symbol.toLowerCase()}`)}
            >
              Full Page ↗
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="panel-overlay"
        onClick={close}
        aria-hidden="true"
      />
      {panel}
    </>
  );
}
