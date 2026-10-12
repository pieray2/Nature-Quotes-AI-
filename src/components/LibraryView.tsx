import { useState } from 'react';
import { Search, Trees, Waves, Mountain, Sun, CloudRain, Droplets, Feather, Snowflake, Sparkles, Heart, Copy, Check } from 'lucide-react';
import { NatureQuote, NatureElement, NatureMood } from '../types';
import { ELEMENT_METADATA, MOOD_METADATA } from '../data/quotes';

interface LibraryViewProps {
  quotes: NatureQuote[];
  favorites: string[];
  onSelectQuote: (quote: NatureQuote) => void;
  onToggleFavorite: (quote: NatureQuote) => void;
  onOpenAiGenerator: () => void;
}

export function LibraryView({
  quotes,
  favorites,
  onSelectQuote,
  onToggleFavorite,
  onOpenAiGenerator
}: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<NatureElement>('all');
  const [selectedMood, setSelectedMood] = useState<NatureMood>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredQuotes = quotes.filter(q => {
    const matchesElement = selectedElement === 'all' || q.element === selectedElement;
    const matchesMood = selectedMood === 'all' || q.mood === selectedMood;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      q.quote.toLowerCase().includes(query) ||
      q.author.toLowerCase().includes(query) ||
      (q.reflection && q.reflection.toLowerCase().includes(query)) ||
      (q.keywords && q.keywords.some(k => k.toLowerCase().includes(query)));

    return matchesElement && matchesMood && matchesSearch;
  });

  const handleCopyQuote = async (e: React.MouseEvent, q: NatureQuote) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`"${q.quote}" — ${q.author}`);
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Search & AI Banner */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quotes, authors (Muir, Carson, Thoreau), or themes..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-900/80 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 backdrop-blur-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200 px-2 py-0.5 rounded bg-stone-800"
            >
              Clear
            </button>
          )}
        </div>

        {/* AI Generator CTA */}
        <button
          onClick={onOpenAiGenerator}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-stone-950 font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Sparkles size={16} />
          <span>Ask AI Oracle</span>
        </button>
      </div>

      {/* Filter Tabs: Elements */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {ELEMENT_METADATA.map(item => {
            const isSelected = selectedElement === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedElement(item.id as NatureElement)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-stone-950 border-emerald-400 font-semibold shadow-md shadow-emerald-950'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs: Moods */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {MOOD_METADATA.map(item => {
            const isSelected = selectedMood === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedMood(item.id as NatureMood)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quotes Count Header */}
      <div className="flex items-center justify-between text-xs text-stone-400 px-1 pt-1">
        <span>Showing {filteredQuotes.length} sanctuary reflections</span>
        {(selectedElement !== 'all' || selectedMood !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedElement('all');
              setSelectedMood('all');
              setSearchQuery('');
            }}
            className="text-emerald-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Quote Grid */}
      {filteredQuotes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-stone-900/30 border border-stone-800 text-stone-400 space-y-3">
          <p className="font-serif italic text-lg text-stone-300">
            No nature quotes match your current filter.
          </p>
          <p className="text-xs text-stone-500">
            Try choosing a different element, or invoke the AI Oracle to compose one for you.
          </p>
          <button
            onClick={onOpenAiGenerator}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-stone-950 text-xs font-semibold cursor-pointer"
          >
            <Sparkles size={14} /> Generate with AI
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuotes.map(q => {
            const isFav = favorites.includes(q.id);
            const isCopied = copiedId === q.id;

            return (
              <div
                key={q.id}
                onClick={() => onSelectQuote(q)}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-stone-900/60 hover:bg-stone-900 border border-stone-800 hover:border-emerald-700/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-950/30 hover:-translate-y-1"
              >
                {/* Element & Favorite Toolbar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-stone-800 text-emerald-400 border border-emerald-900/40">
                      {q.element}
                    </span>
                    {q.isAiGenerated && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                        AI
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleCopyQuote(e, q)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                      title="Copy Quote"
                    >
                      {isCopied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(q);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav ? 'text-rose-500 hover:text-rose-400' : 'text-stone-400 hover:text-stone-200'
                      }`}
                      title={isFav ? 'Unfavorite' : 'Favorite'}
                    >
                      <Heart size={15} className={isFav ? 'fill-current' : ''} />
                    </button>
                  </div>
                </div>

                {/* Quote Text */}
                <blockquote className="font-serif italic text-stone-100 text-lg leading-relaxed mb-4 group-hover:text-emerald-100 transition-colors">
                  "{q.quote}"
                </blockquote>

                {/* Author & Footer */}
                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-300 uppercase tracking-wide">
                    — {q.author}
                  </span>
                  <span className="text-stone-500 group-hover:text-emerald-400 transition-colors font-medium">
                    View in Studio →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
