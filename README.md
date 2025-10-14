# AI Soil Health Monitor 🌱

A comprehensive AI-powered platform for monitoring land degradation, analyzing soil health, and providing actionable insights for sustainable land management.

## 🎯 Project Overview

The AI Soil Health Monitor addresses critical challenges in land degradation by providing:

# AI Soil Health Monitor 🌱

A lightweight, professional README for the AI Soil Health Monitor project. This repo is an AI-powered platform for monitoring land parcels, analyzing soil and vegetation from imagery, and providing actionable recommendations and alerts for land restoration.

Live demo: https://soil-health-monitor.netlify.app/

## Contents

- About
- Live demo
- Features
- Tech stack
- Quickstart
- Environment
- Database setup
- API (example)
- Development notes
- Deployment
- Project structure
- Contributing
- Troubleshooting
- License

## About

AI Soil Health Monitor helps land managers, NGOs, and farmers monitor soil and vegetation health using satellite imagery and AI. It combines a Next.js frontend, Supabase backend (Postgres + Auth), and a pluggable AI analysis module (default: Claude AI).

## Live demo

Try the hosted demonstration:

https://soil-health-monitor.netlify.app/

If you use this repo locally, create your own Supabase project or sign in to the demo where available.

## Key features

- Dashboard with map and quick stats
- Multi-parcel land management
- AI analysis: NDVI, moisture, erosion risk, pH/organic matter estimates
- Historical analysis timeline and recommendations
- Automated alerts (priority, status) and notifications
- Email-based auth (Supabase) and protected routes
- Responsive UI built with shadcn components

## Tech stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Postgres, Auth)
- Claude AI (Anthropic) via Vercel AI SDK (replaceable)
- Leaflet (map ready)
- Recharts (charts)

## Quickstart (local)

1. Clone the repository

```powershell
git clone https://github.com/haileznabu/ai-soil-health-monitor.git
cd ai-soil-health-monitor
```

2. Install dependencies

```powershell
pnpm install
# or
npm install
```

3. Copy environment variables (see next section) into `.env.local`

4. Create database schema using the SQL scripts in `scripts/`

5. Start the development server

```powershell
pnpm dev
# or
npm run dev
```

6. Open http://localhost:3000

## Environment variables

Create a `.env.local` file in the repository root with these variables:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Optional AI provider
ANTHROPIC_API_KEY=<your-anthropic-api-key>
```

Important:

- Keep `SUPABASE_SERVICE_ROLE_KEY` secret.
- Replace placeholder values with your Supabase project credentials.

## Database setup

Run the two SQL scripts in `scripts/` using the Supabase SQL editor or Supabase CLI.

Option A — Supabase SQL editor

1. Go to your Supabase project → SQL Editor
2. Run `scripts/001_create_tables.sql`
3. Run `scripts/002_create_profile_trigger.sql`

Option B — Supabase CLI

```powershell
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

Expected core tables:

- `profiles`
- `land_areas`
- `soil_health_data`
- `alerts`
- `recommendations`

Note: RLS policies are expected so users only access their own data.

## API example — Analyze soil

Endpoint: POST `/api/analyze-soil`

Request body (JSON):

```json
{
  "imageUrl": "https://example.com/satellite.jpg",
  "landAreaId": "<uuid>",
  "coordinates": { "latitude": -1.234, "longitude": 36.789 }
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "ndvi": 0.42,
    "soilMoisture": 12.7,
    "erosionLevel": "moderate",
    "vegetationHealth": "fair",
    "phLevel": 6.2,
    "organicMatter": 3.2,
    "degradationRisk": "moderate",
    "analysis": "AI-generated summary...",
    "recommendations": ["Add cover crop", "Reduce tillage"]
  }
}
```

If you change AI providers, update `lib/ai/analyze-soil-health.ts` and the API to match the provider SDK.

## Development notes

- Components: `components/` (shadcn patterns)
- AI helper: `lib/ai/analyze-soil-health.ts`
- Supabase wrappers: `lib/supabase/`
- Types: `lib/types/database.ts`

Edge cases to consider:

- Large image uploads (timeouts) — ensure API timeouts and retries
- Invalid or inaccessible image URLs — return clear 4xx responses
- AI provider quota exhaustion — implement rate limiting and graceful degradation

## Deployment

Vercel (recommended): import repository, set env vars in Vercel dashboard, and deploy. Update Supabase auth redirect URIs for production domain.

Netlify: frontend can be deployed to Netlify, but server endpoints may require separate serverless functions or a Vercel deployment for APIs. The public demo is hosted on Netlify:

https://soil-health-monitor.netlify.app/

## Project structure

```
app/                # Next.js App Router (pages & API)
components/         # UI components
lib/                # helpers, supabase clients, AI helpers
scripts/            # DB scripts
public/             # static assets
```

## Contributing

Contributions welcome. Please:

1. Fork the repository
2. Create a feature branch
3. Run the app, add tests where appropriate
4. Open a PR with a clear description

## Troubleshooting

- Module not found: delete `node_modules` and reinstall
- Database connection: verify `.env.local` and Supabase project
- Auth problems: confirm redirect URL in Supabase settings
- AI issues: verify provider API key and access

## License

MIT — see repository license for details.

---
