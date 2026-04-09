import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Element } from '@/data/elements.schema';
import { elements } from '@/lib/elements';

const fuseOptions: IFuseOptions<Element> = {
  includeScore: true,
  threshold: 0.3,
  minMatchCharLength: 1,
  keys: [
    { name: 'atomicNumber', weight: 3 },
    { name: 'symbol', weight: 3 },
    { name: 'name', weight: 2 },
    { name: 'category', weight: 1 },
    { name: 'description', weight: 0.5 },
    { name: 'realWorldUses', weight: 0.5 },
  ],
};

let fuseInstance: Fuse<Element> | null = null;

export function getFuseInstance(): Fuse<Element> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(elements, fuseOptions);
  }
  return fuseInstance;
}

export interface SearchResult {
  element: Element;
  score: number;
}

export function searchElements(query: string, limit = 8): SearchResult[] {
  if (!query.trim()) return [];

  // Exact match by atomic number
  const numQuery = parseInt(query, 10);
  if (!isNaN(numQuery)) {
    const exact = elements.find((e) => e.atomicNumber === numQuery);
    if (exact) {
      return [{ element: exact, score: 1 }];
    }
  }

  // Exact match by symbol (case-insensitive)
  const symbolMatch = elements.find(
    (e) => e.symbol.toLowerCase() === query.toLowerCase()
  );
  if (symbolMatch) {
    return [{ element: symbolMatch, score: 1 }];
  }

  const fuse = getFuseInstance();
  const results = fuse.search(query, { limit });

  return results.map((r) => ({
    element: r.item,
    score: 1 - (r.score ?? 0),
  }));
}
