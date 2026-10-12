import { useState } from 'react';
import { Sparkles, Trees, Waves, Mountain, Sun, CloudRain, Wind, Heart, Compass, Check, Loader2, X } from 'lucide-react';
import { NatureQuote } from '../types';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteGenerated: (quote: NatureQuote) => void;
}

export function AiGeneratorModal({ isOpen, onClose, onQuoteGenerated }: AiGeneratorModalProps) {
  const [element, setElement] = useState('forest');
  const [mood, setMood] = useState('wonder');
  const [style, setStyle] = useState('poetic');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<NatureQuote | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const elementsList = [
    { id: 'forest', label: 'Ancient Forest', icon: Trees },
    { id: 'ocean', label: 'Open Ocean', icon: Waves },
    { id: 'mountains', label: 'High Peaks', icon: Mountain },
    { id: 'sky', label: 'Cosmic Sky', icon: Sun },
    { id: 'rain', label: 'Rain & Storm', icon: CloudRain },
    { id: 'wildlife', label: 'Wildlife Solitude', icon: Compass },
  ];

  const moodsList = [
    { id: 'peace', label: 'Still Peace' },
    { id: 'wonder', label: 'Vast Wonder' },
    { id: 'resilience', label: 'Quiet Strength' },
    { id: 'healing', label: 'Deep Healing' },
    { id: 'gratitude', label: 'Warm Gratitude' },
    { id: 'mindfulness', label: 'Pure Presence' },
  ];

  const stylesList = [
    { id: 'poetic', label: 'Lyrical & Romantic (like Mary Oliver)', desc: 'Tender, intimate observation of earth' },
    { id: 'transcendental', label: 'Transcendentalist (Thoreau / Muir)', desc: 'Wild cathedral, holy solitude, rugged freedom' },
    { id: 'zen', label: 'Zen & Taoist Simplicity', desc: 'Minimalist, paradox, water flowing over stone' },
    { id: 'cosmic', label: 'Cosmic Naturalist (Carl Sagan)', desc: 'Stardust, evolutionary awe, infinite horizons' },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          element,
          mood,
          style,
          customPrompt: customPrompt.trim(),
          format: 'reflection'
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        // Choose background based on element
        let bg = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80';
        if (element === 'ocean') bg = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80';
        else if (element === 'mountains') bg = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80';
        else if (element === 'sky') bg = 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80';
        else if (element === 'rain') bg = 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1600&q=80';

        const newQuote: NatureQuote = {
          id: `ai-${Date.now()}`,
          quote: json.data.quote,
          author: json.data.author,
          element: element as any,
          mood: mood as any,
          reflection: json.data.reflection,
          keywords: json.data.keywords || ['nature', 'spirit', 'mindfulness'],
          bgImage: bg,
          suggestedPalette: json.data.suggestedPalette || 'emerald',
          isAiGenerated: true,
          dateAdded: new Date().toISOString()
        };
        setGeneratedQuote(newQuote);
      } else {
        setErrorMsg('Failed to generate quote. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error while reaching nature oracle.');
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
              AI Nature Oracle
            </h2>
            <p className="text-sm text-stone-400">
              Conjure an original poetic nature quote & contemplative guidance powered by Gemini.
            </p>
          </div>
        </div>

        {generatedQuote ? (
          /* Result View */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-stone-900 to-stone-950 border border-emerald-800/50 shadow-inner">
              <span className="inline-block text-xs uppercase tracking-widest text-emerald-400 font-mono mb-2">
                Oracle Invocation
              </span>
              <blockquote className="font-serif italic text-xl sm:text-2xl text-stone-100 leading-relaxed mb-4">
                "{generatedQuote.quote}"
              </blockquote>
              <div className="text-sm font-semibold tracking-wide text-emerald-300 mb-3">
                — {generatedQuote.author}
              </div>
              <div className="pt-3 border-t border-stone-800/80 text-sm text-stone-300 leading-relaxed">
                <span className="text-emerald-400 font-medium">Contemplation: </span>
                {generatedQuote.reflection}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {generatedQuote.keywords.map((kw, i) => (
                  <span key={i} className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                    #{kw}
                  </span>
                ))}
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
            {/* 1. Element Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                1. Nature Realm
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {elementsList.map(item => {
                  const Icon = item.icon;
                  const isSelected = element === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setElement(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950'
                          : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <Icon size={16} className={isSelected ? 'text-emerald-400' : 'text-stone-500'} />
                      <span className="font-medium truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Mood Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                2. Emotional Resonance
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {moodsList.map(item => {
                  const isSelected = mood === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMood(item.id)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-stone-950 border-emerald-400 font-semibold'
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Philosophical Lineage */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                3. Philosophical Voice
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
                      <div className={`text-sm font-semibold mb-0.5 ${isSelected ? 'text-emerald-300' : 'text-stone-300'}`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-stone-400 line-clamp-1">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Personal Prompt / Scenery Detail */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                4. Personal Scenery or Feeling (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Walking past redwoods in morning fog, or healing after a difficult week..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-stone-950 font-bold tracking-wide shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-stone-950" />
                    <span>Listening to the Wild Elements...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Nature Quote</span>
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
