import { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { NatureQuote } from '../types';

interface MeditationTimerProps {
  quote: NatureQuote;
  onNextQuote: () => void;
}

type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';

export function MeditationTimer({ quote, onNextQuote }: MeditationTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // 4-7-8 Breathing Pattern (Inhale 4s, Hold 7s, Exhale 8s)
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition between phases
        if (phase === 'Inhale') {
          setPhase('Hold');
          return 7;
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          return 8;
        } else {
          setPhase('Inhale');
          setCyclesCompleted(c => {
            const next = c + 1;
            if (next % 2 === 0) {
              onNextQuote(); // Change quote every 2 breath cycles for fresh contemplation
            }
            return next;
          });
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, onNextQuote]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  // Ring scale calculation
  const getCircleScale = () => {
    if (!isActive) return 'scale-90';
    if (phase === 'Inhale') return 'scale-125 duration-[4000ms]';
    if (phase === 'Hold') return 'scale-125 duration-1000';
    if (phase === 'Exhale') return 'scale-85 duration-[8000ms]';
    return 'scale-90';
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-6 text-stone-100">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 mb-2">
          <Wind size={13} /> Nature Breath Sanctuary
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-100">
          Sync with the Living Earth
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-md mx-auto">
          The 4-7-8 nervous system calm technique, paired with nature's timeless wisdom.
        </p>
      </div>

      {/* Breathing Ring Orb */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-6">
        {/* Outer ambient glow */}
        <div className={`absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`} />

        {/* Concentric rings */}
        <div className="absolute inset-4 rounded-full border border-emerald-500/15" />
        <div className="absolute inset-8 rounded-full border border-emerald-500/20" />

        {/* Animated breathing circle */}
        <div 
          className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-900/60 via-teal-800/40 to-stone-900/80 border-2 border-emerald-400/50 shadow-2xl flex flex-col items-center justify-center transition-transform ease-in-out ${getCircleScale()}`}
        >
          <span className="font-serif text-2xl sm:text-3xl font-medium tracking-wide text-emerald-200">
            {isActive ? phase : 'Ready'}
          </span>
          {isActive && (
            <span className="font-mono text-3xl sm:text-4xl font-bold text-white mt-1">
              {secondsLeft}s
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 my-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isActive ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
          <span>{isActive ? 'Pause Meditation' : 'Begin Breathing'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="text-xs text-stone-400 mb-6 font-mono">
        Cycles completed: <span className="text-emerald-400 font-semibold">{cyclesCompleted}</span>
      </div>

      {/* Associated Contemplative Quote */}
      <div className="w-full max-w-lg p-6 rounded-3xl bg-stone-900/60 border border-stone-800 backdrop-blur-md text-center">
        <blockquote className="font-serif italic text-stone-200 text-base sm:text-lg leading-relaxed mb-3">
          "{quote.quote}"
        </blockquote>
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
          — {quote.author}
        </div>
        {quote.reflection && (
          <p className="mt-3 text-xs text-stone-400 border-t border-stone-800/80 pt-2.5 leading-relaxed">
            {quote.reflection}
          </p>
        )}
      </div>
    </div>
  );
}
