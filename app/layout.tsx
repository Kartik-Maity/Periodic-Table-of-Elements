import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://learnperiodic.vercel.app'),
  title: {
    default: 'Interactive Periodic Table — Learn Chemistry Online',
    template: '%s | Periodic Table',
  },
  description:
    'Explore all 118 elements with interactive details, quizzes, and electron configuration visualizers. Free for everyone.',
  keywords: [
    'periodic table', 'elements', 'chemistry', 'interactive', 'education', 'science', 'chemistry tools',
    'interactive periodic table', 'chemical elements', 'atomic number', 'atomic weight', 'electron configuration',
    'chemistry quiz', 'periodic table game', 'study chemistry', 'learn periodic table', 'mendeleev', 
    'alkali metals', 'halogens', 'noble gases', 'chemistry app', 'chemistry student resource', '3d periodic table'
  ],
  openGraph: {
    title: 'Interactive Periodic Table',
    description: 'Explore all 118 elements interactively. Free educational resource.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Interactive Periodic Table',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Periodic Table',
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
