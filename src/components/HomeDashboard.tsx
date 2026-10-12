import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Trees, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Flame, 
  ArrowRight, 
  Sun, 
  Award, 
  ShieldCheck, 
  Shuffle, 
  Activity,
  Footprints,
  Leaf
} from 'lucide-react';
import { NatureQuote, TouchGrassMission, AiConnectionStatus } from '../types';
import { DAILY_TOUCH_GRASS_CHALLENGES } from '../data/missions';

interface HomeDashboardProps {
  currentQuote: NatureQuote;
  currentMission: TouchGrassMission;
  isQuoteFavorite: boolean;
  isMissionFavorite: boolean;
  completedMissionsCount: number;
  totalOutdoorMinutes: number;
  streakDays: number;
  aiStatus: AiConnectionStatus;
  onNextQuote: () => void;
  onSurpriseMe: () => void;
  onToggleQuoteFavorite: (q: NatureQuote) => void;
  onToggleMissionFavorite: (m: TouchGrassMission) => void;
  onCompleteMission: (m: TouchGrassMission) => void;
  onOpenMissionGenerator: () => void;
  onOpenAiQuoteModal: () => void;
  onOpenAiTransparency: () => void;
  onViewStudio: () => void;
}

export function HomeDashboard({
  currentQuote,
  currentMission,
  isQuoteFavorite,
  isMissionFavorite,
  completedMissionsCount,
  totalOutdoorMinutes,
  streakDays,
  aiStatus,
  onNextQuote,
  onSurpriseMe,
  onToggleQuoteFavorite,
  onToggleMissionFavorite,
  onCompleteMission,
  onOpenMissionGenerator,
  onOpenAiQuoteModal,
  onOpenAiTransparency,
  onViewStudio
}: HomeDashboardProps) {
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [showCelebration, setShowCelebration] = useState(false);

  // Get today's day of week challenge
  const dayIndex = new Date().getDay(); // 0 is Sunday
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayChallenge = DAILY_TOUCH_GRASS_CHALLENGES.find(c => c.day === dayNames[dayIndex]) || DAILY_TOUCH_GRASS_CHALLENGES[0];

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(`"${currentQuote.quote}"\n— ${currentQuote.author}`);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2200);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareQuote = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nature Quote',
          text: `"${currentQuote.quote}" — ${currentQuote.author}`,
          url: window.location.href
        });
      } catch {
        handleCopyQuote();
      }
    } else {
      handleCopyQuote();
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFinishMission = () => {
    onCompleteMission(currentMission);
    setShowCelebration(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {copiedQuote && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-stone-950 font-medium text-xs shadow-xl animate-in fade-in">
          <Check size={14} className="stroke-[3]" />
          <span>Copied nature quote to clipboard!</span>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/70 via-stone-900/90 to-stone-950 border border-emerald-800/40 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-emerald-900/50 border border-emerald-600/30 text-emerald-300">
              <Leaf size={13} className="text-emerald-400" />
              Hacktoberfest 2026 ✦ Touch Grass Edition
            </span>

            {/* AI Status Pill */}
            <button
              onClick={onOpenAiTransparency}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wide bg-stone-900/80 border border-stone-700/60 text-stone-300 hover:text-emerald-300 hover:border-emerald-600/50 transition-colors cursor-pointer"
              title="Click to view AI transparency and connection test"
            >
              <span className={`w-2 h-2 rounded-full ${aiStatus.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>Engine: {aiStatus.activeProvider.toUpperCase()}</span>
            </button>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-100 leading-tight">
            Reconnect With Nature, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
              One Moment at a Time.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
            Step away from the fluorescent glow and continuous notifications. Ground your senses with daily contemplative nature wisdom and real-world outdoor micro-missions.
          </p>

          <div className="flex items-center flex-wrap gap-3 pt-2">
            <button
              onClick={onOpenMissionGenerator}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Compass size={17} />
              <span>Get Outdoor Mission</span>
            </button>
            <button
              onClick={onSurpriseMe}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 text-stone-200 text-sm font-semibold transition-all hover:border-stone-600 cursor-pointer"
            >
              <Shuffle size={16} />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>

        {/* Ambient Botanical Leaf Background Decors */}
        <div className="absolute -right-8 -bottom-12 opacity-15 pointer-events-none select-none text-emerald-400">
          <Trees size={320} strokeWidth={1} />
        </div>
      </section>

      {/* Progress & Outdoor Health Metrics Ribbon */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Footprints size={20} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-100">
              {completedMissionsCount}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
              Missions Completed
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-100">
              {totalOutdoorMinutes} <span className="text-xs text-stone-400 font-normal">min</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
              Time Outdoors
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame size={20} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-100">
              {streakDays} <span className="text-xs text-stone-400 font-normal">days</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
              Daily Streak
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Award size={20} />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold font-serif text-emerald-300 truncate">
              {completedMissionsCount >= 10 ? 'Ancient Oak' : completedMissionsCount >= 5 ? 'Sapling' : completedMissionsCount >= 1 ? 'Sprout' : 'Seed'}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
              Naturalist Rank
            </div>
          </div>
        </div>
      </section>

      {/* Main Dual Cards Grid: Daily Quote & Daily Mission */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* 1. Daily Nature Quote Card */}
        <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-stone-900/70 border border-emerald-900/40 shadow-xl relative overflow-hidden group">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-950/80 border border-emerald-600/30 text-emerald-300">
                  {currentQuote.element}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono uppercase bg-stone-800 text-stone-300">
                  {currentQuote.mood}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyQuote}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                  title="Copy Quote"
                  aria-label="Copy quote"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={handleShareQuote}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                  title="Share Quote"
                  aria-label="Share quote"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => onToggleQuoteFavorite(currentQuote)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isQuoteFavorite ? 'text-rose-400 bg-rose-950/30' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                  title={isQuoteFavorite ? 'Unfavorite' : 'Favorite'}
                  aria-label="Save quote"
                >
                  <Heart size={16} className={isQuoteFavorite ? 'fill-current text-rose-500' : ''} />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <span className="font-serif text-3xl sm:text-4xl text-emerald-400/40 block -mb-2 select-none">
                “
              </span>
              <blockquote className="font-serif italic text-xl sm:text-2xl text-stone-100 leading-relaxed drop-shadow-sm">
                {currentQuote.quote}
              </blockquote>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-8 h-px bg-emerald-500/50" />
              <cite className="not-italic font-serif font-bold text-sm text-emerald-300 tracking-wide uppercase">
                — {currentQuote.author}
              </cite>
              {currentQuote.source && (
                <span className="text-xs text-stone-400 italic">
                  ({currentQuote.source})
                </span>
              )}
            </div>

            {currentQuote.reflection && (
              <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-xs text-stone-300 leading-relaxed">
                <span className="text-emerald-400 font-semibold">Reflection: </span>
                {currentQuote.reflection}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="relative z-10 pt-6 mt-4 border-t border-stone-800 flex items-center justify-between gap-2">
            <button
              onClick={onNextQuote}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Another Quote</span>
            </button>

            <button
              onClick={onViewStudio}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold group-hover:translate-x-0.5 transition-all cursor-pointer"
            >
              <span>Design in Card Studio</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 2. Daily Nature Mission Card */}
        <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-stone-900/70 border border-emerald-900/40 shadow-xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-950/80 border border-emerald-600/30 text-emerald-300 flex items-center gap-1.5">
                  <Compass size={13} /> Mission
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono uppercase bg-stone-800 text-stone-300 flex items-center gap-1">
                  <Clock size={12} /> {currentMission.durationMinutes} min
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 capitalize">
                  📍 {currentMission.location}
                </span>
                <button
                  onClick={() => onToggleMissionFavorite(currentMission)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isMissionFavorite ? 'text-rose-400 bg-rose-950/30' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                  title={isMissionFavorite ? 'Unfavorite Mission' : 'Favorite Mission'}
                  aria-label="Save mission"
                >
                  <Heart size={16} className={isMissionFavorite ? 'fill-current text-rose-500' : ''} />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-100">
                {currentMission.title}
              </h3>
              <p className="text-xs text-emerald-300/90 mt-1 leading-relaxed">
                {currentMission.benefit}
              </p>
            </div>

            {/* Step guidance */}
            <div className="space-y-1.5 text-xs text-stone-300">
              <div className="font-semibold text-stone-400 text-[11px] uppercase tracking-wider">
                Action Steps
              </div>
              <ul className="space-y-1 pl-1 list-disc list-inside text-stone-300 leading-relaxed">
                {currentMission.instructions.slice(0, 3).map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-1">
              <div className="font-semibold text-stone-400 text-[11px] uppercase tracking-wider">
                Sensory Checklist
              </div>
              <div className="space-y-1.5">
                {currentMission.checklist.map((item) => {
                  const isChecked = checklist[item.id] || false;
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer border transition-colors ${
                        isChecked 
                          ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-200 line-through' 
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded accent-emerald-500 cursor-pointer"
                      />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 mt-4 border-t border-stone-800 flex items-center justify-between gap-2">
            <button
              onClick={onOpenMissionGenerator}
              className="text-xs text-stone-400 hover:text-stone-200 transition-colors font-medium cursor-pointer"
            >
              Generate Custom →
            </button>

            <button
              onClick={handleFinishMission}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Mark Complete</span>
            </button>
          </div>
        </div>
      </section>

      {/* Daily Touch Grass Challenge Banner */}
      <section className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-emerald-950/40 border border-amber-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Sun size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                {todayChallenge.day}'s Outdoor Challenge
              </span>
            </div>
            <h4 className="font-serif text-lg font-bold text-stone-100">
              {todayChallenge.title}
            </h4>
            <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
              {todayChallenge.desc}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenMissionGenerator}
          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors shrink-0 cursor-pointer"
        >
          View More Challenges
        </button>
      </section>

      {/* Celebration Modal when mission is completed */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-stone-950 border border-emerald-600/50 rounded-3xl p-8 text-center text-stone-100 shadow-2xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-bounce">
              <Award size={32} />
            </div>
            <h3 className="font-serif text-3xl font-bold text-stone-100">
              Mission Accomplished! 🌿
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              You stepped outdoors and touched grass. Your senses are grounded, your nervous system is recalibrated, and your connection with the living world is renewed.
            </p>
            <div className="p-3 rounded-xl bg-emerald-950/50 text-emerald-300 text-xs font-mono">
              + {currentMission.durationMinutes} Minutes Outdoors Logged
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Continue Reconnecting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
