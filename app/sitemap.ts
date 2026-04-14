import { MetadataRoute } from 'next';
import elementsData from '@/data/elements.json';

type Element = {
  symbol: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'learnperiodic.vercel.app';
  const baseUrl = host.startsWith('http') ? host.replace(/\/$/, '') : `https://${host}`;

  const elements = elementsData as Element[];
  const lastModified = new Date().toISOString().split('T')[0];

  const staticRoutes = ['', '/compare', '/quiz'].map((route) => ({
    url: `${baseUrl}${route}${route === '' ? '/' : ''}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const dynamicRoutes = elements.map((element) => ({
    url: `${baseUrl}/element/${element.symbol.toLowerCase()}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
