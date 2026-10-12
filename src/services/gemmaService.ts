/**
 * Gemma AI Service Module — Open-Source AI Integration
 * 
 * Provides client interfaces to Google's open-weight Gemma models
 * (e.g. gemma-2-9b-it, gemma-2-2b-it) and Google Gemini with honest
 * offline curated fallbacks.
 * 
 * Security: All credentials and inference endpoints are kept strictly server-side.
 */

import { NatureQuote, TouchGrassMission, AiConnectionStatus } from '../types';

export class GemmaService {
  /**
   * Fetches current AI inference provider status and configuration details.
   */
  static async getStatus(): Promise<AiConnectionStatus> {
    try {
      const res = await fetch('/api/gemma/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[GemmaService] Unable to reach status endpoint:', err);
      return {
        hasGemmaConfig: false,
        hasGeminiConfig: false,
        activeProvider: 'curated',
        gemmaModel: 'google/gemma-2-9b-it',
        gemmaEndpoint: 'unconfigured',
        isOnline: false,
        message: 'Running in offline curated archive mode.'
      };
    }
  }

  /**
   * Performs an actual live inference ping to test model reachability and measure round-trip latency.
   */
  static async testConnection(): Promise<{
    success: boolean;
    provider: 'gemma' | 'gemini' | 'curated';
    model?: string;
    latencyMs: number;
    message: string;
  }> {
    try {
      const res = await fetch('/api/gemma/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        provider: 'curated',
        latencyMs: 0,
        message: `Connection test failed: ${err.message || 'Network error'}`
      };
    }
  }

  /**
   * Generates a nature quote tailored to user mood, theme, and philosophical style.
   */
  static async generateQuote(params: {
    mood: string;
    theme: string;
    style: string;
    customPrompt?: string;
  }): Promise<{ quote: NatureQuote; isLiveAi: boolean; provider: string; model?: string }> {
    try {
      const res = await fetch('/api/gemma/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (data.success && data.data) {
        return {
          quote: {
            id: `quote-${Date.now()}`,
            quote: data.data.quote,
            author: data.data.author,
            element: data.data.element,
            mood: data.data.mood,
            style: data.data.style,
            reflection: data.data.reflection,
            keywords: data.data.keywords || ['nature', 'mindfulness'],
            suggestedPalette: data.data.suggestedPalette || 'emerald',
            isAiGenerated: Boolean(data.data.isAiGenerated),
            aiProvider: data.data.aiProvider || 'curated',
            dateAdded: new Date().toISOString()
          },
          isLiveAi: Boolean(data.data.isAiGenerated),
          provider: data.data.aiProvider || 'curated',
          model: data.data.model
        };
      }
      throw new Error('Malformed response');
    } catch (err) {
      console.warn('[GemmaService] Quote generation fell back:', err);
      throw err;
    }
  }

  /**
   * Generates an outdoor Touch Grass mission tailored to duration, location, mood, and activity type.
   */
  static async generateMission(params: {
    duration: number;
    location: string;
    mood: string;
    activityType: string;
  }): Promise<{ mission: TouchGrassMission; isLiveAi: boolean; provider: string; model?: string }> {
    try {
      const res = await fetch('/api/gemma/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (data.success && data.data) {
        return {
          mission: {
            ...data.data,
            isAiGenerated: Boolean(data.data.isAiGenerated),
            aiProvider: data.data.aiProvider || 'curated',
            createdAt: new Date().toISOString()
          },
          isLiveAi: Boolean(data.data.isAiGenerated),
          provider: data.data.aiProvider || 'curated',
          model: data.data.model
        };
      }
      throw new Error('Malformed mission response');
    } catch (err) {
      console.warn('[GemmaService] Mission generation fell back:', err);
      throw err;
    }
  }
}
