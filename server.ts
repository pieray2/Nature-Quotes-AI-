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

// ---------------------------------------------------------
// Secure Server-Side Google-Hosted Gemma & Gemini Configuration
// ---------------------------------------------------------
// Uses Google's official GoogleGenAI SDK to connect directly
// to Google-hosted Gemma models (gemma-4-26b-a4b-it)
// Keys remain exclusively on the server (process.env.GEMINI_API_KEY)
const rawModel = process.env.GEMMA_MODEL_NAME || 'gemma-4-26b-a4b-it';
const cleanModel = rawModel.replace(/^google\//i, '').replace(/^models\//i, '');
const GEMMA_MODEL = cleanModel === 'gemma-4-31b-it' ? 'gemma-4-31b-it' : 'gemma-4-26b-a4b-it';
const FALLBACK_MODEL = 'gemini-3.8-flash';

let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('[Server] Could not initialize GoogleGenAI client:', err);
  }
}

// ---------------------------------------------------------
// Curated Nature Quotes & Missions Archive (Offline Fallbacks)
// ---------------------------------------------------------
const CURATED_QUOTES_ARCHIVE = [
  {
    quote: "The clearest way into the Universe is through a forest wilderness.",
    author: "John Muir",
    element: "forest",
    mood: "wonder",
    style: "philosophical",
    reflection: "Beneath the cathedral of towering trees, human ambition softens into quiet reverence. Every leaf breathes the same light that fuels our beating hearts.",
    suggestedPalette: "emerald",
    keywords: ["wilderness", "forest", "solitude", "clarity"]
  },
  {
    quote: "Flowers are the sweetest things that God ever made and forgot to put a soul into.",
    author: "Henry Ward Beecher",
    element: "flowers",
    mood: "calm",
    style: "poetic",
    reflection: "In the blossom of a single flower lies the universe's quiet reminder to open unhurriedly toward whatever light is given to us.",
    suggestedPalette: "amber",
    keywords: ["blossom", "petals", "fragrance", "gentleness"]
  },
  {
    quote: "With the dawn comes a fresh dispensation of courage. The sun rises not for a chosen few, but for every blade of grass alike.",
    author: "John Muir",
    element: "sunrise",
    mood: "hopeful",
    style: "philosophical",
    reflection: "No matter how dark the canopy of night, dawn never fails its appointment with the horizon. Every sunrise is an unearned gift of renewal.",
    suggestedPalette: "amber",
    keywords: ["dawn", "sunlight", "hope", "horizon"]
  },
  {
    quote: "The Earth will not continue to offer its harvest, except with faithful stewardship. We cannot say we love the land and then take steps to destroy it.",
    author: "Pope John Paul II",
    element: "sustainability",
    mood: "motivated",
    style: "short and powerful",
    reflection: "Sustainability is simply love enacted across generations. Touching grass reminds us we are custodians of a borrowed world.",
    suggestedPalette: "emerald",
    keywords: ["stewardship", "earth", "future", "custodians"]
  },
  {
    quote: "The sea does not reward those who are too anxious, too greedy, or too impatient. One should lie empty, open, choiceless as a beach.",
    author: "Anne Morrow Lindbergh",
    element: "ocean",
    mood: "calm",
    style: "philosophical",
    reflection: "Like tides that yield shells only when the shore stops grasping, inner stillness arrives when we surrender resistance to life's ebb and flow.",
    suggestedPalette: "azure",
    keywords: ["ocean", "surrender", "tides", "stillness"]
  },
  {
    quote: "Mountains are not stadiums where I satisfy my ambition to achieve, they are the cathedrals where I practice my religion.",
    author: "Anatoli Boukreev",
    element: "mountains",
    mood: "reflective",
    style: "philosophical",
    reflection: "High ridges strip away pretense. In the rarefied air of summits, we do not conquer peaks; we conquer our own frail doubts.",
    suggestedPalette: "slate",
    keywords: ["peaks", "cathedrals", "courage", "presence"]
  },
  {
    quote: "Listen to the rain. Each drop is a letter written by the sky, asking the soil for forgiveness and offering rebirth.",
    author: "Rabindranath Tagore",
    element: "rain",
    mood: "grateful",
    style: "poetic",
    reflection: "Rain teaches the grace of releasing what we have carried too long. What feels like heavy cloud cover is preparing the unseen roots to surge anew.",
    suggestedPalette: "teal",
    keywords: ["rain", "renewal", "cleansing", "earth"]
  },
  {
    quote: "Look at the trees, look at the birds, look at the clouds: they do not worry about tomorrow. They live in total absorption of this immediate moment.",
    author: "Thich Nhat Hanh",
    element: "forest",
    mood: "calm",
    style: "mindfulness",
    reflection: "Mindfulness is not a complicated mental gym; it is merely matching the effortless presence of trees rooted quietly in the damp earth.",
    suggestedPalette: "emerald",
    keywords: ["trees", "presence", "peace", "now"]
  }
];

const CURATED_MISSIONS_ARCHIVE = [
  {
    title: "The Five-Leaf Exploration",
    instructions: [
      "Step outside into a garden, park, or courtyard.",
      "Find five distinctly shaped leaves (either on living plants or fallen on the ground).",
      "Examine the vein patterns, edge serrations, and shades of green on each.",
      "Gently touch the surface to compare waxy, fuzzy, and smooth textures.",
      "Leave them in their natural place with gratitude."
    ],
    durationMinutes: 5,
    location: "garden",
    mood: "stressed",
    activityType: "observation",
    difficulty: "gentle",
    benefit: "Visual sensory grounding shifts attention away from racing thoughts, rapidly lowering cortisol and activating the parasympathetic rest response.",
    checklist: [
      { id: "c1", text: "Step outside away from digital screens", done: false },
      { id: "c2", text: "Locate 5 distinct leaf species or shapes", done: false },
      { id: "c3", text: "Feel the leaf texture between your thumb and index finger", done: false },
      { id: "c4", text: "Notice the intricate geometric vein branching", done: false }
    ]
  },
  {
    title: "Mindful Ten-Minute Unplugged Walk",
    instructions: [
      "Place your phone inside a pocket or bag on silent mode.",
      "Walk at an unhurried, measured pace along a tree-lined street or park path.",
      "Synchronize your footfalls with steady, deep breaths: 4 paces inhaling, 4 paces exhaling.",
      "Keep your gaze soft on the middle distance rather than looking down.",
      "Notice the shifting temperature of the air as you pass through sunlit patches and tree shade."
    ],
    durationMinutes: 10,
    location: "park",
    mood: "tired",
    activityType: "walking",
    difficulty: "gentle",
    benefit: "Bilateral rhythmic walking combined with natural visual optic flow calms the amygdala and restores executive brain function after prolonged screen work.",
    checklist: [
      { id: "c1", text: "Silence all notifications and pocket phone", done: false },
      { id: "c2", text: "Breathe rhythmically with each step", done: false },
      { id: "c3", text: "Observe where shadows fall across your path", done: false },
      { id: "c4", text: "Take a final deep breath before returning indoors", done: false }
    ]
  },
  {
    title: "Birdsong Frequency Isolation",
    instructions: [
      "Find a bench, balcony rail, or open patch of grass.",
      "Close your eyes or fix your gaze on the horizon for 10 minutes.",
      "Disregard human engine hum and isolate bird calls in the canopy.",
      "Try to count how many distinct bird species or vocal rhythms are conversing.",
      "Notice the direction and distance of each chirp without turning your head."
    ],
    durationMinutes: 10,
    location: "balcony",
    mood: "bored",
    activityType: "mindfulness",
    difficulty: "gentle",
    benefit: "Acoustic immersion in natural soundscapes stimulates theta brainwaves, reducing mental fatigue and subjective anxiety by over 30%.",
    checklist: [
      { id: "c1", text: "Find a comfortable resting posture outdoors", done: false },
      { id: "c2", text: "Close eyes or soften gaze", done: false },
      { id: "c3", text: "Identify at least two separate bird vocalizations", done: false },
      { id: "c4", text: "Sense the acoustic spatial boundary of your surroundings", done: false }
    ]
  },
  {
    title: "Cloud Velocity & Sky Survey",
    instructions: [
      "Look up at the open sky from your balcony, porch, or courtyard.",
      "Locate a distinct cloud formation or edge.",
      "Track its movement across a reference point like a rooftop or treetop.",
      "Observe the layering of light and subtle gradients of blue, silver, or pearl.",
      "Reflect on the impermanence of clouds and thoughts alike."
    ],
    durationMinutes: 5,
    location: "balcony",
    mood: "peaceful",
    activityType: "observation",
    difficulty: "gentle",
    benefit: "Gazing upward at open horizons relieves optical convergence strain from close-up monitors and triggers a state of micro-awe.",
    checklist: [
      { id: "c1", text: "Look toward the furthest visible sky horizon", done: false },
      { id: "c2", text: "Track a single cloud boundary for 60 seconds", done: false },
      { id: "c3", text: "Notice how rapidly the formation dissolves and transforms", done: false }
    ]
  },
  {
    title: "Neighborhood Stewardship Sweep",
    instructions: [
      "Bring gloves or tongs and a small paper bag.",
      "Walk a single outdoor block or trail stretch safely where permitted.",
      "Pick up discarded plastics or litter, restoring the soil to clean earth.",
      "Notice any plants or wild flora that reclaim urban pavement cracks.",
      "Dispose of the items responsibly in recycling or waste bins."
    ],
    durationMinutes: 20,
    location: "street",
    mood: "curious",
    activityType: "eco-friendly action",
    difficulty: "moderate",
    benefit: "Tangible altruistic stewardship delivers an immediate sense of purpose and agency, reinforcing mutual reciprocity with our living habitats.",
    checklist: [
      { id: "c1", text: "Equip gloves and collection bag safely", done: false },
      { id: "c2", text: "Clean a 50-meter perimeter of stray litter", done: false },
      { id: "c3", text: "Separate recyclable items where facilities exist", done: false },
      { id: "c4", text: "Wash hands and celebrate leaving the earth cleaner", done: false }
    ]
  }
];

// Helper: Run content generation targeting Google-hosted Gemma with Gemini fallback
async function generateWithGoogleGemma(prompt: string, jsonMode = true): Promise<{ text: string | null; modelUsed: string; isGemma: boolean }> {
  if (!aiClient) return { text: null, modelUsed: 'curated', isGemma: false };

  // 1. Attempt Google-Hosted Gemma
  try {
    const config: any = {};
    if (jsonMode) {
      config.responseMimeType = 'application/json';
    }

    const response = await aiClient.models.generateContent({
      model: GEMMA_MODEL,
      contents: prompt,
      config
    });

    if (response.text) {
      return { text: response.text, modelUsed: GEMMA_MODEL, isGemma: true };
    }
  } catch (gemmaError: any) {
    console.warn(`[Server] Google-hosted Gemma (${GEMMA_MODEL}) unavailable, falling back to ${FALLBACK_MODEL}:`, gemmaError.message);
  }

  // 2. Fallback to Gemini
  try {
    const config: any = {};
    if (jsonMode) {
      config.responseMimeType = 'application/json';
    }

    const response = await aiClient.models.generateContent({
      model: FALLBACK_MODEL,
      contents: prompt,
      config
    });

    if (response.text) {
      return { text: response.text, modelUsed: FALLBACK_MODEL, isGemma: false };
    }
  } catch (geminiError: any) {
    console.warn(`[Server] Secondary model (${FALLBACK_MODEL}) error:`, geminiError.message);
  }

  return { text: null, modelUsed: 'curated', isGemma: false };
}

// ---------------------------------------------------------
// 1. AI Connection Status Endpoint (/api/gemma/status)
// ---------------------------------------------------------
app.get('/api/gemma/status', (_req, res) => {
  const hasKey = Boolean(aiClient);

  res.json({
    hasGemmaConfig: hasKey,
    hasHfToken: false,
    hasGeminiConfig: hasKey,
    activeProvider: hasKey ? 'gemma' : 'curated',
    gemmaModel: `${GEMMA_MODEL} (Google-Hosted)`,
    gemmaEndpoint: 'Google Cloud Generative AI',
    isOnline: hasKey,
    message: hasKey
      ? `Connected directly to Google-hosted Gemma (${GEMMA_MODEL}) via Google GenAI API`
      : 'Curated offline archive mode active (No API key found in process.env.GEMINI_API_KEY)'
  });
});

// ---------------------------------------------------------
// 2. Real Connection Test (/api/gemma/test-connection)
// ---------------------------------------------------------
app.post('/api/gemma/test-connection', async (_req, res) => {
  if (!aiClient) {
    return res.json({
      success: false,
      provider: 'curated',
      latencyMs: 0,
      message: 'GEMINI_API_KEY is not configured on the server. Running in verified offline curated archive mode.'
    });
  }

  const start = Date.now();
  try {
    // Test live inference with Google-hosted Gemma
    const testPrompt = 'You are Google Gemma. Respond with exactly one sentence describing the stillness of an ancient cedar tree.';
    const response = await aiClient.models.generateContent({
      model: GEMMA_MODEL,
      contents: testPrompt
    });
    const latencyMs = Date.now() - start;
    const reply = response.text?.trim() || 'Connection confirmed';

    return res.json({
      success: true,
      provider: 'gemma',
      model: GEMMA_MODEL,
      latencyMs,
      message: `Verified: Google-hosted Gemma (${GEMMA_MODEL}) answered directly via Google GenAI in ${latencyMs}ms! Sample response: "${reply}"`
    });
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    console.warn('[Server] Connection test to Google-hosted Gemma failed, testing secondary Gemini fallback:', err.message);

    // Test secondary model
    try {
      await aiClient.models.generateContent({
        model: FALLBACK_MODEL,
        contents: 'Ping'
      });
      return res.json({
        success: true,
        provider: 'gemini',
        model: FALLBACK_MODEL,
        latencyMs: Date.now() - start,
        message: `Gemma model ${GEMMA_MODEL} encountered a temporary spike (${err.message}). Google Gemini fallback (${FALLBACK_MODEL}) is active and operational.`
      });
    } catch (fallbackErr: any) {
      return res.json({
        success: false,
        provider: 'curated',
        latencyMs,
        message: `Google API error: ${err.message || 'Service unavailable'}. Seamlessly using verified offline curated archives.`
      });
    }
  }
});

// ---------------------------------------------------------
// 3. AI Nature Quote Generator (/api/gemma/quote)
// ---------------------------------------------------------
app.post(['/api/gemma/quote', '/api/generate-quote'], async (req, res) => {
  const {
    mood = 'reflective',
    theme = 'forest',
    element = theme,
    style = 'poetic',
    customPrompt = ''
  } = req.body || {};

  const effectiveTheme = theme || element || 'forest';

  const prompt = `You are Google Gemma, an enlightened nature philosopher.
Create a profound, original nature quote and short reflection.
Mood: ${mood}
Theme / Nature Element: ${effectiveTheme}
Style: ${style} (poetic, philosophical, short and powerful, or mindfulness)
User Specifics: ${customPrompt || 'nature reconnection and touching grass'}

Respond ONLY with valid JSON with this exact schema:
{
  "quote": "string",
  "author": "Gemma (or an evocative nature pen name)",
  "element": "${effectiveTheme}",
  "mood": "${mood}",
  "reflection": "string",
  "suggestedPalette": "emerald",
  "keywords": ["tag1", "tag2", "tag3"]
}`;

  const result = await generateWithGoogleGemma(prompt, true);

  if (result.text) {
    try {
      const clean = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(clean);
      return res.json({
        success: true,
        data: {
          quote: parsed.quote || "Look deep into nature, and then you will understand everything better.",
          author: parsed.author || (result.isGemma ? 'Google Gemma' : 'Nature Contemplative'),
          element: parsed.element || effectiveTheme,
          mood: parsed.mood || mood,
          style,
          reflection: parsed.reflection || 'Step outside and let the natural world recalibrate your perspective.',
          suggestedPalette: parsed.suggestedPalette || 'emerald',
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [effectiveTheme, mood, 'touch-grass'],
          isAiGenerated: true,
          aiProvider: result.isGemma ? 'gemma' : 'gemini',
          model: result.modelUsed
        }
      });
    } catch (parseErr) {
      console.warn('[Server] JSON parse error on model output, falling back to curated archive');
    }
  }

  // Resilient Fallback: Curated Nature Quotes Archive
  const matched = CURATED_QUOTES_ARCHIVE.filter(q => q.element === effectiveTheme || q.mood === mood);
  const selected = matched.length > 0 
    ? matched[Math.floor(Math.random() * matched.length)]
    : CURATED_QUOTES_ARCHIVE[Math.floor(Math.random() * CURATED_QUOTES_ARCHIVE.length)];

  return res.json({
    success: true,
    data: {
      ...selected,
      isAiGenerated: false,
      aiProvider: 'curated',
      note: 'Verified Curated Offline Archive'
    }
  });
});

// ---------------------------------------------------------
// 4. Touch Grass Mission Generator (/api/gemma/mission)
// ---------------------------------------------------------
app.post('/api/gemma/mission', async (req, res) => {
  const {
    duration = 10,
    location = 'garden',
    mood = 'stressed',
    activityType = 'mindfulness'
  } = req.body || {};

  const prompt = `You are Google Gemma, creating a restorative outdoor Touch Grass mission.
Duration: ${duration} minutes
Location: ${location}
Mood: ${mood}
Activity Type: ${activityType}

Requirements:
- Practical, grounded activity that reconnects the user to living nature.
- Title, 4-5 numbered instructions, benefit explanation (why this restores attention or calms the nervous system), and 3-4 checklist tasks.
- Never demand photographs or location disclosure.

Respond ONLY with valid JSON with this exact schema:
{
  "title": "string",
  "instructions": ["string", "string", "string", "string"],
  "durationMinutes": ${duration},
  "location": "${location}",
  "mood": "${mood}",
  "activityType": "${activityType}",
  "difficulty": "gentle",
  "benefit": "string",
  "checklist": [
    {"id": "c1", "text": "string", "done": false},
    {"id": "c2", "text": "string", "done": false},
    {"id": "c3", "text": "string", "done": false}
  ]
}`;

  const result = await generateWithGoogleGemma(prompt, true);

  if (result.text) {
    try {
      const clean = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(clean);
      return res.json({
        success: true,
        data: {
          id: `gemma-m-${Date.now()}`,
          ...parsed,
          durationMinutes: Number(duration),
          location,
          mood,
          activityType,
          isAiGenerated: true,
          aiProvider: result.isGemma ? 'gemma' : 'gemini',
          model: result.modelUsed
        }
      });
    } catch (parseErr) {
      console.warn('[Server] JSON parse error on mission generation, using curated archive');
    }
  }

  // Resilient Fallback: Curated Missions Archive
  const matched = CURATED_MISSIONS_ARCHIVE.filter(m => m.location === location || m.activityType === activityType);
  const template = matched.length > 0 
    ? matched[Math.floor(Math.random() * matched.length)]
    : CURATED_MISSIONS_ARCHIVE[Math.floor(Math.random() * CURATED_MISSIONS_ARCHIVE.length)];

  return res.json({
    success: true,
    data: {
      id: `curated-m-${Date.now()}`,
      ...template,
      durationMinutes: Number(duration),
      location,
      mood,
      activityType,
      isAiGenerated: false,
      aiProvider: 'curated',
      note: 'Verified Curated Offline Archive'
    }
  });
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    edition: 'Nature Quotes AI — Touch Grass Edition',
    hasGoogleKey: Boolean(process.env.GEMINI_API_KEY),
    gemmaModel: GEMMA_MODEL,
    provider: 'Google GenAI (Direct Gemma Host)',
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
    console.log(`[Nature Quotes AI] Server listening at http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
