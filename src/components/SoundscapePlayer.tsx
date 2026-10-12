import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Wind, CloudRain, Waves, Trees, Flame, Droplets, Sliders, Play, Pause } from 'lucide-react';
import { soundEngine } from '../utils/soundscapes';

interface SoundscapePlayerProps {
  currentElement?: string;
}

export function SoundscapePlayer({ currentElement }: SoundscapePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [masterVol, setMasterVol] = useState(0.7);
  const [channels, setChannels] = useState({
    wind: 0.4,
    rain: 0.0,
    waves: 0.0,
    birds: 0.35,
    fire: 0.0,
    stream: 0.0,
  });

  // Auto-adapt default ambiance to current nature element if user initiates
  useEffect(() => {
    if (!currentElement) return;
    if (currentElement === 'ocean' || currentElement === 'river') {
      updateChannel('waves', 0.6);
      updateChannel('wind', 0.3);
      updateChannel('birds', 0.1);
    } else if (currentElement === 'forest') {
      updateChannel('wind', 0.45);
      updateChannel('birds', 0.5);
      updateChannel('waves', 0.0);
    } else if (currentElement === 'rain') {
      updateChannel('rain', 0.65);
      updateChannel('wind', 0.3);
      updateChannel('birds', 0.0);
    } else if (currentElement === 'mountains') {
      updateChannel('wind', 0.6);
      updateChannel('birds', 0.2);
    }
  }, [currentElement]);

  const togglePlay = async () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
    } else {
      await soundEngine.start();
      setIsPlaying(true);
    }
  };

  const updateChannel = (channel: keyof typeof channels, val: number) => {
    setChannels(prev => ({ ...prev, [channel]: val }));
    soundEngine.setChannelVolume(channel, val);
  };

  const setPreset = (name: string) => {
    let preset = { wind: 0.3, rain: 0, waves: 0, birds: 0.3, fire: 0, stream: 0 };
    if (name === 'deep-woods') {
      preset = { wind: 0.5, rain: 0, waves: 0, birds: 0.6, fire: 0, stream: 0.3 };
    } else if (name === 'ocean-shores') {
      preset = { wind: 0.4, rain: 0, waves: 0.7, birds: 0.1, fire: 0, stream: 0 };
    } else if (name === 'misty-rain') {
      preset = { wind: 0.3, rain: 0.7, waves: 0, birds: 0.05, fire: 0, stream: 0.4 };
    } else if (name === 'hearth-camp') {
      preset = { wind: 0.25, rain: 0, waves: 0, birds: 0.1, fire: 0.8, stream: 0 };
    }
    setChannels(preset);
    Object.entries(preset).forEach(([k, v]) => {
      soundEngine.setChannelVolume(k as keyof typeof channels, v);
    });
  };

  return (
    <div className="relative">
      {/* Mini Player Bar */}
      <div className="flex items-center gap-3 bg-stone-900/80 backdrop-blur-md border border-emerald-900/40 rounded-full px-4 py-2 text-stone-200 shadow-xl transition-all hover:border-emerald-700/60">
        <button
          onClick={togglePlay}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
            isPlaying 
              ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/30' 
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
          title={isPlaying ? 'Pause Nature Sounds' : 'Play Nature Sounds'}
          aria-label={isPlaying ? 'Pause nature sounds' : 'Play nature sounds'}
        >
          {isPlaying ? <Pause size={15} className="fill-current" /> : <Play size={15} className="fill-current ml-0.5" />}
        </button>

        <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-stone-600'}`}></span>
          <span className="text-stone-300 hidden sm:inline">Ambient Nature:</span>
          <span className="text-emerald-400 font-serif italic text-sm">
            {isPlaying ? 'Whispering Elements' : 'Quiet Wilderness'}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1.5 rounded-lg text-stone-400 hover:text-emerald-300 transition-colors ${
            isExpanded ? 'bg-emerald-900/30 text-emerald-300' : ''
          }`}
          title="Sound Mixer"
          aria-label="Toggle sound mixer panel"
        >
          <Sliders size={16} />
        </button>
      </div>

      {/* Expanded Mixer Flyout */}
      {isExpanded && (
        <div className="absolute right-0 top-12 z-50 w-72 sm:w-80 bg-stone-950/95 backdrop-blur-xl border border-emerald-800/40 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span className="font-serif text-sm font-semibold text-stone-200">Procedural Soundscape</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-stone-500 hover:text-stone-300 text-xs px-2 py-0.5 rounded bg-stone-900"
            >
              Close
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-1.5 my-3">
            <button
              onClick={() => setPreset('deep-woods')}
              className="px-2 py-1 text-xs rounded-lg bg-stone-900 hover:bg-emerald-950/60 hover:text-emerald-300 text-stone-400 border border-stone-800 transition-colors text-left"
            >
              🌲 Deep Woods
            </button>
            <button
              onClick={() => setPreset('ocean-shores')}
              className="px-2 py-1 text-xs rounded-lg bg-stone-900 hover:bg-cyan-950/60 hover:text-cyan-300 text-stone-400 border border-stone-800 transition-colors text-left"
            >
              🌊 Ocean Tide
            </button>
            <button
              onClick={() => setPreset('misty-rain')}
              className="px-2 py-1 text-xs rounded-lg bg-stone-900 hover:bg-teal-950/60 hover:text-teal-300 text-stone-400 border border-stone-800 transition-colors text-left"
            >
              🌧️ Misty Rain
            </button>
            <button
              onClick={() => setPreset('hearth-camp')}
              className="px-2 py-1 text-xs rounded-lg bg-stone-900 hover:bg-amber-950/60 hover:text-amber-300 text-stone-400 border border-stone-800 transition-colors text-left"
            >
              🔥 Night Fire
            </button>
          </div>

          {/* Master Volume */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>Master Volume</span>
              <span>{Math.round(masterVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVol}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMasterVol(val);
                soundEngine.setMasterVolume(val);
              }}
              className="w-full accent-emerald-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Channel Sliders */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="w-16 text-stone-300">Forest Wind</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={channels.wind}
                onChange={(e) => updateChannel('wind', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <CloudRain className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="w-16 text-stone-300">Rain & Mist</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={channels.rain}
                onChange={(e) => updateChannel('rain', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <Waves className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="w-16 text-stone-300">Sea Waves</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={channels.waves}
                onChange={(e) => updateChannel('waves', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="w-16 text-stone-300">Brook Stream</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={channels.stream}
                onChange={(e) => updateChannel('stream', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-amber-400 shrink-0 text-sm">🐦</span>
              <span className="w-16 text-stone-300">Wild Birds</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={channels.birds}
                onChange={(e) => updateChannel('birds', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="w-16 text-stone-300">Campfire</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={channels.fire}
                onChange={(e) => updateChannel('fire', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-800/80 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Real-time synthesized Web Audio</span>
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="text-emerald-400 hover:underline font-medium"
              >
                Start audio
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
