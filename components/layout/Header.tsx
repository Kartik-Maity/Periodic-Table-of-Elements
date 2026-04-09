'use client';
import React from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';

export function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[var(--border)] shadow-[var(--shadow-sm)]"
      style={{ height: 'var(--header-height)' }}
    >
      <div className="max-w-screen-2xl mx-auto h-full px-4 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 no-underline hover:no-underline"
          aria-label="Interactive Periodic Table - Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm font-mono flex-shrink-0">
            Pt
          </div>
          <span
            className="hidden sm:block font-bold text-[var(--text-primary)] text-base leading-tight"
            style={{ fontFamily: 'var(--font-title)' }}
          >
            Periodic Table
          </span>
        </Link>

        {/* Search - center */}
        <div className="flex-1 flex justify-center max-w-md mx-auto">
          <SearchBar />
        </div>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {[
            { href: '/',        label: 'Table' },
            { href: '/quiz',    label: 'Quiz' },
            { href: '/compare', label: 'Compare' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] transition-colors no-underline hover:no-underline"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[var(--border)] shadow-[var(--shadow-md)] py-2 z-40">
          {[
            { href: '/',        label: '🏠 Table' },
            { href: '/quiz',    label: '🎯 Quiz' },
            { href: '/compare', label: '⇄ Compare' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] no-underline hover:no-underline"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
