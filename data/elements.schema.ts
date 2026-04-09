export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type ElementState = 'solid' | 'liquid' | 'gas' | 'unknown';
export type ElementBlock = 's' | 'p' | 'd' | 'f';

export interface Element {
  // Identity
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;

  // Classification
  category: ElementCategory;
  group: number | null;
  period: number;
  block: ElementBlock;

  // Physical Properties
  state: ElementState;
  density: number | null;
  meltingPoint: number | null;
  boilingPoint: number | null;

  // Electronic Structure
  electronConfiguration: string;
  electronConfigShort: string;
  electronegativity: number | null;
  ionizationEnergy: number | null;
  oxidationStates: number[];
  electronShells: number[];

  // Discovery
  discoveredBy: string;
  yearDiscovered: number | string;

  // Content
  description: string;
  funFact: string;
  realWorldUses: string[];
}

export interface CategoryInfo {
  label: string;
  bg: string;
  text: string;
  border: string;
}

export const CATEGORY_INFO: Record<ElementCategory, CategoryInfo> = {
  'alkali-metal': {
    label: 'Alkali Metal',
    bg: '#FFF3E0',
    text: '#E65100',
    border: '#FFCC80',
  },
  'alkaline-earth-metal': {
    label: 'Alkaline Earth Metal',
    bg: '#FFF8E1',
    text: '#F57F17',
    border: '#FFE082',
  },
  'transition-metal': {
    label: 'Transition Metal',
    bg: '#E3F2FD',
    text: '#1565C0',
    border: '#90CAF9',
  },
  'post-transition-metal': {
    label: 'Post-Transition Metal',
    bg: '#E8F5E9',
    text: '#2E7D32',
    border: '#A5D6A7',
  },
  metalloid: {
    label: 'Metalloid',
    bg: '#F3E5F5',
    text: '#6A1B9A',
    border: '#CE93D8',
  },
  nonmetal: {
    label: 'Nonmetal',
    bg: '#ECFDF5',
    text: '#065F46',
    border: '#6EE7B7',
  },
  halogen: {
    label: 'Halogen',
    bg: '#E0F7FA',
    text: '#006064',
    border: '#80DEEA',
  },
  'noble-gas': {
    label: 'Noble Gas',
    bg: '#EDE7F6',
    text: '#4527A0',
    border: '#B39DDB',
  },
  lanthanide: {
    label: 'Lanthanide',
    bg: '#FCE4EC',
    text: '#880E4F',
    border: '#F48FB1',
  },
  actinide: {
    label: 'Actinide',
    bg: '#FBE9E7',
    text: '#BF360C',
    border: '#FFAB91',
  },
  unknown: {
    label: 'Unknown',
    bg: '#F5F5F5',
    text: '#616161',
    border: '#BDBDBD',
  },
};
