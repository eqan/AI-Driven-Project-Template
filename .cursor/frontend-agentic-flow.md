# Frontend Agentic Flow

Use this file as the frontend child instruction set for any frontend feature, refactor, design update, integration task, or frontend-facing documentation change after task routing has been decided.

Read `.cursor/fullstack-agentic-flow.md` first when the request may involve both frontend and backend changes.

## Mission

This frontend should stay:

- visually strong out of the box
- easy to extend under interview pressure
- obvious for AI tools to read and continue
- aligned with backend contracts and environment-driven runtime settings

## Read First

Before editing frontend behavior, read:

- `frontend/ARCHITECTURE.md`
- `frontend/app/layout.tsx`
- `frontend/app/page.tsx`
- `frontend/config/site.ts`
- `frontend/styles/globals.css`
- `frontend/README.md`

If changing a specific route, also read the route page and any reused section components.

## Documentation Style

Frontend documentation should be architecture-first and Mermaid-first.

Rules:

- prefer Mermaid diagrams over long prose
- keep text concise and directive
- show route flow, section composition, and integration boundaries
- update diagrams whenever structure or feature flow changes

## Frontend Structure

The frontend is organized around:

- `app/`: route pages and layout composition
- `components/`: reusable visual building blocks
- `config/`: site metadata and reusable content maps
- `styles/`: global visual tokens and theme glue

## Feature Workflow

When asked to add a frontend feature:

1. Ask exactly 3 important clarification questions when the request is ambiguous.
2. Confirm the route, actor, and desired interaction flow.
3. Confirm the API inputs, outputs, and UI states when backend data is involved.
4. Reuse an existing route section or component pattern when it fits.
5. Create a new section or route only when the concept is genuinely separate.
6. Keep server components as the default starting point.
7. Add client components only for interactivity, browser APIs, or local state.
8. Add loading, empty, success, and error states deliberately.
9. Update docs when structure, patterns, or flows change.
10. Verify with `npm run lint`, `npm run typecheck`, and `npm run build`.

## Clarification Gate

The 3 questions should usually cover:

- the exact screen or workflow to build
- the API or data contract shape
- important constraints such as auth, responsiveness, caching, or feature flags

If the user is unsure, recommend a concrete screen structure and request/response flow before implementation.

## Design Rules

- preserve one coherent visual language
- prefer reusable sections over one-off layouts
- avoid generic template filler once the project direction is known
- keep mobile and desktop layouts intentional
- use HeroUI and local composition, not random dependency sprawl

## Data And Integration Rules

- keep backend calls out of leaf presentation components
- centralize future API access in a dedicated typed layer
- use `.env.local` for environment-specific frontend settings
- keep frontend shapes aligned with backend DTOs

## Delivery Checklist

Before finishing frontend work, verify:

- clarification happened when the request was ambiguous
- route and state flow are clear
- an existing component pattern was reused when relevant
- new UI works on mobile and desktop
- docs are aligned
- lint, typecheck, and build pass unless blocked
