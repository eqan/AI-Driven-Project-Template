# Frontend Template

This frontend is a Next.js App Router and HeroUI baseline for fast product delivery, strong visual defaults, and AI-assisted scaling.

## Stack

- Next.js App Router
- HeroUI v3
- Tailwind CSS v4
- TypeScript

Theme mode posture:

- the template ships with a stable default dark theme
- theme toggling is intentionally not enabled in the baseline because the current `next-themes` plus Next 16 dev combination is noisy in local hydration

## Local Setup

```bash
cd frontend
nvm use
npm install
npm run dev
```

Recommended runtime:

- Node `22.22.0` from [`.nvmrc`](/Users/eqanahmad/Desktop/Project-Template/frontend/.nvmrc:1)

## Environment

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Commands

```bash
cd frontend
npm run dev
npm run lint
npm run lint:fix
npm run typecheck
npm run build
```

## Structure

```text
frontend/
├── app/
├── components/
├── config/
├── public/
├── styles/
├── ARCHITECTURE.md
└── package.json
```

Main architecture guidance lives in [`ARCHITECTURE.md`](/Users/eqanahmad/Desktop/Project-Template/frontend/ARCHITECTURE.md:1).
