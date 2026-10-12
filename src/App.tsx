import { useState, useEffect } from 'react';
import { 
  Trees, 
  Sparkles, 
  Compass, 
  Heart, 
  Wind, 
  BookOpen, 
  Award, 
  Sun, 
  Moon, 
  Cpu, 
  Shuffle, 
  Leaf,
  Footprints
} from 'lucide-react';
import { INITIAL_QUOTES } from './data/quotes';
import { INITIAL_MISSIONS } from './data/missions';
import { NatureQuote, TouchGrassMission, CompletedMissionLog, AiConnectionStatus } from './types';
import { HomeDashboard } from './components/HomeDashboard';
import { QuoteCard } from './components/QuoteCard';
import { LibraryView } from './components/LibraryView';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { MissionGeneratorModal } from './components/MissionGeneratorModal';
import { SoundscapePlayer } from './components/SoundscapePlayer';
import { MeditationTimer } from './components/MeditationTimer';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AiTransparencyModal } from './components/AiTransparencyModal';
import { GemmaService } from './services/gemmaService';

export default function App() {
  const [quotes, setQuotes] = useState<NatureQuote[]>(INITIAL_QUOTES);
  const [missions, setMissions] = useState<TouchGrassMission[]>(INITIAL_MISSIONS);
  
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);

  const [activeTab, setActiveTab] = useState<'home' | 'studio' | 'library' | 'breathe' | 'progress'>('home');

  // Modals state
  const [isAiQuoteModalOpen, setIsAiQuoteModalOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isAiTransparencyOpen, setIsAiTransparencyOpen] = useState(false);

  // Dark/Light theme mode state
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('touch_grass_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Local storage for Favorites & Progress
  const [favoriteQuoteIds, setFavoriteQuoteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nature_quotes_favorites');
      return stored ? JSON.parse(stored) : ['quote-1', 'quote-19', 'quote-21'];
    } catch {
      return ['quote-1', 'quote-19'];
    }
  });

  const [favoriteMissionIds, setFavoriteMissionIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nature_missions_favorites');
      return stored ? JSON.parse(stored) : ['mission-leaves-5'];
    } catch {
      return ['mission-leaves-5'];
    }
  });

  const [completedHistory, setCompletedHistory] = useState<CompletedMissionLog[]>(() => {
    try {
      const stored = localStorage.getItem('nature_missions_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [aiStatus, setAiStatus] = useState<AiConnectionStatus>({
    hasGemmaConfig: false,
    hasGeminiConfig: false,
    activeProvider: 'curated',
    gemmaModel: 'google/gemma-2-9b-it',
    gemmaEndpoint: 'unconfigured',
    isOnline: false,
    message: 'Loading model status...'
  });

  // Fetch AI status on mount
  useEffect(() => {
    GemmaService.getStatus().then(status => {
      setAiStatus(status);
    });
  }, []);

  // Save favorites & history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nature_quotes_favorites', JSON.stringify(favoriteQuoteIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteQuoteIds]);

  useEffect(() => {
    try {
      localStorage.setItem('nature_missions_favorites', JSON.stringify(favoriteMissionIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteMissionIds]);

  useEffect(() => {
    try {
      localStorage.setItem('nature_missions_history', JSON.stringify(completedHistory));
    } catch (e) {
      console.error(e);
    }
  }, [completedHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('touch_grass_theme', themeMode);
    } catch (e) {
      console.error(e);
    }
  }, [themeMode]);

  const currentQuote = quotes[currentQuoteIndex] || quotes[0];
  const currentMission = missions[currentMissionIndex] || missions[0];

  const totalOutdoorMinutes = completedHistory.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const streakDays = Math.max(1, Math.min(completedHistory.length > 0 ? Math.ceil(completedHistory.length * 0.8) : 1, 14));

  // Handlers
  const handleNextQuote = () => {
    setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    setCurrentQuoteIndex(prev => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleSurpriseMe = () => {
    const randomQuote = Math.floor(Math.random() * quotes.length);
    const randomMission = Math.floor(Math.random() * missions.length);
    setCurrentQuoteIndex(randomQuote);
    setCurrentMissionIndex(randomMission);
  };

  const handleToggleQuoteFavorite = (q: NatureQuote) => {
    setFavoriteQuoteIds(prev => 
      prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id]
    );
  };

  const handleToggleMissionFavorite = (m: TouchGrassMission) => {
    setFavoriteMissionIds(prev =>
      prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id]
    );
  };

  const handleCompleteMission = (m: TouchGrassMission) => {
    const newLog: CompletedMissionLog = {
      id: `log-${Date.now()}`,
      missionId: m.id,
      title: m.title,
      durationMinutes: m.durationMinutes,
      completedAt: new Date().toISOString(),
      location: m.location,
      activityType: m.activityType
    };
    setCompletedHistory(prev => [...prev, newLog]);
  };

  const handleQuoteGenerated = (newQuote: NatureQuote) => {
    setQuotes(prev => [newQuote, ...prev]);
    setCurrentQuoteIndex(0);
    setActiveTab('studio');
  };

  const handleMissionCreated = (newMission: TouchGrassMission) => {
    setMissions(prev => [newMission, ...prev]);
    setCurrentMissionIndex(0);
    setActiveTab('home');
  };

  const handleSelectFromLibrary = (q: NatureQuote) => {
    const idx = quotes.findIndex(item => item.id === q.id);
    if (idx !== -1) setCurrentQuoteIndex(idx);
    else {
      setQuotes(prev => [q, ...prev]);
      setCurrentQuoteIndex(0);
    }
    setActiveTab('studio');
  };

  const handleClearAllData = () => {
    setFavoriteQuoteIds([]);
    setFavoriteMissionIds([]);
    setCompletedHistory([]);
    try {
      localStorage.removeItem('nature_quotes_favorites');
      localStorage.removeItem('nature_missions_favorites');
      localStorage.removeItem('nature_missions_history');
    } catch (e) {
      console.error(e);
    }
  };

  const favoriteQuotesList = quotes.filter(q => favoriteQuoteIds.includes(q.id));
  const favoriteMissionsList = missions.filter(m => favoriteMissionIds.includes(m.id));

  // Determine root theme classes
  const isLight = themeMode === 'light';
  const rootThemeClass = isLight
    ? 'bg-amber-50 text-stone-900 selection:bg-emerald-300 selection:text-stone-900'
    : 'bg-stone-950 text-stone-100 selection:bg-emerald-500 selection:text-stone-950';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${rootThemeClass}`}>
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors ${
        isLight ? 'bg-amber-50/85 border-amber-200/80' : 'bg-stone-950/85 border-stone-800/80'
      }`}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-stone-950 shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
            <Trees size={20} className="stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-serif text-lg font-bold tracking-tight transition-colors ${
                isLight ? 'text-stone-900 group-hover:text-emerald-800' : 'text-stone-100 group-hover:text-emerald-300'
              }`}>
                Nature Quotes AI
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                Touch Grass
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-mono tracking-wider uppercase hidden sm:block">
              Hacktoberfest 2026 Edition
            </p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className={`flex items-center p-1 rounded-2xl border shadow-inner text-xs font-medium transition-colors ${
          isLight ? 'bg-stone-200/70 border-stone-300' : 'bg-stone-900/90 border-stone-800'
        }`}>
          {[
            { id: 'home', label: 'Dashboard' },
            { id: 'studio', label: 'Card Studio' },
            { id: 'library', label: 'Library' },
            { id: 'breathe', label: 'Breathe' },
            { id: 'progress', label: 'Progress' },
          ].map(tab => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-950/30'
                    : isLight
                    ? 'text-stone-600 hover:text-stone-900'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Procedural Soundscape Engine */}
          <SoundscapePlayer currentElement={currentQuote.element} />

          {/* Theme Mode Toggle (Calming Dark / Light) */}
          <button
            onClick={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              isLight
                ? 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200'
                : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-stone-100'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Calming Light'} Mode`}
            aria-label="Toggle theme mode"
          >
            {isLight ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* AI Mission Trigger */}
          <button
            onClick={() => setIsMissionModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-all cursor-pointer"
          >
            <Compass size={14} className="text-emerald-400" />
            <span>Mission</span>
          </button>

          {/* AI Oracle Trigger */}
          <button
            onClick={() => setIsAiQuoteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 text-xs font-bold shadow-md shadow-emerald-950/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">AI Quote</span>
          </button>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start">
        {activeTab === 'home' && (
          <HomeDashboard
            currentQuote={currentQuote}
            currentMission={currentMission}
            isQuoteFavorite={favoriteQuoteIds.includes(currentQuote.id)}
            isMissionFavorite={favoriteMissionIds.includes(currentMission.id)}
            completedMissionsCount={completedHistory.length}
            totalOutdoorMinutes={totalOutdoorMinutes}
            streakDays={streakDays}
            aiStatus={aiStatus}
            onNextQuote={handleNextQuote}
            onSurpriseMe={handleSurpriseMe}
            onToggleQuoteFavorite={handleToggleQuoteFavorite}
            onToggleMissionFavorite={handleToggleMissionFavorite}
            onCompleteMission={handleCompleteMission}
            onOpenMissionGenerator={() => setIsMissionModalOpen(true)}
            onOpenAiQuoteModal={() => setIsAiQuoteModalOpen(true)}
            onOpenAiTransparency={() => setIsAiTransparencyOpen(true)}
            onViewStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'studio' && (
          <div className="w-full flex flex-col items-center py-2 sm:py-6 animate-in fade-in duration-300">
            <QuoteCard
              quote={currentQuote}
              isFavorite={favoriteQuoteIds.includes(currentQuote.id)}
              onToggleFavorite={handleToggleQuoteFavorite}
              onNextQuote={handleNextQuote}
              onPrevQuote={handlePrevQuote}
              onRandomQuote={handleSurpriseMe}
              onOpenAiModal={() => setIsAiQuoteModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'library' && (
          <div className="w-full py-2 sm:py-4 animate-in fade-in duration-300">
            <LibraryView
              quotes={quotes}
              favorites={favoriteQuoteIds}
              onSelectQuote={handleSelectFromLibrary}
              onToggleFavorite={handleToggleQuoteFavorite}
              onOpenAiGenerator={() => setIsAiQuoteModalOpen(true)}
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

        {activeTab === 'progress' && (
          <div className="w-full py-4 animate-in fade-in duration-300">
            <ProgressDashboard
              favoriteQuotes={favoriteQuotesList}
              favoriteMissions={favoriteMissionsList}
              completedHistory={completedHistory}
              totalOutdoorMinutes={totalOutdoorMinutes}
              streakDays={streakDays}
              onSelectQuote={handleSelectFromLibrary}
              onRemoveFavoriteQuote={(id) => setFavoriteQuoteIds(p => p.filter(x => x !== id))}
              onRemoveFavoriteMission={(id) => setFavoriteMissionIds(p => p.filter(x => x !== id))}
              onClearAllData={handleClearAllData}
              onGoToHome={() => setActiveTab('home')}
            />
          </div>
        )}
      </main>

      {/* AI Quote Modal */}
      <AiGeneratorModal
        isOpen={isAiQuoteModalOpen}
        onClose={() => setIsAiQuoteModalOpen(false)}
        onQuoteGenerated={handleQuoteGenerated}
      />

      {/* Touch Grass Mission Modal */}
      <MissionGeneratorModal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        onMissionCreated={handleMissionCreated}
      />

      {/* AI Transparency & Privacy Modal */}
      <AiTransparencyModal
        isOpen={isAiTransparencyOpen}
        onClose={() => setIsAiTransparencyOpen(false)}
        status={aiStatus}
        onStatusUpdated={setAiStatus}
      />

      {/* Footer */}
      <footer className={`mt-auto border-t py-6 px-4 text-xs font-mono transition-colors ${
        isLight ? 'border-amber-200 text-stone-600 bg-amber-100/50' : 'border-stone-800/80 text-stone-400 bg-stone-950/60'
      }`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Nature Quotes AI — Touch Grass Edition ✦ Hacktoberfest 2026</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <button onClick={() => setIsAiTransparencyOpen(true)} className="hover:text-emerald-400 transition-colors cursor-pointer">
              AI Transparency & Privacy
            </button>
            <button onClick={() => setIsMissionModalOpen(true)} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Missions
            </button>
            <button onClick={() => setActiveTab('studio')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Studio
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
