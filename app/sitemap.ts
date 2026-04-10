import { MetadataRoute } from 'next';
import elementsData from '@/data/elements.json';

type Element = {
  symbol: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const elements = elementsData as Element[];

  const staticRoutes = ['', '/compare', '/quiz'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const dynamicRoutes = elements.map((element) => ({
    url: `${baseUrl}/element/${element.symbol.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
