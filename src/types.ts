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
  | 'winter'
  | 'flowers'
  | 'sunrise'
  | 'sustainability';

export type NatureMood = 
  | 'all'
  | 'calm'
  | 'hopeful'
  | 'motivated'
  | 'grateful'
  | 'gratitude'
  | 'reflective'
  | 'peace'
  | 'wonder'
  | 'resilience'
  | 'solitude'
  | 'healing'
  | 'mindfulness';

export type QuoteStyle = 
  | 'poetic'
  | 'philosophical'
  | 'short and powerful'
  | 'mindfulness';

export interface NatureQuote {
  id: string;
  quote: string;
  author: string;
  source?: string;
  element: NatureElement;
  mood: NatureMood;
  style?: QuoteStyle;
  reflection: string;
  keywords: string[];
  bgImage?: string;
  suggestedPalette?: string;
  isAiGenerated?: boolean;
  aiProvider?: 'gemma' | 'gemini' | 'curated';
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

// Touch Grass Mission Types
export type MissionDuration = 5 | 10 | 20 | 30;
export type MissionLocation = 'balcony' | 'garden' | 'park' | 'street' | 'nearby outdoor space';
export type MissionMood = 'stressed' | 'bored' | 'tired' | 'peaceful' | 'curious' | 'motivated';
export type MissionActivityType = 'mindfulness' | 'walking' | 'observation' | 'photography' | 'eco-friendly action';
export type MissionDifficulty = 'gentle' | 'moderate' | 'exploratory';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TouchGrassMission {
  id: string;
  title: string;
  instructions: string[];
  durationMinutes: MissionDuration;
  location: MissionLocation;
  mood: MissionMood;
  activityType: MissionActivityType;
  difficulty: MissionDifficulty;
  benefit: string;
  checklist: ChecklistItem[];
  isAiGenerated?: boolean;
  aiProvider?: 'gemma' | 'gemini' | 'curated';
  completedAt?: string;
  createdAt?: string;
}

export interface CompletedMissionLog {
  id: string;
  missionId: string;
  title: string;
  durationMinutes: number;
  completedAt: string;
  location: string;
  activityType: string;
}

export interface AiConnectionStatus {
  hasGemmaConfig: boolean;
  hasGeminiConfig: boolean;
  activeProvider: 'gemma' | 'gemini' | 'curated';
  gemmaModel: string;
  gemmaEndpoint: string;
  isOnline: boolean;
  latencyMs?: number;
  lastChecked?: string;
  message?: string;
}
