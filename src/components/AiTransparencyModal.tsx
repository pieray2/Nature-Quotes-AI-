import { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Terminal, 
  ExternalLink,
  Lock,
  EyeOff
} from 'lucide-react';
import { AiConnectionStatus } from '../types';
import { GemmaService } from '../services/gemmaService';

interface AiTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: AiConnectionStatus;
  onStatusUpdated: (status: AiConnectionStatus) => void;
}

export function AiTransparencyModal({
  isOpen,
  onClose,
  status,
  onStatusUpdated
}: AiTransparencyModalProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    provider: string;
    model?: string;
    latencyMs: number;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const res = await GemmaService.testConnection();
      setTestResult(res);
      const newStatus = await GemmaService.getStatus();
      onStatusUpdated(newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-950 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition-colors"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-100">
              AI Transparency & Privacy
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Google Gemma Open-Source Architecture & Honest Connection Telemetry
            </p>
          </div>
        </div>

        {/* Live Status Card */}
        <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${status.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-serif text-base font-semibold text-stone-100">
                Current Engine: {status.activeProvider.toUpperCase()}
              </span>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={testing ? 'animate-spin' : ''} />
              <span>{testing ? 'Pinging Model...' : 'Test Connection'}</span>
            </button>
          </div>

          <div className="text-xs text-stone-300 leading-relaxed">
            {status.message}
          </div>

          {/* Test results banner */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-200'
                : 'bg-amber-950/40 border-amber-800/40 text-amber-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold block">{testResult.message}</span>
                {testResult.latencyMs > 0 && (
                  <span className="text-[11px] opacity-80">Measured round-trip latency: {testResult.latencyMs}ms</span>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-400 pt-1 border-t border-stone-800">
            <div>Configured Model: <span className="text-stone-200">{status.gemmaModel}</span></div>
            <div>Inference Endpoint: <span className="text-stone-200">{status.gemmaEndpoint}</span></div>
          </div>
        </div>

        {/* Open-Source Gemma Architecture */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg font-semibold text-stone-200 flex items-center gap-2">
            <span>Direct Google-Hosted Gemma Architecture</span>
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Nature Quotes AI connects directly to Google's officially hosted open-weight <strong>Gemma</strong> models (<code>gemma-4-26b-a4b-it</code>) via Google's GenAI developer infrastructure. This provides true Gemma inference with zero external intermediaries, no third-party account requirements, and high-performance serverless reliability.
          </p>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 font-mono text-xs text-stone-300 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <Terminal size={14} /> Server-Side Model Routing:
            </div>
            <div className="text-stone-400"># Direct Google Cloud GenAI Connection:</div>
            <div>Model: <span className="text-emerald-300">gemma-4-26b-a4b-it</span></div>
            <div>Provider: <span className="text-emerald-300">Google Generative AI Infrastructure</span></div>
            <div>Fallback: <span className="text-stone-400">gemini-3.8-flash & Curated Nature Archives</span></div>
          </div>
        </div>

        {/* Privacy Guarantees */}
        <div className="space-y-3 pt-2 border-t border-stone-800">
          <h3 className="font-serif text-lg font-semibold text-stone-200 flex items-center gap-2">
            <Lock size={16} className="text-emerald-400" />
            <span>"Touch Grass" Privacy Guarantees</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1">
              <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                <EyeOff size={14} className="text-emerald-400" /> No Photo Demands
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                We never require photographic proof of outdoor activities. Outdoor time is your personal sanctuary, not surveillance.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1">
              <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" /> Local Storage Only
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Your completed missions, daily streaks, and saved favorites remain strictly inside your browser's private local storage.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
