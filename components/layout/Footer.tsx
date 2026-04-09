import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-8">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="font-bold text-[var(--text-primary)] mb-0.5" style={{ fontFamily: 'var(--font-title)' }}>
            Interactive Periodic Table
          </div>
          <p className="text-xs text-[var(--text-muted)]">Make chemistry simple, visual, and engaging.</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="Footer navigation">
          {[
            { href: '/', label: 'Table' },
            { href: '/quiz', label: 'Quiz' },
            { href: '/compare', label: 'Compare' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors no-underline">
              {label}
            </Link>
          ))}
        </nav>

        <div className="text-center sm:text-right">
          <p className="text-xs text-[var(--text-muted)]">Element data sourced from IUPAC</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">© {new Date().getFullYear()} Interactive Periodic Table</p>
        </div>
      </div>
    </footer>
  );
}
