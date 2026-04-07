# MediCheck AI

> **Free, instant symptom checker and medication interaction detector.**
> No signup. No API keys. No cost. Deployable in 2 minutes.

## What It Does

1. **Symptom Assessment** — Describe how you feel in plain English, get a structured medical assessment with possible conditions, urgency level, and self-care tips.

2. **Drug Interaction Check** — List your medications (brand names or generic) and instantly see any known dangerous interactions from the FDA's public interaction database.

3. **Emergency Detection** — Automatically detects emergency-level symptoms (chest pain, stroke signs, anaphylaxis) and prominently alerts the user to call emergency services.

## Why It's Free Forever

- Zero external API calls — all medical knowledge is embedded in the app
- Runs on Vercel's free tier indefinitely
- No database needed — fully stateless
- No authentication, no billing

## Tech Stack

- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS** — dark UI
- **Pure TypeScript logic** — no ML, no API, just fast rule-based + semantic matching

## Local Development

```bash
git clone https://github.com/yourname/medicheck-ai
cd medicheck-ai
npm install
npm run dev
```

Open http://localhost:3000 — works immediately, no setup.

## Deploy to Vercel

```bash
npx vercel --prod
```

No environment variables needed. It works out of the box.

## How the Analysis Works

```
User input (symptoms + medications)
  ↓
Tokenise & extract keywords
  ↓
Match against 25+ condition database  →  Ranked possible conditions
Match against 80+ drug interaction DB  →  Severity-ranked interactions
Detect emergency keywords              →  Immediate alert if found
  ↓
Generate plain-English narrative
  ↓
Structured report with urgency level,
self-care tips, and when-to-see-a-doctor advice
```

The drug database covers the most common and dangerous interactions including:
- Blood thinner combinations (warfarin + NSAIDs/aspirin)
- Serotonin syndrome risks (SSRIs + tramadol/opioids)
- Statin toxicity (statins + macrolide antibiotics)
- Benzodiazepine + alcohol risks
- 30+ more interactions from FDA public data

## Project Structure

```
medicheck/
├── app/
│   ├── api/analyze/route.ts   # Analysis endpoint
│   ├── lib/
│   │   ├── knowledge.ts       # Medical knowledge base
│   │   └── engine.ts          # Analysis engine
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Full UI
├── tailwind.config.ts
└── README.md
```

## Medical Disclaimer

This tool is for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.

## License

MIT
