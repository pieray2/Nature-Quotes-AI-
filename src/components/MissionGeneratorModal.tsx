import { useState } from 'react';
import { 
  X, 
  Compass, 
  Clock, 
  MapPin, 
  Smile, 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  Heart,
  ArrowRight
} from 'lucide-react';
import { TouchGrassMission, MissionDuration, MissionLocation, MissionMood, MissionActivityType } from '../types';
import { GemmaService } from '../services/gemmaService';

interface MissionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMissionCreated: (mission: TouchGrassMission) => void;
}

export function MissionGeneratorModal({
  isOpen,
  onClose,
  onMissionCreated
}: MissionGeneratorModalProps) {
  const [duration, setDuration] = useState<MissionDuration>(10);
  const [location, setLocation] = useState<MissionLocation>('park');
  const [mood, setMood] = useState<MissionMood>('stressed');
  const [activityType, setActivityType] = useState<MissionActivityType>('mindfulness');
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMission, setGeneratedMission] = useState<TouchGrassMission | null>(null);
  const [providerLabel, setProviderLabel] = useState<string>('');

  if (!isOpen) return null;

  const durationOptions: MissionDuration[] = [5, 10, 20, 30];
  const locationOptions: { id: MissionLocation; label: string; icon: string }[] = [
    { id: 'balcony', label: 'Balcony / Porch', icon: '🏡' },
    { id: 'garden', label: 'Garden / Yard', icon: '🌱' },
    { id: 'park', label: 'Local Park', icon: '🌲' },
    { id: 'street', label: 'Neighborhood Street', icon: '🚶' },
    { id: 'nearby outdoor space', label: 'Nearby Wilderness', icon: '⛰️' },
  ];

  const moodOptions: { id: MissionMood; label: string; emoji: string }[] = [
    { id: 'stressed', label: 'Stressed / Overwhelmed', emoji: '🌪️' },
    { id: 'bored', label: 'Bored / Stagnant', emoji: '🥱' },
    { id: 'tired', label: 'Tired / Screen Fatigued', emoji: '🔋' },
    { id: 'peaceful', label: 'Peaceful / Receptive', emoji: '🕊️' },
    { id: 'curious', label: 'Curious / Playful', emoji: '🔍' },
  ];

  const activityOptions: { id: MissionActivityType; label: string; desc: string }[] = [
    { id: 'mindfulness', label: 'Sensory Mindfulness', desc: 'Breathe, listen to birds, ground in stillness' },
    { id: 'walking', label: 'Rhythmic Walking', desc: 'Step outdoors, unhurried pace, eyes up' },
    { id: 'observation', label: 'Nature Observation', desc: 'Explore leaves, clouds, tree bark, mini-ecosystems' },
    { id: 'photography', label: 'Micro Photography', desc: 'Notice macro patterns and light without sharing' },
    { id: 'eco-friendly action', label: 'Eco Action & Care', desc: 'Water plants, pick up litter, gentle stewardship' },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await GemmaService.generateMission({
        duration,
        location,
        mood,
        activityType
      });
      setGeneratedMission(result.mission);
      setProviderLabel(
        result.isLiveAi 
          ? `Generated with live ${result.provider.toUpperCase()} (${result.model || 'open-weight'})` 
          : 'Verified Curated Offline Mission Archive'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdoptMission = () => {
    if (generatedMission) {
      onMissionCreated(generatedMission);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-950 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition-colors"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Compass size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-100">
                Touch Grass Mission Generator
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Week 1
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Personalized outdoor micro-adventures designed to unplug your mind and ground your senses.
            </p>
          </div>
        </div>

        {generatedMission ? (
          /* Mission Generated Preview */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border border-emerald-800/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-stone-800">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles size={14} /> {providerLabel}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300">
                    ⏱️ {generatedMission.durationMinutes} min
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300">
                    📍 {generatedMission.location}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-100">
                  {generatedMission.title}
                </h3>
              </div>

              {/* Benefit badge */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-200 leading-relaxed">
                <span className="font-semibold text-emerald-400 block mb-0.5">🌿 Why this helps you:</span>
                {generatedMission.benefit}
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                  Step-by-step guidance
                </h4>
                <ol className="space-y-2 text-xs sm:text-sm text-stone-300 list-decimal list-inside leading-relaxed">
                  {generatedMission.instructions.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Checklist */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                  Checklist items
                </h4>
                <div className="space-y-1.5">
                  {generatedMission.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs text-stone-300 bg-stone-900/80 p-2 rounded-xl border border-stone-800">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy assurance */}
              <div className="text-[11px] text-stone-500 flex items-center gap-1 pt-1">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>Zero photo verification or location disclosure required. Your outdoor moments are private.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setGeneratedMission(null)}
                className="px-5 py-2.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-900 text-xs font-medium transition-colors"
              >
                Change Options
              </button>
              <button
                onClick={handleAdoptMission}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Accept Mission</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ) : (
          /* Selection Form */
          <div className="space-y-5">
            {/* 1. Duration */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                1. Duration Timebox
              </label>
              <div className="grid grid-cols-4 gap-2">
                {durationOptions.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDuration(m)}
                    className={`py-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      duration === m
                        ? 'bg-emerald-500 text-stone-950 border-emerald-400 shadow-md shadow-emerald-950'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    {m} Minutes
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Location */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                2. Outdoor Location Available
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {locationOptions.map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLocation(l.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      location === l.id
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-base">{l.icon}</span>
                    <span className="font-medium truncate">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Current Mood */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                3. Your Current Mental State
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {moodOptions.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      mood === m.id
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span className="truncate">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Activity Type */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                4. Desired Activity Focus
              </label>
              <div className="space-y-1.5">
                {activityOptions.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setActivityType(a.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      activityType === a.id
                        ? 'bg-emerald-950/70 border-emerald-500 text-stone-100 shadow-sm'
                        : 'bg-stone-900/40 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className={`font-semibold ${activityType === a.id ? 'text-emerald-300' : 'text-stone-300'}`}>
                        {a.label}
                      </div>
                      <div className="text-[11px] text-stone-400">{a.desc}</div>
                    </div>
                    {activityType === a.id && (
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-stone-950 font-bold text-sm shadow-xl shadow-emerald-950/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Consulting Nature Elements...</span>
                  </>
                ) : (
                  <>
                    <Compass size={18} />
                    <span>Generate Touch Grass Mission</span>
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
