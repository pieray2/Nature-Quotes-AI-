import { useState, useEffect } from 'react';
import { 
  Trees, 
  Sparkles, 
  Compass, 
  Heart, 
  Wind, 
  BookOpen, 
  Flame, 
  Sliders,
  Calendar,
  Share2
} from 'lucide-react';
import { INITIAL_QUOTES } from './data/quotes';
import { NatureQuote } from './types';
import { QuoteCard } from './components/QuoteCard';
import { LibraryView } from './components/LibraryView';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { SoundscapePlayer } from './components/SoundscapePlayer';
import { MeditationTimer } from './components/MeditationTimer';
import { FavoritesView } from './components/FavoritesView';

export default function App() {
  const [quotes, setQuotes] = useState<NatureQuote[]>(INITIAL_QUOTES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'studio' | 'explore' | 'breathe' | 'saved'>('studio');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nature_quotes_favorites');
      return stored ? JSON.parse(stored) : ['quote-1', 'quote-5'];
    } catch {
      return ['quote-1', 'quote-5'];
    }
  });

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('nature_quotes_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const currentQuote = quotes[currentIndex] || quotes[0];

  const handleNextQuote = () => {
    setCurrentIndex(prev => (prev + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    setCurrentIndex(prev => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentIndex(randomIndex);
  };

  const handleToggleFavorite = (quote: NatureQuote) => {
    setFavorites(prev => {
      if (prev.includes(quote.id)) {
        return prev.filter(id => id !== quote.id);
      } else {
        return [...prev, quote.id];
      }
    });
  };

  const handleRemoveFavorite = (quoteId: string) => {
    setFavorites(prev => prev.filter(id => id !== quoteId));
  };

  const handleQuoteGenerated = (newQuote: NatureQuote) => {
    setQuotes(prev => [newQuote, ...prev]);
    setCurrentIndex(0);
    setActiveTab('studio');
  };

  const handleSelectFromLibrary = (quote: NatureQuote) => {
    const index = quotes.findIndex(q => q.id === quote.id);
    if (index !== -1) {
      setCurrentIndex(index);
    } else {
      setQuotes(prev => [quote, ...prev]);
      setCurrentIndex(0);
    }
    setActiveTab('studio');
  };

  const favoriteQuotesList = quotes.filter(q => favorites.includes(q.id));

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-emerald-500 selection:text-stone-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-stone-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('studio')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-stone-950 shadow-md shadow-emerald-950 group-hover:scale-105 transition-transform">
            <Trees size={20} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-stone-100 group-hover:text-emerald-300 transition-colors">
              Nature Quotes <span className="text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 ml-1">AI</span>
            </span>
            <p className="text-[10px] text-stone-400 font-mono tracking-wider uppercase hidden sm:block">
              Sanctuary of Natural Wisdom
            </p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="flex items-center bg-stone-900/90 border border-stone-800 p-1 rounded-2xl shadow-inner text-xs font-medium">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-emerald-500 text-stone-950 font-semibold shadow-md shadow-emerald-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-emerald-500 text-stone-950 font-semibold shadow-md shadow-emerald-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab('breathe')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'breathe'
                ? 'bg-emerald-500 text-stone-950 font-semibold shadow-md shadow-emerald-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Wind size={13} />
            <span className="hidden sm:inline">Breathe</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-emerald-500 text-stone-950 font-semibold shadow-md shadow-emerald-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Heart size={13} className={favorites.length > 0 ? 'text-rose-400' : ''} />
            <span className="hidden sm:inline">Saved</span>
            <span className="text-[10px] bg-stone-800 px-1.5 py-0.2 rounded-full text-stone-300">
              {favorites.length}
            </span>
          </button>
        </nav>

        {/* Right Tools: Ambient Audio & AI Oracle */}
        <div className="flex items-center gap-2">
          {/* Procedural Soundscape Engine */}
          <SoundscapePlayer currentElement={currentQuote.element} />

          {/* AI Oracle trigger */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-all text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            title="Ask AI Nature Oracle"
          >
            <Sparkles size={14} className="text-emerald-400" />
            <span className="hidden md:inline">AI Oracle</span>
          </button>
        </div>
      </header>

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start">
        {activeTab === 'studio' && (
          <div className="w-full flex flex-col items-center py-2 sm:py-6 animate-in fade-in duration-300">
            <QuoteCard
              quote={currentQuote}
              isFavorite={favorites.includes(currentQuote.id)}
              onToggleFavorite={handleToggleFavorite}
              onNextQuote={handleNextQuote}
              onPrevQuote={handlePrevQuote}
              onRandomQuote={handleRandomQuote}
              onOpenAiModal={() => setIsAiModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="w-full py-2 sm:py-4 animate-in fade-in duration-300">
            <LibraryView
              quotes={quotes}
              favorites={favorites}
              onSelectQuote={handleSelectFromLibrary}
              onToggleFavorite={handleToggleFavorite}
              onOpenAiGenerator={() => setIsAiModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'breathe' && (
          <div className="w-full py-4 animate-in fade-in duration-300">
            <MeditationTimer
              quote={currentQuote}
              onNextQuote={handleNextQuote}
            />
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="w-full py-4 animate-in fade-in duration-300">
            <FavoritesView
              favoriteQuotes={favoriteQuotesList}
              onSelectQuote={handleSelectFromLibrary}
              onRemoveFavorite={handleRemoveFavorite}
              onGoToExplore={() => setActiveTab('explore')}
            />
          </div>
        )}
      </main>

      {/* AI Nature Oracle Modal Dialog */}
      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onQuoteGenerated={handleQuoteGenerated}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800/60 py-6 px-4 text-center text-xs text-stone-400 font-mono">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Nature Quotes AI ✦ Powered by Google Gemini</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <button onClick={() => setActiveTab('studio')} className="hover:text-emerald-300 transition-colors">Studio</button>
            <button onClick={() => setActiveTab('explore')} className="hover:text-emerald-300 transition-colors">Library</button>
            <button onClick={() => setActiveTab('breathe')} className="hover:text-emerald-300 transition-colors">Breathe</button>
            <button onClick={() => setIsAiModalOpen(true)} className="hover:text-emerald-300 transition-colors">AI Oracle</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
