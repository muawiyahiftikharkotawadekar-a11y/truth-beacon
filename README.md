# TruthBeacon — Fake News Detection Web Application

AI-assisted news verification that analyzes claims and evidence to produce clear, transparent verdicts.

---

## Prerequisites

- **Node.js** v18 or newer — download from [nodejs.org](https://nodejs.org)
- A **Gemini API key** (free) — get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## Running the App

The app runs on **http://localhost:5173**. Pick the method that fits your setup.

---

### Method 1 — Windows: Double-click START.bat (easiest)

1. Double-click **`START.bat`** in the project folder
2. The script checks Node.js, installs dependencies, shows API key status, then opens your browser
3. If no `.env` exists, it creates one from `.env.example`
4. Edit `.env` and paste your Gemini API key next to `GEMINI_API_KEY=`
5. Restart the app (re-run `START.bat` or press Ctrl+C and re-run `npm start`)

---

### Method 2 — Windows / Mac / Linux: npm (manual)

```bash
# Open a terminal in the project folder

# Step 1: Install dependencies (only needed once)
npm install

# Step 2: Create your .env file
#   Windows (Command Prompt):
copy .env.example .env
#   Mac / Linux:
cp .env.example .env

# Step 3: Open .env in any text editor and add your Gemini key:
#   GEMINI_API_KEY=your_key_here

# Step 4: Start the app
npm start
```

Open **http://localhost:5173** in your browser.

---

### Method 3 — Using Bun (alternative package manager)

```bash
# Install Bun if you don't have it: https://bun.sh

bun install

# Copy .env
#   Windows:   copy .env.example .env
#   Mac/Linux: cp .env.example .env

# Edit .env and add GEMINI_API_KEY=your_key_here

# Start
bun run start
```

Open **http://localhost:5173** in your browser.

---

### Method 4 — Demo Mode (no API key needed)

You can explore the full UI **without any API keys**:

1. Run the app using any method above
2. Go to the **Analyze** page
3. Click any **demo button**: True Example / False Example / Misleading / Unverified
4. A full result appears — clearly labeled as **"Demo Mode"**

Demo Mode is a fallback when APIs are unavailable. It never mixes fake data with real analysis.

---

### Method 5 — Convex Dev Server (full backend)

The project uses Convex for the backend. To run the full Convex dev process alongside Vite:

```bash
# Terminal 1 — Convex backend
npx convex dev

# Terminal 2 — Vite frontend
npm start
```

If you only want the frontend with Demo Mode, you can skip the Convex terminal. The app will fall back to demo results gracefully.

---

### Method 6 — Production Build

```bash
npm run build
npm run preview
```

Opens on **http://localhost:4173** (Vite preview default).

---

## API Keys

| Key | Required | Where to get it | Free tier |
|-----|----------|-----------------|-----------|
| `GEMINI_API_KEY` | **Yes** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Yes |
| `GOOGLE_SEARCH_API_KEY` | No | [console.cloud.google.com](https://console.cloud.google.com) | 100 queries/day |
| `GOOGLE_SEARCH_ENGINE_ID` | No | [cse.google.com](https://cse.google.com) | Free |

- **Gemini API key** — required for all real analysis
- **Google Search keys** — optional, improves evidence quality
- All keys go in the `.env` file, never in frontend code
- `.env` is in `.gitignore` and will not be committed

---

## How It Works

1. Enter a **URL**, paste **article text**, or type a **headline**
2. The system extracts the article and identifies key factual claims
3. Evidence is searched from available sources
4. Gemini AI compares claims against evidence
5. You receive a **verdict** (TRUE / FALSE / MISLEADING / UNVERIFIED) with explanation and sources

---

## Error Handling

| Problem | What happens |
|---------|-------------|
| No API key configured | Shows "Configuration Notice" banner + loads demo result |
| Invalid API key | Shows clear error: "Check that your Gemini API key is valid" |
| Article URL can't be read | Shows: "Please paste the article text instead" |
| No internet | Shows network error with suggestion to check connection |
| Breaking news (no evidence yet) | Returns **UNVERIFIED** — does NOT default to FALSE |
| No evidence found | Returns **UNVERIFIED** with explanation |

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Convex (serverless actions)
- **AI:** Google Gemini 2.0 Flash
- **Search:** Google Custom Search API (optional)
- **History:** Browser localStorage

---

## Project Structure

```
├── src/
│   ├── pages/           # Landing, Analyzer, Dashboard, HowItWorks
│   ├── components/      # UI components (analyzer, layout, shadcn)
│   ├── convex/          # Backend actions, schema, queries
│   ├── lib/             # Types, validation, history, demo data
│   └── hooks/           # Auth and UI hooks
├── START.bat            # Windows one-click start
├── .env.example         # Environment variable template
└── README.md            # This file
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `node is not recognized` | Install Node.js LTS from [nodejs.org](https://nodejs.org) and restart your terminal |
| `npm start` does nothing | Make sure you're in the project folder (where `package.json` is) |
| Blank page or React errors | Run `npm install` again to reinstall dependencies |
| "Cannot find module" errors | Delete `node_modules` and `package-lock.json`, then run `npm install` |
| Port 5173 already in use | Close the other process using that port, or Vite will suggest an alternate port |
| API key not working | Make sure there are no extra spaces or quotes around the key in `.env` |

---

## Limitations

- AI cannot guarantee absolute truth — results depend on evidence quality
- Breaking news may not have enough evidence yet (will show UNVERIFIED)
- Some websites block automatic article extraction (paste text instead)
- Satire can be difficult to detect
- Opinion is different from factual reporting
