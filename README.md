# TruthBeacon — AI News Verification

A complete, working web application for detecting and verifying potentially fake or misleading news articles. Built as a college project using React, Convex, and Gemini AI.

## Features

- **Three Input Modes**: Paste a news URL, article text, or just a headline
- **AI-Powered Analysis**: Uses Google Gemini to extract claims and verify them against evidence
- **Evidence Search**: Searches for supporting and contradicting sources via Google Custom Search
- **Four Verdicts**: TRUE, FALSE, MISLEADING, or UNVERIFIED
- **Confidence Scores**: Evidence strength scoring with clear explanations
- **Claim-by-Claim Analysis**: Each claim analyzed individually with its own verdict
- **Source Transparency**: All evidence sources are clickable and labeled
- **Demo Mode**: Pre-built sample results for demonstration without API keys
- **History**: Stores recent analyses in browser localStorage
- **Dashboard**: Stats, verdict distribution chart, and analysis history
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Convex (serverless functions and database)
- **AI**: Google Gemini 2.0 Flash API
- **Search**: Google Custom Search JSON API
- **Auth**: Convex Auth (email OTP + anonymous)

## Setup

### 1. Clone and install

```bash
bun install
```

### 2. Configure API Keys

Set the following environment variables in the Freebuff Keys/API keys tab:

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key | For real analysis |
| `GOOGLE_SEARCH_API_KEY` | Google Custom Search API key | For evidence search |
| `GOOGLE_SEARCH_ENGINE_ID` | Google Custom Search Engine ID | For evidence search |

**Getting API Keys:**

- **Gemini API**: Visit [Google AI Studio](https://aistudio.google.com/apikey) — free tier available
- **Google Custom Search**: Visit [Google Cloud Console](https://console.cloud.google.com) → Enable Custom Search API → Create API key. Then create a Custom Search Engine at [cse.google.com](https://cse.google.com) — free tier: 100 queries/day

### 3. Run Development Server

```bash
bun run dev
```

### 4. Demo Mode

If no API keys are configured, the app automatically falls back to demo mode with pre-built sample results. Demo results are clearly labeled.

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx              # Navigation layout
│   ├── RequireAuth.tsx         # Auth guard
│   ├── analyzer/
│   │   ├── AnalysisResult.tsx  # Full results display
│   │   ├── ClaimCard.tsx       # Individual claim analysis
│   │   ├── EvidenceCard.tsx    # Evidence source card
│   │   └── VerdictBadge.tsx    # Verdict display components
│   └── ui/                     # shadcn/ui components
├── convex/
│   ├── schema.ts               # Database schema
│   ├── analyses.ts             # Analysis history queries/mutations
│   └── actions/
│       └── analyze.ts          # AI analysis action (Gemini + Search)
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   ├── demo-data.ts            # Demo mode sample data
│   └── utils.ts                # Utility functions
└── pages/
    ├── Landing.tsx              # Landing page
    ├── Analyzer.tsx             # Main analyzer page
    ├── HowItWorks.tsx           # How it works explanation
    ├── Dashboard.tsx            # Dashboard with stats and history
    ├── Auth.tsx                 # Authentication page
    └── NotFound.tsx             # 404 page
```

## How It Works

1. **Input**: User provides a news URL, pasted text, or headline
2. **Extraction**: System extracts article content (for URLs)
3. **Claim Extraction**: AI identifies up to 5 key factual claims
4. **Evidence Search**: Searches for related sources for each claim
5. **Verification**: AI compares claims against gathered evidence
6. **Verdict**: Produces a clear verdict with confidence score and explanation

## Key Design Decisions

- **UNVERIFIED over FALSE**: Breaking news without evidence is labeled UNVERIFIED, not FALSE
- **No fabricated sources**: The system never invents sources, URLs, or evidence
- **Demo mode is transparent**: Clearly labeled as sample data, never pretends to be real analysis
- **localStorage for history**: Simple, no-auth-required history storage

## Limitations

- AI cannot guarantee absolute truth
- Breaking news may lack independent verification
- Some websites block automatic article extraction
- Free tier search has query limits (100/day)
- Results depend on available evidence at time of analysis

## License

Educational project — not for production use.
