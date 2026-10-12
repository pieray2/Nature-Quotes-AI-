import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('[Server] Could not initialize GoogleGenAI with env key:', err);
  }
}

// Fallback curated nature quotes library
const CURATED_FALLBACKS = [
  {
    quote: "The clearest way into the Universe is through a forest wilderness.",
    author: "John Muir",
    element: "forest",
    mood: "wonder",
    reflection: "Beneath the cathedral of towering trees, human ambition softens into quiet reverence. Every leaf breathes the same light that fuels our beating hearts.",
    suggestedPalette: "emerald",
    keywords: ["wilderness", "forest", "solitude", "clarity"]
  },
  {
    quote: "To make a prairie it takes a clover and one bee, One clover, and a bee, And revery.",
    author: "Emily Dickinson",
    element: "meadow",
    mood: "peace",
    reflection: "Nature requires so little to bloom into magnificence—only the raw seed, the tireless worker, and our willing imagination to perceive its sacred dance.",
    suggestedPalette: "amber",
    keywords: ["prairie", "solitude", "blossom", "revery"]
  },
  {
    quote: "The sea does not reward those who are too anxious, too greedy, or too impatient. One should lie empty, open, choiceless as a beach.",
    author: "Anne Morrow Lindbergh",
    element: "ocean",
    mood: "peace",
    reflection: "Like tides that yield shells only when the shore stops grasping, inner stillness arrives when we surrender resistance to life's ebb and flow.",
    suggestedPalette: "azure",
    keywords: ["ocean", "surrender", "tides", "stillness"]
  },
  {
    quote: "Mountains are not stadiums where I satisfy my ambition to achieve, they are the cathedrals where I practice my religion.",
    author: "Anatoli Boukreev",
    element: "mountains",
    mood: "resilience",
    reflection: "High ridges strip away the trivial illusions of ego, leaving only rock, thin air, and the vast truth of human vulnerability.",
    suggestedPalette: "slate",
    keywords: ["peaks", "cathedrals", "courage", "presence"]
  },
  {
    quote: "The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, the carbon in our apple pies were made in the interiors of collapsing stars. We are made of starstuff.",
    author: "Carl Sagan",
    element: "cosmos",
    mood: "wonder",
    reflection: "When you gaze at the nocturnal vault, remember you are not an isolated spectator. You are the universe looking back at itself through mortal eyes.",
    suggestedPalette: "indigo",
    keywords: ["starlight", "cosmos", "origin", "eternity"]
  },
  {
    quote: "Listen to the rain. Each drop is a letter written by the sky, asking the soil for forgiveness.",
    author: "Nature Wisdom Reflection",
    element: "rain",
    mood: "healing",
    reflection: "Rain teaches the grace of releasing what we have carried too long. What feels like heavy cloud cover is preparing the unseen roots to surge anew.",
    suggestedPalette: "teal",
    keywords: ["rain", "renewal", "cleansing", "earth"]
  },
  {
    quote: "In every walk with nature one receives far more than he seeks.",
    author: "John Muir",
    element: "forest",
    mood: "gratitude",
    reflection: "The trail offers no transactional reward, yet every bend replenishes the reservoirs of the soul.",
    suggestedPalette: "moss",
    keywords: ["pathways", "simplicity", "grace", "trees"]
  }
];

// API endpoint to generate custom nature quotes & meditations
app.post('/api/generate-quote', async (req, res) => {
  const {
    element = 'forest',
    mood = 'wonder',
    customPrompt = '',
    style = 'poetic',
    format = 'reflection'
  } = req.body || {};

  // Check if Gemini API client is available
  if (aiClient) {
    try {
      const prompt = `You are a deeply poetic naturalist and philosophical contemplative in the lineage of John Muir, Mary Oliver, Henry David Thoreau, Nan Shepherd, and Lao Tzu.
Create an evocative, original, and deeply moving nature quote and reflection.

Target Theme / Nature Element: ${element}
Emotional Resonance / Mood: ${mood}
Philosophical Style: ${style} (e.g. transcendental, zen/taoist, romantic poet, cosmic naturalist)
Format: ${format}
User inspiration / specific landscape detail: ${customPrompt || 'an evocative contemplation of wild natural beauty and serenity'}

Requirements:
1. Provide a profound, poetic "quote" (1-3 sentences maximum). It must sound timeless, lyrical, and free of cliché or corporate motivational speak.
2. Provide an "author" signature (e.g., "The Wild Sage", "Echoes of the Cedar Woods", "Mountain Solitude", or an inspiring pen name reflecting the theme).
3. Provide an insightful "reflection" (2-3 sentences providing contemplative mindfulness guidance or deeper wisdom).
4. Provide 3-5 vivid "keywords".
5. Provide a "suggestedPalette" (choose from: "emerald", "azure", "slate", "amber", "indigo", "teal", "moss", "dusk").

Respond ONLY in valid JSON with this exact structure:
{
  "quote": "string",
  "author": "string",
  "element": "string",
  "mood": "string",
  "reflection": "string",
  "suggestedPalette": "string",
  "keywords": ["string", "string", "string"]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: "You are an enlightened nature poet and philosopher. Output clean JSON only, without markdown fences or extraneous text.",
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({
        success: true,
        data: {
          quote: parsed.quote || "Look deep into nature, and then you will understand everything better.",
          author: parsed.author || "Whisper of the Wild",
          element: parsed.element || element,
          mood: parsed.mood || mood,
          reflection: parsed.reflection || "Nature quietly invites us to breathe and align with the slow rhythm of the living earth.",
          suggestedPalette: parsed.suggestedPalette || "emerald",
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [element, mood, "peace"],
          isAiGenerated: true
        }
      });
    } catch (apiError) {
      console.error('[API] Gemini generation error, falling back to curated library:', apiError);
    }
  }

  // Graceful fallback to curated wisdom library
  const matched = CURATED_FALLBACKS.filter(q => q.element === element || q.mood === mood);
  const selected = matched.length > 0 
    ? matched[Math.floor(Math.random() * matched.length)]
    : CURATED_FALLBACKS[Math.floor(Math.random() * CURATED_FALLBACKS.length)];

  return res.json({
    success: true,
    data: {
      ...selected,
      isAiGenerated: false,
      note: "Crafted from nature wisdom archives"
    }
  });
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Configure Vite middleware in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Nature Quotes AI] Server running at http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
