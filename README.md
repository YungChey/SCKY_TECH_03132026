# VerdictAI

VerdictAI is a web application that monitors AI shopping answers, extracts product claims, verifies those claims against trusted product data, and calculates a Trust Score for brands. It is designed for businesses that want to understand how AI represents their products, detect misleading or hallucinated answers, and improve customer trust over time.

## What The Application Does

VerdictAI allows a user to enter a shopping-style query such as `best laptops under $500` and then:

- generates or simulates an AI shopping answer
- extracts claims from that answer
- detects brand mentions dynamically
- verifies claims against structured product data
- labels claims as `Verified`, `Partially Verified`, `Unverified`, or `Unknown`
- calculates a Trust Score
- shows evidence, objections, and a final verdict
- stores every run as analysis history for retesting and trend review
- includes prompt library, trend monitoring, and retest history views
- includes a separate risk/compliance page with company policy content

The current version is demo-safe:

- if `OPENAI_API_KEY` is configured, the app can use the live API flow
- if the API is unavailable, the app falls back to realistic demo responses so judges can still review the product experience
- each analysis run is also stored locally so VerdictAI can retain evidence, scores, objections, and fixes as a research dataset

## Tech Stack / Frameworks

- `Next.js` App Router
- `React`
- `TypeScript`
- `Tailwind CSS`
- `Prisma`
- `SQLite` for local analysis history
- local verification logic and structured product catalog in `lib/`

## What A Judge Should Look At

### Main Dashboard

Open the main dashboard at:

- [http://localhost:3000](http://localhost:3000)

What to review:

- top search/analyze experience
- dynamic Brand Monitoring Grid
- Trust Score Dashboard
- prompt library and retest history
- trend dashboard and source-backed verification record
- Evidence and Objections section
- pricing cards
- final verdict panel

Recommended demo prompts:

- `best laptops under $500`
- `best noise-cancelling headphones`
- `affordable 4k monitors`
- `best phone with a good camera`
- `protein powder for muscle gain`

### Risk & Compliance Page

Open:

- [http://localhost:3000/risk](http://localhost:3000/risk)

What to review:

- company policies
- privacy / ethics / accuracy / security / compliance framing
- client-facing risk narrative

## How To Run The Application

### Recommended: run script

From the project root:

```bash
./run.sh
```

If the script is not executable yet, run:

```bash
chmod +x run.sh
./run.sh
```

### Manual run

```bash
cd "/Users/cheyy/Downloads/BOTB March 2026/verdictai"
npm install
npm run db:init
npm run dev
```

## Database

VerdictAI includes a local SQLite database managed through Prisma.

Stored data includes:

- prompts and raw AI answers
- extracted claims
- claim verification results
- brand mentions
- resolved brand and product context
- evidence and objections
- recommended fixes
- trust score and verdict history

Key files:

- `prisma/schema.prisma`
- `prisma/migrations/20260313000000_init_analysis_history/migration.sql`
- `prisma/dev.db`

Initialize the database manually with:

```bash
npm run db:init
```

Production note:

- local persistence works for development and submission review
- the current Vercel deployment should still be treated as demo hosting, not durable long-term storage
- for real hosted persistence, keep the Prisma models and switch `DATABASE_URL` to Postgres

## Environment Variables

The app works in two modes:

### Demo Mode

No setup required. If no API key is configured, the app still runs using realistic demo responses.

### Live API Mode

Create `.env.local` in the project root:

```env
OPENAI_API_KEY=your_real_openai_api_key
OPENAI_MODEL=gpt-5
```

Then restart the dev server.

## How To Tell If The App Started Successfully

In the terminal, you should see output similar to:

```bash
Local: http://localhost:3000
```

Then open:

- [http://localhost:3000](http://localhost:3000)

The app started successfully if:

- the VerdictAI dashboard loads in the browser
- typing a prompt and clicking `Analyze` updates the dashboard
- the Brand Monitoring Grid changes based on the query
- the Evidence / Objections / Verdict sections populate

## Project Structure

- `app/`
  - main app routes
- `/api/analyze` API route
- `/api/insights` trend and history API route
  - `/risk` policy and compliance page
- `components/`
  - dashboard UI components
- `lib/`
  - claim extraction
  - product verification logic
  - demo response fallback
  - trust score analysis logic
  - Prisma persistence helpers

## Notes For Judges

- The product is intentionally structured like a business-facing SaaS dashboard.
- The current implementation prioritizes explainability and demo reliability.
- The system includes verification, entity resolution confidence, and recommended fixes without changing the dashboard layout.
