export type NatureElement = 
  | 'all'
  | 'forest'
  | 'ocean'
  | 'mountains'
  | 'sky'
  | 'rain'
  | 'meadow'
  | 'wildlife'
  | 'river'
  | 'winter';

export type NatureMood = 
  | 'all'
  | 'peace'
  | 'wonder'
  | 'resilience'
  | 'solitude'
  | 'healing'
  | 'gratitude'
  | 'mindfulness';

export interface NatureQuote {
  id: string;
  quote: string;
  author: string;
  source?: string;
  element: NatureElement;
  mood: NatureMood;
  reflection: string;
  keywords: string[];
  bgImage?: string;
  suggestedPalette?: string;
  isAiGenerated?: boolean;
  dateAdded?: string;
}

export type CardLayout = 'classic' | 'modern' | 'zen' | 'editorial' | 'postcard';
export type CardFont = 'serif' | 'display' | 'sans' | 'cinzel' | 'mono';
export type CardTheme = 'forest-fog' | 'ocean-deep' | 'mountain-sunrise' | 'starlight' | 'autumn-gold' | 'monochrome-zen' | 'emerald-glass' | 'parchment';

export interface CardCustomization {
  layout: CardLayout;
  font: CardFont;
  theme: CardTheme;
  showAuthor: boolean;
  showReflection: boolean;
  showWatermark: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  textColor: 'light' | 'dark';
  aspectRatio: '1:1' | '4:5' | '16:9';
}

export interface SoundPreset {
  id: string;
  name: string;
  icon: string;
  volumes: {
    wind: number;
    rain: number;
    waves: number;
    birds: number;
    fire: number;
    stream: number;
  };
}
