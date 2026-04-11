import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-8">
      <div className="max-w-screen-2xl mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-16">
          
          {/* Brand section */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div>
              <h3 className="font-bold text-xl text-[var(--text-primary)] tracking-tight mb-1" style={{ fontFamily: 'var(--font-title)' }}>
                Periodic Table <span className="text-[var(--accent)]">Pro</span>
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto md:mx-0">
                A modern, interactive, and highly visual way to explore chemical elements, test your knowledge, and compare properties. Make chemistry simple and engaging.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4 text-center md:text-left md:pl-10">
            <h4 className="font-semibold text-base text-[var(--text-primary)]">Quick Links</h4>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {[
                { href: '/', label: 'Interactive Table' },
                { href: '/quiz', label: 'Knowledge Quiz' },
                { href: '/compare', label: 'Compare Elements' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] font-medium transition-colors w-fit mx-auto md:mx-0 no-underline hover:underline">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Credits & Info */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h4 className="font-semibold text-base text-[var(--text-primary)]">Creator</h4>
            <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <div className="p-3 bg-white rounded-lg shadow-sm border border-[var(--border)] inline-block w-fit mx-auto md:mx-0">
                <p className="text-sm">
                  Designed & Developed by <br/>
                  <a href="/creator.jpg" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--accent)] text-base hover:underline transition-colors block mt-0.5">
                    Kartik Maity
                  </a>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} Learn Periodic Table. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Built with Modern Web Tech</span>
            <span className="text-[var(--accent)] text-lg leading-none mt-0.5">⚛</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
