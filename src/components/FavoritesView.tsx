import { Heart, Copy, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { NatureQuote } from '../types';

interface FavoritesViewProps {
  favoriteQuotes: NatureQuote[];
  onSelectQuote: (quote: NatureQuote) => void;
  onRemoveFavorite: (quoteId: string) => void;
  onGoToExplore: () => void;
}

export function FavoritesView({
  favoriteQuotes,
  onSelectQuote,
  onRemoveFavorite,
  onGoToExplore
}: FavoritesViewProps) {
  const handleCopy = async (q: NatureQuote) => {
    try {
      await navigator.clipboard.writeText(`"${q.quote}" — ${q.author}`);
    } catch (e) {
      console.error(e);
    }
  };

  if (favoriteQuotes.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-6 text-center rounded-3xl bg-stone-900/40 border border-stone-800 text-stone-300 space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
          <Heart size={24} />
        </div>
        <h3 className="font-serif text-2xl font-semibold text-stone-100">
          No Saved Quotes Yet
        </h3>
        <p className="text-sm text-stone-400 max-w-md mx-auto">
          Tap the heart icon on any nature quote or oracle reflection to save it to your personal sanctuary treasury.
        </p>
        <button
          onClick={onGoToExplore}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          <span>Explore Nature Quotes</span>
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-stone-800">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-stone-100 flex items-center gap-2">
            <Heart size={20} className="text-rose-500 fill-current" />
            Saved Nature Treasury
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            {favoriteQuotes.length} cherished reflections saved locally in your browser.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favoriteQuotes.map(q => (
          <div
            key={q.id}
            onClick={() => onSelectQuote(q)}
            className="group relative flex flex-col justify-between p-6 rounded-3xl bg-stone-900/70 hover:bg-stone-900 border border-stone-800 hover:border-emerald-600/50 transition-all cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                  {q.element}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(q);
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                    title="Copy Quote"
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(q.id);
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <blockquote className="font-serif italic text-stone-100 text-lg leading-relaxed mb-4">
                "{q.quote}"
              </blockquote>
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-400 uppercase tracking-wide">
                — {q.author}
              </span>
              <span className="text-stone-400 group-hover:text-stone-200 font-medium">
                Open in Studio →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
