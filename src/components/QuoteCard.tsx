import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  Copy, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  Shuffle, 
  Settings2, 
  Sparkles, 
  BookOpen,
  Check,
  Maximize2
} from 'lucide-react';
import { NatureQuote, CardCustomization } from '../types';
import { exportQuoteCardToImage } from '../utils/cardExport';

interface QuoteCardProps {
  quote: NatureQuote;
  isFavorite: boolean;
  onToggleFavorite: (quote: NatureQuote) => void;
  onNextQuote: () => void;
  onPrevQuote: () => void;
  onRandomQuote: () => void;
  onOpenAiModal: () => void;
}

export function QuoteCard({
  quote,
  isFavorite,
  onToggleFavorite,
  onNextQuote,
  onPrevQuote,
  onRandomQuote,
  onOpenAiModal
}: QuoteCardProps) {
  const [config, setConfig] = useState<CardCustomization>({
    layout: 'classic',
    font: 'serif',
    theme: 'forest-fog',
    showAuthor: true,
    showReflection: true,
    showWatermark: true,
    fontSize: 'lg',
    textColor: 'light',
    aspectRatio: '1:1'
  });

  const [isExporting, setIsExporting] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Font family selector class
  const getFontFamilyClass = () => {
    switch (config.font) {
      case 'display': return 'font-["Playfair_Display"]';
      case 'cinzel': return 'font-["Cinzel"]';
      case 'sans': return 'font-["Inter"]';
      case 'mono': return 'font-["JetBrains_Mono"]';
      case 'serif':
      default: return 'font-["Cormorant_Garamond"]';
    }
  };

  // Font size classes
  const getFontSizeClass = () => {
    switch (config.fontSize) {
      case 'sm': return 'text-xl sm:text-2xl leading-relaxed';
      case 'md': return 'text-2xl sm:text-3xl leading-relaxed';
      case 'lg': return 'text-2xl sm:text-4xl leading-snug';
      case 'xl': return 'text-3xl sm:text-5xl leading-tight';
    }
  };

  // Aspect ratio classes
  const getAspectRatioClass = () => {
    switch (config.aspectRatio) {
      case '4:5': return 'aspect-[4/5] max-w-md';
      case '16:9': return 'aspect-[16/9] max-w-4xl';
      case '1:1':
      default: return 'aspect-square max-w-xl';
    }
  };

  const handleCopy = async () => {
    try {
      const textToCopy = `"${quote.quote}"\n— ${quote.author}${quote.source ? ` (${quote.source})` : ''}\n\nVia Nature Quotes AI`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2400);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nature Quote',
          text: `"${quote.quote}" — ${quote.author}`,
          url: window.location.href,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const dataUrl = await exportQuoteCardToImage(quote, config);
      const link = document.createElement('a');
      link.download = `nature-quote-${quote.author.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Toast notification */}
      {copiedToast && (
        <div className="fixed top-20 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-stone-950 font-medium text-xs shadow-xl animate-in fade-in slide-in-from-top-4">
          <Check size={14} className="stroke-[3]" />
          <span>Copied wisdom to clipboard!</span>
        </div>
      )}

      {/* Main Quote Card */}
      <div 
        className={`relative w-full ${getAspectRatioClass()} rounded-3xl overflow-hidden shadow-2xl border border-stone-800/80 transition-all duration-300 group flex flex-col justify-between p-8 sm:p-12`}
        style={{
          backgroundImage: quote.bgImage ? `url(${quote.bgImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Subtle Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-900/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-stone-950/30 to-stone-950/80 pointer-events-none" />

        {/* Decorative Inner Frame Border */}
        <div className="absolute inset-4 sm:inset-6 border border-emerald-500/20 rounded-2xl pointer-events-none" />

        {/* Top Card Bar: Tags, Element badge & AI indicator */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 backdrop-blur-md">
              {quote.element}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-stone-900/70 border border-stone-700/40 text-stone-300 backdrop-blur-md hidden sm:inline-block">
              {quote.mood}
            </span>
            {quote.isAiGenerated && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-teal-500/20 text-teal-300 border border-teal-500/40 backdrop-blur-md">
                <Sparkles size={11} /> AI Oracle
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleFavorite(quote)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isFavorite 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-lg shadow-rose-950' 
                : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
            title={isFavorite ? 'Remove from Saved' : 'Save to Favorites'}
            aria-label={isFavorite ? 'Remove from saved' : 'Save quote'}
          >
            <Heart size={18} className={isFavorite ? 'fill-current text-rose-500' : ''} />
          </button>
        </div>

        {/* Center: Quote Content */}
        <div className="relative z-10 my-auto text-center px-2 sm:px-6">
          <span className="block font-serif text-emerald-400/50 text-4xl sm:text-6xl mb-1 select-none">
            “
          </span>
          <blockquote className={`${getFontFamilyClass()} ${getFontSizeClass()} text-stone-100 font-light tracking-wide italic leading-relaxed text-balance drop-shadow-md`}>
            {quote.quote}
          </blockquote>

          {config.showAuthor && (
            <div className="mt-6 flex flex-col items-center">
              <div className="w-12 h-px bg-emerald-500/50 mb-3" />
              <cite className={`${getFontFamilyClass()} not-italic text-sm sm:text-base font-semibold tracking-widest uppercase text-emerald-300 drop-shadow`}>
                — {quote.author} —
              </cite>
              {quote.source && (
                <span className="text-xs text-stone-400 font-light italic mt-1">
                  {quote.source}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Card Bar: Reflection Accordion / Watermark */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {config.showReflection && quote.reflection && (
            <div className="w-full bg-stone-950/60 border border-stone-800/80 rounded-xl p-3 backdrop-blur-md text-stone-300 text-xs sm:text-sm leading-relaxed mb-3 max-w-lg transition-all">
              <span className="text-emerald-400 font-medium font-serif italic">Reflection: </span>
              {quote.reflection}
            </div>
          )}

          {config.showWatermark && (
            <div className="text-[11px] tracking-widest uppercase font-mono text-stone-500 flex items-center gap-1.5">
              <span>Nature Quotes AI</span>
              <span>✦</span>
              <span>Living Sanctuary</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Controls Bar */}
      <div className="w-full max-w-xl mt-6 flex items-center justify-between gap-2 px-2">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 shadow-lg">
          <button
            onClick={onPrevQuote}
            className="p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Previous Quote"
            aria-label="Previous quote"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={onRandomQuote}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-emerald-300 hover:bg-emerald-950/50 transition-colors"
            title="Random Quote"
          >
            <Shuffle size={16} />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
          <button
            onClick={onNextQuote}
            className="p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Next Quote"
            aria-label="Next quote"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Studio & Utility buttons */}
        <div className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 shadow-lg">
          <button
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className={`p-2.5 rounded-xl transition-colors ${
              showConfigPanel 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
            title="Card Style & Studio"
            aria-label="Card styling options"
          >
            <Settings2 size={18} />
          </button>

          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Copy Quote Text"
            aria-label="Copy quote text"
          >
            <Copy size={18} />
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Share Quote"
            aria-label="Share quote"
          >
            <Share2 size={18} />
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Download Card as Image"
          >
            <Download size={15} />
            <span>{isExporting ? 'Exporting...' : 'Save Image'}</span>
          </button>
        </div>
      </div>

      {/* Card Styling Customization Drawer */}
      {showConfigPanel && (
        <div className="w-full max-w-xl mt-4 bg-stone-950/90 backdrop-blur-xl border border-emerald-900/40 rounded-3xl p-5 shadow-2xl text-stone-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
            <span className="font-serif text-sm font-semibold text-stone-200 flex items-center gap-2">
              <Settings2 size={16} className="text-emerald-400" /> Card Studio Settings
            </span>
            <button
              onClick={() => setShowConfigPanel(false)}
              className="text-xs text-stone-500 hover:text-stone-300 px-2 py-0.5 rounded bg-stone-900"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Font selector */}
            <div>
              <label className="block text-stone-400 uppercase tracking-wider text-[11px] font-semibold mb-1.5">
                Typography
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'serif', label: 'Garamond' },
                  { id: 'display', label: 'Playfair' },
                  { id: 'cinzel', label: 'Cinzel Roman' },
                  { id: 'sans', label: 'Inter Sans' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setConfig(prev => ({ ...prev, font: f.id as any }))}
                    className={`px-2.5 py-1.5 rounded-lg border text-left transition-colors ${
                      config.font === f.id
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-semibold'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-stone-400 uppercase tracking-wider text-[11px] font-semibold mb-1.5">
                Card Frame
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: '1:1', label: 'Square (1:1)' },
                  { id: '4:5', label: 'Story (4:5)' },
                  { id: '16:9', label: 'Banner (16:9)' },
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => setConfig(prev => ({ ...prev, aspectRatio: a.id as any }))}
                    className={`px-2 py-1.5 rounded-lg border text-center transition-colors ${
                      config.aspectRatio === a.id
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-semibold'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-stone-400 uppercase tracking-wider text-[11px] font-semibold mb-1.5">
                Quote Scale
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setConfig(prev => ({ ...prev, fontSize: s }))}
                    className={`py-1 rounded-lg border text-center uppercase tracking-wider transition-colors ${
                      config.fontSize === s
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-semibold'
                        : 'bg-stone-900 border-stone-800 text-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div>
              <label className="block text-stone-400 uppercase tracking-wider text-[11px] font-semibold mb-1.5">
                Elements Visible
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfig(p => ({ ...p, showReflection: !p.showReflection }))}
                  className={`flex-1 py-1 px-2 rounded-lg border text-center transition-colors ${
                    config.showReflection ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-stone-900 border-stone-800 text-stone-500'
                  }`}
                >
                  Reflection
                </button>
                <button
                  onClick={() => setConfig(p => ({ ...p, showAuthor: !p.showAuthor }))}
                  className={`flex-1 py-1 px-2 rounded-lg border text-center transition-colors ${
                    config.showAuthor ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-stone-900 border-stone-800 text-stone-500'
                  }`}
                >
                  Author
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
