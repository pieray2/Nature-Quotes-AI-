import { useState } from 'react';
import { 
  Sparkles, 
  Trees, 
  Waves, 
  Mountain, 
  Sun, 
  CloudRain, 
  Wind, 
  Heart, 
  Compass, 
  Check, 
  Loader2, 
  X,
  Flower2,
  Leaf,
  Feather
} from 'lucide-react';
import { NatureQuote } from '../types';
import { GemmaService } from '../services/gemmaService';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteGenerated: (quote: NatureQuote) => void;
}

export function AiGeneratorModal({ isOpen, onClose, onQuoteGenerated }: AiGeneratorModalProps) {
  const [theme, setTheme] = useState('forest');
  const [mood, setMood] = useState('reflective');
  const [style, setStyle] = useState('poetic');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<NatureQuote | null>(null);
  const [providerBadge, setProviderBadge] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const themesList = [
    { id: 'forest', label: 'Forests & Canopy', icon: Trees },
    { id: 'flowers', label: 'Flowers & Bloom', icon: Flower2 },
    { id: 'mountains', label: 'High Mountains', icon: Mountain },
    { id: 'rain', label: 'Rain & Storms', icon: CloudRain },
    { id: 'ocean', label: 'Oceans & Tides', icon: Waves },
    { id: 'wildlife', label: 'Wildlife & Wings', icon: Feather },
    { id: 'sunrise', label: 'Sunrise & Dawn', icon: Sun },
    { id: 'sustainability', label: 'Earth & Sustainability', icon: Leaf },
  ];

  const moodsList = [
    { id: 'calm', label: 'Calm', emoji: '🌿' },
    { id: 'hopeful', label: 'Hopeful', emoji: '✨' },
    { id: 'motivated', label: 'Motivated', emoji: '⚡' },
    { id: 'grateful', label: 'Grateful', emoji: '🙏' },
    { id: 'reflective', label: 'Reflective', emoji: '🪞' },
  ];

  const stylesList = [
    { id: 'poetic', label: 'Poetic & Lyrical', desc: 'Evocative imagery and soft rhythmic beauty' },
    { id: 'philosophical', label: 'Philosophical', desc: 'Timeless transcendental wisdom (Muir, Thoreau)' },
    { id: 'short and powerful', label: 'Short and Powerful', desc: 'Aphorisms that strike straight into the spirit' },
    { id: 'mindfulness', label: 'Mindfulness & Presence', desc: 'Grounded sensory awareness of the immediate moment' },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await GemmaService.generateQuote({
        theme,
        mood,
        style,
        customPrompt: customPrompt.trim()
      });

      // Background selection by theme
      let bg = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80';
      if (theme === 'ocean') bg = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80';
      else if (theme === 'mountains') bg = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80';
      else if (theme === 'flowers') bg = 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=80';
      else if (theme === 'sunrise') bg = 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1600&q=80';
      else if (theme === 'rain') bg = 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1600&q=80';

      const finalQuote: NatureQuote = {
        ...result.quote,
        bgImage: bg,
        isAiGenerated: result.isLiveAi,
        aiProvider: (result.provider as any) || 'curated'
      };

      setGeneratedQuote(finalQuote);
      setProviderBadge(
        result.isLiveAi
          ? `Generated with live ${result.provider.toUpperCase()} (${result.model || 'model'})`
          : 'Verified Curated Offline Nature Archive'
      );
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to generate quote. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedQuote) {
      onQuoteGenerated(generatedQuote);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-950 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition-colors"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-stone-100">
              AI Nature Quote Generator
            </h2>
            <p className="text-sm text-stone-400">
              Powered by Google's open-weight Gemma architecture with authentic offline fallbacks.
            </p>
          </div>
        </div>

        {generatedQuote ? (
          /* Result View */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-stone-900 to-stone-950 border border-emerald-800/50 shadow-inner">
              <span className="inline-block text-xs uppercase tracking-widest text-emerald-400 font-mono mb-2 flex items-center gap-1.5">
                <Sparkles size={13} /> {providerBadge}
              </span>
              <blockquote className="font-serif italic text-xl sm:text-2xl text-stone-100 leading-relaxed mb-4">
                "{generatedQuote.quote}"
              </blockquote>
              <div className="text-sm font-semibold tracking-wide text-emerald-300 mb-3">
                — {generatedQuote.author}
              </div>
              <div className="pt-3 border-t border-stone-800/80 text-sm text-stone-300 leading-relaxed">
                <span className="text-emerald-400 font-medium">Contemplative Meaning: </span>
                {generatedQuote.reflection}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setGeneratedQuote(null)}
                className="px-5 py-2.5 rounded-xl text-stone-300 hover:bg-stone-900 border border-stone-800 transition-colors text-sm font-medium"
              >
                Craft Another
              </button>
              <button
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <Check size={18} />
                Open in Studio
              </button>
            </div>
          </div>
        ) : (
          /* Form Configuration */
          <div className="space-y-6">
            {/* 1. Theme Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                1. Nature Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {themesList.map(item => {
                  const Icon = item.icon;
                  const isSelected = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950'
                          : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <Icon size={15} className={isSelected ? 'text-emerald-400' : 'text-stone-500'} />
                      <span className="font-medium truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Mood Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                2. Emotional Mood
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {moodsList.map(item => {
                  const isSelected = mood === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMood(item.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-stone-950 border-emerald-400 font-semibold'
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Style Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                3. Writing Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stylesList.map(item => {
                  const isSelected = style === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStyle(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 text-stone-100 shadow-md'
                          : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className={`text-xs font-semibold mb-0.5 ${isSelected ? 'text-emerald-300' : 'text-stone-300'}`}>
                        {item.label}
                      </div>
                      <div className="text-[11px] text-stone-400">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Optional Context */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                4. Specific Detail or Scenery (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Touching moss on stone after a long week of work..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {errorMsg && (
              <div className="text-rose-400 text-xs p-3 rounded-xl bg-rose-950/40 border border-rose-900">
                {errorMsg}
              </div>
            )}

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-stone-950 font-bold tracking-wide shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-stone-950" />
                    <span>Inquiring from Nature Wisdom Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Nature Quote & Reflection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
