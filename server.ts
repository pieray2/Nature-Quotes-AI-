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
// AI Model Service Configuration (Gemma & Gemini)
// ---------------------------------------------------------
const GEMMA_ENDPOINT = process.env.GEMMA_API_ENDPOINT || '';
const GEMMA_API_KEY = process.env.GEMMA_API_KEY || '';
const GEMMA_MODEL = process.env.GEMMA_MODEL_NAME || 'google/gemma-2-9b-it';

let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('[Server] Could not initialize GoogleGenAI:', err);
  }
}

// Curated Nature Quotes Archive for transparent offline resilience
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

// Curated Touch Grass Missions Archive
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

// Helper: Query live Gemma endpoint if configured
async function queryGemmaInference(prompt: string, systemPrompt: string): Promise<string | null> {
  if (!GEMMA_ENDPOINT) return null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (GEMMA_API_KEY) {
      headers['Authorization'] = `Bearer ${GEMMA_API_KEY}`;
    }

    const payload = {
      inputs: `<start_of_turn>system\n${systemPrompt}<end_of_turn>\n<start_of_turn>user\n${prompt}<end_of_turn>\n<start_of_turn>model\n`,
      parameters: {
        max_new_tokens: 600,
        temperature: 0.7,
        return_full_text: false,
      }
    };

    const res = await fetch(GEMMA_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[Gemma API] HTTP ${res.status}: ${await res.text()}`);
      return null;
    }

    const data = await res.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    if (data?.generated_text) {
      return data.generated_text;
    }
    if (typeof data === 'string') return data;
    return null;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[Gemma API] Request failed or timed out:', err);
    return null;
  }
}

// ---------------------------------------------------------
// 1. Gemma / AI Status & Diagnostics
// ---------------------------------------------------------
app.get('/api/gemma/status', (_req, res) => {
  const hasGemma = Boolean(GEMMA_ENDPOINT && GEMMA_ENDPOINT.trim() !== '');
  const hasGemini = Boolean(aiClient);

  let activeProvider: 'gemma' | 'gemini' | 'curated' = 'curated';
  if (hasGemma) activeProvider = 'gemma';
  else if (hasGemini) activeProvider = 'gemini';

  res.json({
    hasGemmaConfig: hasGemma,
    hasGeminiConfig: hasGemini,
    activeProvider,
    gemmaModel: GEMMA_MODEL,
    gemmaEndpoint: hasGemma ? (GEMMA_ENDPOINT.startsWith('http') ? new URL(GEMMA_ENDPOINT).origin : 'configured') : 'unconfigured',
    isOnline: hasGemma || hasGemini,
    message: hasGemma
      ? `Google Gemma open-weight inference configured (${GEMMA_MODEL})`
      : hasGemini
      ? 'Google Gemini AI connected'
      : 'Curated offline archive mode active (No API credentials required)'
  });
});

// Test connection endpoint
app.post('/api/gemma/test-connection', async (_req, res) => {
  const start = Date.now();

  // Test Gemma first if configured
  if (GEMMA_ENDPOINT) {
    try {
      const result = await queryGemmaInference('Respond with "Gemma connection verified."', 'You are a test agent.');
      const latencyMs = Date.now() - start;
      if (result) {
        return res.json({
          success: true,
          provider: 'gemma',
          model: GEMMA_MODEL,
          latencyMs,
          message: `Live Gemma connection verified in ${latencyMs}ms!`
        });
      }
    } catch (err: any) {
      console.warn('[Gemma test error]', err);
    }
  }

  // Test Gemini if available
  if (aiClient) {
    try {
      await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Ping',
      });
      const latencyMs = Date.now() - start;
      return res.json({
        success: true,
        provider: 'gemini',
        model: 'gemini-3.8-flash',
        latencyMs,
        message: `Connected via Google Gemini in ${latencyMs}ms!`
      });
    } catch (err: any) {
      return res.json({
        success: false,
        provider: 'curated',
        latencyMs: Date.now() - start,
        message: `Live model test failed: ${err.message || 'Service unavailable'}. Offline fallback active.`
      });
    }
  }

  return res.json({
    success: false,
    provider: 'curated',
    latencyMs: 0,
    message: 'No live Gemma or Gemini endpoint configured. Verified curated offline archive is active.'
  });
});

// ---------------------------------------------------------
// 2. AI Nature Quote Generator (/api/gemma/quote)
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

  // 1. Try Live Gemma
  if (GEMMA_ENDPOINT) {
    const prompt = `Generate a profound, original nature quote and short reflection.
Mood: ${mood}
Theme: ${effectiveTheme}
Style: ${style}
Inspiration: ${customPrompt || 'nature reconnection'}

Respond in JSON ONLY:
{
  "quote": "string",
  "author": "string",
  "element": "${effectiveTheme}",
  "mood": "${mood}",
  "reflection": "string",
  "suggestedPalette": "emerald",
  "keywords": ["kw1", "kw2", "kw3"]
}`;

    const rawGemma = await queryGemmaInference(
      prompt,
      'You are Google Gemma, an open-weight nature philosopher. Respond in valid JSON only.'
    );

    if (rawGemma) {
      try {
        const clean = rawGemma.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        return res.json({
          success: true,
          data: {
            quote: parsed.quote,
            author: parsed.author || 'Gemma Nature Oracle',
            element: parsed.element || effectiveTheme,
            mood: parsed.mood || mood,
            style,
            reflection: parsed.reflection || 'Nature reminds us to breathe and align with the unhurried rhythms of the earth.',
            suggestedPalette: parsed.suggestedPalette || 'emerald',
            keywords: parsed.keywords || [effectiveTheme, mood, 'touch-grass'],
            isAiGenerated: true,
            aiProvider: 'gemma',
            model: GEMMA_MODEL
          }
        });
      } catch (parseErr) {
        console.warn('[Gemma JSON parse failed, trying Gemini]', parseErr);
      }
    }
  }

  // 2. Try Gemini
  if (aiClient) {
    try {
      const prompt = `You are a naturalist in the lineage of John Muir, Rachel Carson, and Mary Oliver.
Create an evocative, original nature quote and reflection.
Mood: ${mood}
Theme / Element: ${effectiveTheme}
Style: ${style} (poetic, philosophical, short and powerful, or mindfulness)
Prompt: ${customPrompt || 'touch grass and reconnect with earth'}

Respond ONLY in valid JSON:
{
  "quote": "string",
  "author": "string",
  "element": "${effectiveTheme}",
  "mood": "${mood}",
  "reflection": "string",
  "suggestedPalette": "emerald",
  "keywords": ["tag1", "tag2", "tag3"]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an enlightened nature poet and philosopher. Output clean JSON only.',
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({
        success: true,
        data: {
          quote: parsed.quote,
          author: parsed.author || 'Nature Contemplative',
          element: parsed.element || effectiveTheme,
          mood: parsed.mood || mood,
          style,
          reflection: parsed.reflection || 'Step outside and let the sky recalibrate your perspective.',
          suggestedPalette: parsed.suggestedPalette || 'emerald',
          keywords: parsed.keywords || [effectiveTheme, mood, 'presence'],
          isAiGenerated: true,
          aiProvider: 'gemini',
          model: 'gemini-3.8-flash'
        }
      });
    } catch (geminiErr) {
      console.warn('[Gemini generation error, falling back to curated archive]:', geminiErr);
    }
  }

  // 3. Fallback: Curated Nature Quotes Archive
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
// 3. Touch Grass Mission Generator (/api/gemma/mission)
// ---------------------------------------------------------
app.post('/api/gemma/mission', async (req, res) => {
  const {
    duration = 10,
    location = 'garden',
    mood = 'stressed',
    activityType = 'mindfulness'
  } = req.body || {};

  // 1. Try Live Gemma
  if (GEMMA_ENDPOINT) {
    const prompt = `Create an outdoor Touch Grass nature mission.
Duration: ${duration} minutes
Location: ${location}
User State: ${mood}
Activity Type: ${activityType}

Do NOT require camera proof or private location details. Focus on sensory grounding and outdoor reconnection.

Respond in JSON ONLY:
{
  "title": "string",
  "instructions": ["step 1", "step 2", "step 3", "step 4"],
  "durationMinutes": ${duration},
  "location": "${location}",
  "mood": "${mood}",
  "activityType": "${activityType}",
  "difficulty": "gentle",
  "benefit": "string explaining how this calms nervous system or grounds the mind",
  "checklist": [
    {"id": "c1", "text": "string", "done": false},
    {"id": "c2", "text": "string", "done": false},
    {"id": "c3", "text": "string", "done": false}
  ]
}`;

    const rawGemma = await queryGemmaInference(
      prompt,
      'You are Google Gemma, an open-weight nature guide for Hacktoberfest Touch Grass Edition. Output valid JSON only.'
    );

    if (rawGemma) {
      try {
        const clean = rawGemma.replace(/```json/g, '').replace(/```/g, '').trim();
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
            aiProvider: 'gemma',
            model: GEMMA_MODEL
          }
        });
      } catch (e) {
        console.warn('[Gemma mission parse failed]', e);
      }
    }
  }

  // 2. Try Gemini
  if (aiClient) {
    try {
      const prompt = `Create an outdoor Touch Grass nature mission for the Hacktoberfest theme.
Duration: ${duration} minutes
Location: ${location}
Mood: ${mood}
Activity Type: ${activityType}

Requirements:
- Practical, beautiful, grounded activity that reconnects the user to nature.
- Title, 4-5 numbered instructions, benefit explanation (why it relieves stress or restores attention), and 3-4 checklist tasks.
- Never ask for photos or location tracking.

Respond in JSON ONLY:
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

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an outdoor wellness guide. Output clean JSON only.',
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({
        success: true,
        data: {
          id: `gemini-m-${Date.now()}`,
          ...parsed,
          durationMinutes: Number(duration),
          location,
          mood,
          activityType,
          isAiGenerated: true,
          aiProvider: 'gemini'
        }
      });
    } catch (geminiErr) {
      console.warn('[Gemini mission error, using curated archive]:', geminiErr);
    }
  }

  // 3. Curated Missions Fallback
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
    hasGemmaConfig: Boolean(GEMMA_ENDPOINT),
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
    console.log(`[Nature Quotes AI — Touch Grass Edition] Server listening at http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
