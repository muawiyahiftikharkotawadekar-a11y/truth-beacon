# TruthBeacon — Fake News Detection Web Application

AI-assisted news verification that analyzes claims and evidence to produce clear, transparent verdicts.

## Quick Start (Windows)

1. **Install Node.js** LTS from [nodejs.org](https://nodejs.org) (v18 or newer)
2. **Add your Gemini API key** — get a free one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
3. **Double-click `START.bat`**

That's it. The app opens at `http://localhost:5173`.

## Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the example env file and add your keys
cp .env.example .env

# 3. Edit .env and add your Gemini API key:
#    GEMINI_API_KEY=your_key_here

# 4. Start the dev server
npm start
```

Open `http://localhost:5173` in your browser.

## API Keys

| Key | Required | Where to get it |
|-----|----------|-----------------|
| `GEMINI_API_KEY` | Yes | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (free) |
| `GOOGLE_SEARCH_API_KEY` | No | [console.cloud.google.com](https://console.cloud.google.com) |
| `GOOGLE_SEARCH_ENGINE_ID` | No | [cse.google.com](https://cse.google.com) |

**Gemini API key** is required for analysis. The optional Google Custom Search keys improve evidence quality but the app works without them.

**Never commit `.env` to Git.** It is listed in `.gitignore`.

## Demo Mode

If no API key is configured, the app falls back to **Demo Mode** automatically:

- Click any **demo button** (True / False / Misleading / Unverified) on the Analyze page
- Demo results are clearly labeled as sample data
- Demo Mode uses pre-built examples — no API calls are made

## How It Works

1. Enter a **URL**, paste **article text**, or type a **headline**
2. The system extracts the article and identifies key claims
3. Evidence is searched from available sources
4. Gemini AI compares claims against evidence
5. You receive a **verdict** (TRUE / FALSE / MISLEADING / UNVERIFIED) with explanation

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Convex (serverless actions)
- **AI:** Google Gemini 2.0 Flash
- **Search:** Google Custom Search API (optional)
- **History:** Browser localStorage

## Project Structure

```
├── src/
│   ├── pages/           # Landing, Analyzer, Dashboard, HowItWorks
│   ├── components/      # UI components (analyzer, layout, shadcn)
│   ├── convex/          # Backend actions, schema, queries
│   ├── lib/             # Types, validation, history, demo data
│   └── hooks/           # Auth and UI hooks
├── START.bat            # Windows quick-start
├── .env.example         # Environment variable template
└── README.md            # This file
```

## Limitations

- AI cannot guarantee absolute truth — results depend on evidence quality
- Breaking news may not have enough evidence yet (will show UNVERIFIED)
- Some websites block automatic article extraction (paste text instead)
- Satire can be difficult to detect
- Opinion is different from factual reporting
