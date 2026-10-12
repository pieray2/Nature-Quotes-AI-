# Nature Quotes AI — Touch Grass Edition 🌿

> **Hacktoberfest 2026 Open-Source AI Challenge — Week 1 Theme: "Touch Grass"**
> *"Reconnect with nature, one moment at a time."*

Nature Quotes AI is a mobile-first, contemplative web application designed to help people reduce screen fatigue and cultivate meaningful connections with the natural world through inspiring wisdom, personalized outdoor micro-missions, procedural audio soundscapes, and mindfulness tools.

---

## 🌟 Table of Contents
1. [Why Reconnecting With Nature Matters](#why-reconnecting-with-nature-matters)
2. [Key Features](#key-features)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Open-Source AI Integration: Google Gemma](#open-source-ai-integration-google-gemma)
5. [Offline Resilience & Fallbacks](#offline-resilience--fallbacks)
6. [Privacy & Anti-Surveillance Guarantees](#privacy--anti-surveillance-guarantees)
7. [Getting Started & Installation](#getting-started--installation)
8. [Configuring a Live Gemma / Gemini Model](#configuring-a-live-gemma--gemini-model)
9. [Testing & Verification](#testing--verification)
10. [Simplest Beginner Deployment Guide](#simplest-beginner-deployment-guide)
11. [Known Limitations & Roadmap](#known-limitations--roadmap)
12. [Contributing to Hacktoberfest](#contributing-to-hacktoberfest)

---

## 🍃 Why Reconnecting With Nature Matters

Modern life immerses us in a continuous torrent of notifications, fluorescent screens, and sedentary indoor hours. Scientific research in environmental psychology and neurobiology consistently demonstrates:
- **Cortisol Reduction**: Just 10–20 minutes in a green space decreases salivary cortisol and calms the sympathetic nervous system.
- **Attention Restoration Theory (ART)**: Nature provides "soft fascination" (rustling leaves, moving clouds, dappled sunlight) that gently restores depleted executive brain function.
- **Micro-Awe**: Beholding ancient trees, night constellations, or oceanic waves fosters perspective, humility, and gratitude.

Nature Quotes AI transforms these insights into bite-sized, actionable outdoor micro-habits.

---

## ✨ Key Features

### 1. Interactive Home Dashboard
- **Daily Nature Wisdom**: Curated and AI-crafted reflections with element tags, author citations, and contemplative analysis.
- **Touch Grass Mission Card**: Actionable outdoor challenges with estimated duration, location, reason why it benefits your nervous system, and sensory checklist.
- **Outdoor Health Metrics**: Real-time counter of missions completed, total minutes outdoors, daily streak tracking, and naturalist ranks (Seed → Sprout → Sapling → Ancient Oak).
- **"Surprise Me" Action**: Instantly shuffles new quote and mission pairings.

### 2. Touch Grass Mission Generator
- Choose by **Duration** (5, 10, 20, 30 min), **Location** (Balcony, Garden, Park, Street, Nearby Nature), **Mood** (Stressed, Bored, Tired, Peaceful, Curious), and **Activity Focus** (Mindfulness, Walking, Observation, Photography, Eco-Stewardship).
- Examples include:
  - *The Five-Leaf Exploration*: Examine botanical vein structures to anchor visual focus.
  - *Birdsong Frequency Isolation*: Close eyes to locate distinct vocalizations and relax the optic nerve.
  - *Elder Tree Tactile Mapping*: Shinrin-yoku tactile grounding against mature tree bark.
  - *Cloud Velocity Survey*: Expanding visual field to reduce screen-induced eye convergence strain.

### 3. AI Nature Quote & Reflection Engine
- Custom-tailored to themes (*forests, flowers, mountains, rain, oceans, wildlife, sunrise, sustainability*), moods (*calm, hopeful, motivated, grateful, reflective*), and styles (*poetic, philosophical, short and powerful, mindfulness*).
- Delivers original prose paired with meditative commentaries.

### 4. Visual Card Studio & High-Res PNG Export
- Design custom quote cards with serif/display/sans typography, adjustable aspect ratios (Square 1:1, Story 4:5, Banner 16:9), and nature photography backdrops.
- In-browser HTML5 canvas renderer exports pristine, high-resolution PNG images for wallpapers or printing with zero external image-rendering servers.

### 5. Procedural Web Audio Soundscapes
- Built-in zero-dependency client-side procedural synthesizer generating:
  - 🌲 Whispering forest wind & rustling canopy
  - 🌊 Rhythmic ocean swells
  - 🌧️ Soft rainfall & mist
  - 🐦 Morning songbirds
  - 🔥 Night campfire crackles
  - 💧 Flowing brook stream
- Independent volume mixers and presets (*Deep Woods, Ocean Shores, Misty Rain, Hearth Camp*).

### 6. 4-7-8 Nature Breathing Sanctuary
- Pulsing visual orb synchronized with the clinical 4-7-8 breathing pattern (4s inhale, 7s hold, 8s exhale) to downregulate anxiety alongside rotating nature quotes.

### 7. Calming Dark & Light Modes
- Earthen, botanical color scheme (forest emerald, sage green, warm cream/sand, and rich loam).

---

## 🛠️ Architecture & Tech Stack

```
/
├── server.ts                       # Express full-stack proxy & Vite dev middleware
├── index.html                      # HTML5 entry with synced typography & meta
├── src/
│   ├── main.tsx                    # React 19 application entry
│   ├── App.tsx                     # Core router and state hub
│   ├── types.ts                    # TypeScript domain definitions
│   ├── services/
│   │   └── gemmaService.ts         # Open-source Gemma & Gemini API client
│   ├── data/
│   │   ├── quotes.ts               # Curated quotes archive & metadata
│   │   └── missions.ts             # Curated Touch Grass missions library
│   ├── utils/
│   │   ├── soundscapes.ts          # Procedural Web Audio API sound generator
│   │   └── cardExport.ts           # Canvas 2D image generator for high-res export
│   └── components/
│       ├── HomeDashboard.tsx       # Primary Touch Grass landing & dashboard
│       ├── QuoteCard.tsx           # Interactive quote card & studio controls
│       ├── LibraryView.tsx         # Searchable quotes archive with filters
│       ├── MissionGeneratorModal.tsx# AI & curated mission generation dialog
│       ├── AiGeneratorModal.tsx    # AI quote generator dialog
│       ├── SoundscapePlayer.tsx    # Audio mixer and preset flyout
│       ├── MeditationTimer.tsx     # 4-7-8 breathing circle
│       ├── ProgressDashboard.tsx   # Saved quotes, missions, and history log
│       └── AiTransparencyModal.tsx # Model connection test & privacy guarantees
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Backend / Proxy**: Express, `@google/genai`, Node.js 22
- **Audio Engine**: Web Audio API (procedural synthesis, 0 external audio files)
- **Image Generation**: HTML5 Canvas 2D API (client-side export)

---

## 🤖 Open-Source AI Integration: Google Gemma

This project is built around Google's open-weight **Gemma** model family (`google/gemma-2-9b-it`, `gemma-2-2b-it`).

### Core Principles
1. **Never Fake Inference**: The application explicitly reports whether an output originated from live model inference or the verified curated archive.
2. **Server-Side Credentials**: Tokens and API keys are stored only in server environment variables—never exposed to client bundles or browser storage.
3. **Graceful Fallback**: If an endpoint is rate-limited, timed out, or unconfigured, the app falls back seamlessly to the curated archive without throwing fatal errors.

### Configurable Backend
The backend proxy in `server.ts` accepts standard prompt formatting for Gemma:
```
<start_of_turn>system
You are Google Gemma, an open-weight nature philosopher.
<end_of_turn>
<start_of_turn>user
Generate a nature quote...
<end_of_turn>
<start_of_turn>model
```

---

## 📴 Offline Resilience & Fallbacks

Nature Quotes AI operates **100% offline**:
- Over 25+ curated nature quotes categorized by element, mood, and style.
- 8+ diverse outdoor missions tailored to balconies, yards, parks, and streets.
- Procedural audio synthesized entirely in JavaScript via the Web Audio API without needing internet access or remote MP3 downloads.
- Canvas image rendering performed on-device.
- Browser `localStorage` maintains saved quotes, favorite missions, and completed history across sessions.

---

## 🛡️ Privacy & Anti-Surveillance Guarantees

In the spirit of "Touching Grass":
1. **No Photographic Demands**: Users are never asked to photograph themselves or their surroundings to "prove" outdoor activity.
2. **No Location Tracking**: The app never queries the browser's GPS or Geolocation API.
3. **No Third-Party Telemetry**: Local storage stores completed activity logs strictly within your browser.

---

## 🚀 Getting Started & Installation

### Prerequisites
- Node.js 20 or higher
- npm (Node Package Manager)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/pieray2/Nature-Quotes-AI.git
cd Nature-Quotes-AI

# 2. Install dependencies
npm install

# 3. Create your environment configuration file
cp .env.example .env

# 4. Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Configuring a Live Gemma / Gemini Model

### Option A: Google Gemma via Hugging Face Access Token (`HF_TOKEN`)
1. Create a free account at [Hugging Face](https://huggingface.co/) and generate a user access token at [Settings > Access Tokens](https://hf.co/settings/tokens).
2. Accept the Gemma license terms on the model page: [google/gemma-3-4b-it](https://huggingface.co/google/gemma-3-4b-it) or [google/gemma-2-2b-it](https://huggingface.co/google/gemma-2-2b-it).
3. In your environment variables or AI Studio Secrets, add:
   ```env
   HF_TOKEN="hf_your_huggingface_token_here"
   GEMMA_MODEL_NAME="google/gemma-3-4b-it"
   ```
4. Note on Hugging Face Inference Providers: Hugging Face serverless provider routing requires pre-paid inference credits or an active HF PRO subscription (see [hf.co/settings/billing](https://hf.co/settings/billing)). If your account does not have inference credits, Nature Quotes AI will report the exact status and seamlessly provide verified curated offline wisdom and Gemini backup.

### Option B: Local Gemma via Ollama (Zero Cloud Dependencies)
1. Install [Ollama](https://ollama.ai/).
2. Pull the Gemma 2 model:
   ```bash
   ollama run gemma2:9b
   ```
3. Set the endpoint in your `.env`:
   ```env
   GEMMA_API_ENDPOINT="http://localhost:11434/api/generate"
   GEMMA_MODEL_NAME="gemma2:9b"
   ```

### Option C: Google Gemini API
Set your Google AI Studio API key:
```env
GEMINI_API_KEY="AIzaSy..."
```

---

## 🧪 Testing & Verification

Run the test and verification commands:
```bash
# Typecheck and linting
npm run lint

# Production build test
npm run build

# Start production server
npm run start
```

### In-App Connection Verification
1. Click the **Engine Status** pill in the top header (or click **AI Transparency & Privacy** in the footer).
2. Click **Test Connection**. The app executes a live inference request, measures latency in milliseconds, and displays a verified status badge.

---

## 🚢 Simplest Beginner Deployment Guide

### Deploying to Render / Railway / Google Cloud Run
1. Fork or push your repository to GitHub.
2. Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app).
3. Set the Build Command:
   ```bash
   npm install && npm run build
   ```
4. Set the Start Command:
   ```bash
   npm run start
   ```
5. Add any desired environment variables (`GEMINI_API_KEY`, `GEMMA_API_KEY`, etc.) in the dashboard settings.
6. Click **Deploy**. Your app will be live on an HTTPS domain within minutes!

---

## 🗺️ Known Limitations & Roadmap

### Known Limitations
- Serverless platforms that sleep may experience a 1–2 second cold-start latency when waking up.
- Procedural audio requires user interaction (clicking anywhere or pressing play) before the browser permits audio output, in compliance with standard browser autoplay policies.

### Roadmap
- [ ] Exportable weekly outdoor journal summary (PDF / Markdown).
- [ ] Seasonal solstices and equinoxes calendar reminders.
- [ ] Multi-lingual quote translations.

---

## 🤝 Contributing to Hacktoberfest

We warmly welcome contributions during Hacktoberfest and beyond!
1. **Fork** the repository on GitHub.
2. **Create a branch** for your feature (`git checkout -b feature/sensory-mission`).
3. **Commit** your changes with clear messages.
4. **Push** to your branch and open a Pull Request.

Please review our friendly issue tracker for good first issues!

---

### License
Apache 2.0. Created with heart for nature lovers everywhere. 🌲
