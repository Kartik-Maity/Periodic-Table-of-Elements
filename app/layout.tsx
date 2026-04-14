import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL((process.env.NEXT_PUBLIC_SITE_URL || 'https://learnperiodic.vercel.app').replace(/\/$/, '')),
  title: {
    default: 'Learn Periodic Table — Learn Atoms Online',
    template: '%s | Periodic Table',
  },
  description:
    'EExplore the interactive periodic table with all 118 elements, atomic data, electron configurations, quizzes, and free chemistry learning tools.',
  keywords: [
    'periodic table',
    'interactive periodic table',
    'learn periodic table',
    'chemical elements',
    '118 elements',
    'chemistry learning',
    'learn chemistry online',
    'atomic number',
    'atomic mass',
    'electron configuration',
    'element facts',
    'chemistry quiz',
    'science education',
    'atoms online',
    'free chemistry tools',
  ],
  openGraph: {
    title: 'Learn Periodic Table',
    description: 'Explore all 118 elements interactively. Free educational resource.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Learn Periodic Table',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn Periodic Table',
    description: 'Explore all 118 elements with interactive details and visualizers.',
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'CjutMeNF0bgfCiegbEKMzG_lR0y9TDsc_uPXOttYqPs',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
