import type { Element, ElementCategory } from '@/data/elements.schema';
import elementsData from '@/data/elements.json';

export const elements: Element[] = elementsData as Element[];

export function getElementById(atomicNumber: number): Element | undefined {
  return elements.find((e) => e.atomicNumber === atomicNumber);
}

export function getElementBySymbol(symbol: string): Element | undefined {
  return elements.find((e) => e.symbol.toLowerCase() === symbol.toLowerCase());
}

export function getElementByName(name: string): Element | undefined {
  return elements.find((e) => e.name.toLowerCase() === name.toLowerCase());
}

export function getElementsByCategory(category: ElementCategory): Element[] {
  return elements.filter((e) => e.category === category);
}

export function getElementsByPeriod(period: number): Element[] {
  return elements.filter((e) => e.period === period);
}

export function getElementsByGroup(group: number): Element[] {
  return elements.filter((e) => e.group === group);
}

export function getElementsByBlock(block: 's' | 'p' | 'd' | 'f'): Element[] {
  return elements.filter((e) => e.block === block);
}

export function getElementsByState(state: 'solid' | 'liquid' | 'gas' | 'unknown'): Element[] {
  return elements.filter((e) => e.state === state);
}

export function getPreviousElement(atomicNumber: number): Element | undefined {
  return atomicNumber > 1 ? getElementById(atomicNumber - 1) : undefined;
}

export function getNextElement(atomicNumber: number): Element | undefined {
  return atomicNumber < 118 ? getElementById(atomicNumber + 1) : undefined;
}

export function formatAtomicMass(mass: number): string {
  return mass.toFixed(3);
}

export function formatTemperature(k: number | null): string {
  if (k === null) return 'Unknown';
  const celsius = k - 273.15;
  return `${k.toFixed(0)} K (${celsius.toFixed(0)}°C)`;
}

export function formatDensity(density: number | null): string {
  if (density === null) return 'Unknown';
  if (density < 0.01) return `${(density * 1000).toFixed(3)} g/L`;
  return `${density} g/cm³`;
}

export function formatElectronegativity(en: number | null): string {
  if (en === null) return 'N/A';
  return en.toFixed(2);
}

export function formatIonizationEnergy(ie: number | null): string {
  if (ie === null) return 'Unknown';
  return `${ie} kJ/mol`;
}

export function formatOxidationStates(states: number[]): string {
  if (states.length === 0) return 'None';
  return states.map((s) => (s > 0 ? `+${s}` : `${s}`)).join(', ');
}

export const ALL_CATEGORIES: ElementCategory[] = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'nonmetal',
  'halogen',
  'noble-gas',
  'lanthanide',
  'actinide',
  'unknown',
];
