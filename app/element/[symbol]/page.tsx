import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getElementBySymbol, elements } from '@/lib/elements';
import { CATEGORY_INFO } from '@/data/elements.schema';
import { ElementPageClient } from '@/components/detail/ElementPageClient';

interface Props {
  params: Promise<{ symbol: string }>;
}

export async function generateStaticParams() {
  return elements.map((e) => ({ symbol: e.symbol.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  const el = getElementBySymbol(symbol);
  if (!el) return { title: 'Element Not Found' };
  return {
    title: `${el.name} (${el.symbol}) — Atomic Number ${el.atomicNumber}`,
    description: `${el.description.slice(0, 155)}… Discover properties, uses, and electron configuration of ${el.name}.`,
    openGraph: {
      title: `${el.name} (${el.symbol}) | Periodic Table`,
      description: el.description.slice(0, 200),
    },
  };
}

export default async function ElementPage({ params }: Props) {
  const { symbol } = await params;
  const el = getElementBySymbol(symbol);
  if (!el) notFound();

  const info = CATEGORY_INFO[el.category];

  return (
    <article className="max-w-3xl mx-auto px-4 py-8" itemScope itemType="https://schema.org/ChemicalElement">
      <meta itemProp="name" content={el.name} />
      <meta itemProp="alternateName" content={el.symbol} />
      <meta itemProp="atomicNumber" content={String(el.atomicNumber)} />

      {/* Hero */}
      <div
        className="flex items-start gap-6 p-6 rounded-[var(--radius-lg)] mb-8"
        style={{ backgroundColor: info.bg, border: `2px solid ${info.border}` }}
      >
        <div
          className="w-24 h-24 flex-shrink-0 flex items-center justify-center rounded-[var(--radius-lg)] font-bold text-5xl"
          style={{ backgroundColor: info.border + '60', color: info.text }}
        >
          {el.symbol}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: info.text, fontFamily: 'var(--font-title)' }}>
            {el.name}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm" style={{ color: info.text + 'cc' }}>
            <span>Atomic number: <strong>{el.atomicNumber}</strong></span>
            <span>Mass: <strong className="font-mono">{el.atomicMass}</strong> u</span>
            <span>Category: <strong>{info.label}</strong></span>
          </div>
        </div>
      </div>

      <ElementPageClient element={el} />
    </article>
  );
}
