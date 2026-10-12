import { useState } from 'react';
import { 
  Heart, 
  CheckCircle2, 
  Trash2, 
  Calendar, 
  Clock, 
  Footprints, 
  Award, 
  AlertTriangle,
  Compass,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { NatureQuote, TouchGrassMission, CompletedMissionLog } from '../types';

interface ProgressDashboardProps {
  favoriteQuotes: NatureQuote[];
  favoriteMissions: TouchGrassMission[];
  completedHistory: CompletedMissionLog[];
  totalOutdoorMinutes: number;
  streakDays: number;
  onSelectQuote: (q: NatureQuote) => void;
  onRemoveFavoriteQuote: (id: string) => void;
  onRemoveFavoriteMission: (id: string) => void;
  onClearAllData: () => void;
  onGoToHome: () => void;
}

export function ProgressDashboard({
  favoriteQuotes,
  favoriteMissions,
  completedHistory,
  totalOutdoorMinutes,
  streakDays,
  onSelectQuote,
  onRemoveFavoriteQuote,
  onRemoveFavoriteMission,
  onClearAllData,
  onGoToHome
}: ProgressDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'quotes' | 'missions' | 'history'>('overview');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (q: NatureQuote) => {
    try {
      await navigator.clipboard.writeText(`"${q.quote}" — ${q.author}`);
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="font-serif text-3xl font-bold text-stone-100 flex items-center gap-2.5">
            <Award className="text-emerald-400" size={28} />
            <span>Outdoor Sanctuary & Progress</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Tracking your journey away from screens and into the living wild.
          </p>
        </div>

        {/* Clear All Data Button */}
        <button
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-rose-400 hover:border-rose-900/60 text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Trash2 size={13} />
          <span>Reset Local Data</span>
        </button>
      </div>

      {/* Sub navigation bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-emerald-500 text-stone-950 shadow-md'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200'
          }`}
        >
          Overview & Stats
        </button>
        <button
          onClick={() => setActiveSubTab('quotes')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'quotes'
              ? 'bg-emerald-500 text-stone-950 shadow-md'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Heart size={13} />
          <span>Saved Quotes ({favoriteQuotes.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('missions')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'missions'
              ? 'bg-emerald-500 text-stone-950 shadow-md'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Compass size={13} />
          <span>Saved Missions ({favoriteMissions.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'history'
              ? 'bg-emerald-500 text-stone-950 shadow-md'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200'
          }`}
        >
          <CheckCircle2 size={13} />
          <span>History Log ({completedHistory.length})</span>
        </button>
      </div>

      {/* VIEW 1: Overview & Stats */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-stone-900/70 border border-stone-800 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono">
                Total Outdoor Immersion
              </span>
              <div className="my-4">
                <span className="font-mono text-4xl sm:text-5xl font-bold text-emerald-400">
                  {totalOutdoorMinutes}
                </span>
                <span className="text-stone-400 text-sm ml-2">minutes</span>
              </div>
              <p className="text-xs text-stone-400">
                Equivalent to {(totalOutdoorMinutes / 60).toFixed(1)} hours of screen-free outdoor vitality.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900/70 border border-stone-800 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono">
                Completed Touch Grass Missions
              </span>
              <div className="my-4">
                <span className="font-mono text-4xl sm:text-5xl font-bold text-teal-300">
                  {completedHistory.length}
                </span>
                <span className="text-stone-400 text-sm ml-2">adventures</span>
              </div>
              <p className="text-xs text-stone-400">
                Grounding sensory missions in parks, gardens, balconies, and trails.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900/70 border border-stone-800 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono">
                Daily Outdoor Streak
              </span>
              <div className="my-4">
                <span className="font-mono text-4xl sm:text-5xl font-bold text-amber-400">
                  {streakDays}
                </span>
                <span className="text-stone-400 text-sm ml-2">consecutive days</span>
              </div>
              <p className="text-xs text-stone-400">
                Daily continuity is the secret of natural restoration.
              </p>
            </div>
          </div>

          {/* Quick recents */}
          <div className="p-6 rounded-3xl bg-stone-900/50 border border-stone-800 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-200">
              Recent Touch Grass Missions
            </h3>
            {completedHistory.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-4">
                No missions logged yet. Head to the dashboard to begin your first outdoor exploration!
              </p>
            ) : (
              <div className="space-y-2">
                {completedHistory.slice(-4).reverse().map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <div>
                        <div className="font-medium text-stone-200">{item.title}</div>
                        <div className="text-[11px] text-stone-400">
                          {new Date(item.completedAt).toLocaleDateString()} ✦ {item.durationMinutes} min ({item.location})
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] uppercase font-mono">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: Saved Quotes */}
      {activeSubTab === 'quotes' && (
        <div className="space-y-4">
          {favoriteQuotes.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-stone-900/40 border border-stone-800 text-stone-400 space-y-3">
              <Heart size={32} className="mx-auto text-stone-600" />
              <p className="font-serif text-lg text-stone-300">No saved quotes yet.</p>
              <p className="text-xs text-stone-500">Tap the heart icon on any nature quote to save it here.</p>
              <button
                onClick={onGoToHome}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-stone-950 text-xs font-semibold cursor-pointer"
              >
                <span>Browse Nature Quotes</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteQuotes.map(q => (
                <div
                  key={q.id}
                  onClick={() => onSelectQuote(q)}
                  className="group relative flex flex-col justify-between p-6 rounded-3xl bg-stone-900/70 hover:bg-stone-900 border border-stone-800 hover:border-emerald-600/50 transition-all cursor-pointer shadow-lg"
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
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 transition-colors"
                          title="Copy"
                        >
                          {copiedId === q.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFavoriteQuote(q.id);
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <blockquote className="font-serif italic text-stone-100 text-lg leading-relaxed mb-4">
                      "{q.quote}"
                    </blockquote>
                  </div>
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400 uppercase tracking-wide">— {q.author}</span>
                    <span className="text-stone-400 group-hover:text-emerald-300 font-medium">Open in Studio →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: Saved Missions */}
      {activeSubTab === 'missions' && (
        <div className="space-y-4">
          {favoriteMissions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-stone-900/40 border border-stone-800 text-stone-400 space-y-3">
              <Compass size={32} className="mx-auto text-stone-600" />
              <p className="font-serif text-lg text-stone-300">No saved missions yet.</p>
              <p className="text-xs text-stone-500">Tap the heart icon on any Touch Grass mission to pin it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteMissions.map(m => (
                <div
                  key={m.id}
                  className="flex flex-col justify-between p-6 rounded-3xl bg-stone-900/70 border border-stone-800 shadow-lg space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        ⏱️ {m.durationMinutes} min ({m.location})
                      </span>
                      <button
                        onClick={() => onRemoveFavoriteMission(m.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-stone-100 mb-1">
                      {m.title}
                    </h4>
                    <p className="text-xs text-emerald-300/80 leading-relaxed mb-3">
                      {m.benefit}
                    </p>
                    <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                      {m.instructions.slice(0, 2).map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: Completed History Log */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          {completedHistory.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-stone-900/40 border border-stone-800 text-stone-400 space-y-2">
              <CheckCircle2 size={32} className="mx-auto text-stone-600" />
              <p className="font-serif text-lg text-stone-300">History Log Empty</p>
              <p className="text-xs text-stone-500">Complete missions to record your outdoor journey.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-800 rounded-3xl bg-stone-900/60 border border-stone-800 overflow-hidden">
              {completedHistory.slice().reverse().map((entry) => (
                <div key={entry.id} className="p-4 flex items-center justify-between text-xs hover:bg-stone-900/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-stone-200 text-sm">{entry.title}</div>
                      <div className="text-stone-400 text-[11px]">
                        {new Date(entry.completedAt).toLocaleString()} ✦ {entry.location} ({entry.activityType})
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold">
                    +{entry.durationMinutes} min
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog for Resetting Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-stone-950 border border-rose-900/50 rounded-3xl p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle size={24} />
              <h3 className="font-serif text-xl font-bold">Clear Local Progress?</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              This will reset your completed mission logs, streaks, and saved items from browser local storage. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowClearConfirm(false);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
