# Fullstack Agentic Flow

Use this file as the top-level instruction set for any user request that may involve backend, frontend, or coordinated full-stack feature delivery.

## Mission

This repository is a full-stack template designed for:

- fast interview execution
- AI-assisted feature delivery
- predictable architecture growth
- minimal duplication across frontend and backend work

The first responsibility is to route the task correctly before implementation starts.

## Read First

Before developing a feature, read:

- `readme.md`
- `Backend/ARCHITECTURE.md`
- `frontend/ARCHITECTURE.md`
- `.cursor/backend-agentic-flow.md`
- `.cursor/frontend-agentic-flow.md`

## Routing Decision

Classify the request into one of these paths:

1. Backend-only
   Use the backend flow when the task is mainly about APIs, DTOs, services, controllers, migrations, caching, rate limits, integrations, or backend tests.
2. Frontend-only
   Use the frontend flow when the task is mainly about routes, sections, UI states, layout composition, styling, or frontend integration wiring without backend contract changes.
3. Full-stack
   Use both flows when the task changes the API contract and the UI that consumes it.

## Full-Stack Order Of Work

When a feature spans both backend and frontend, follow this order:

1. Ask exactly 3 important clarification questions when the request is ambiguous.
2. Confirm the user flow, API inputs, API outputs, and failure states.
3. Decide whether an existing backend module and frontend route pattern can be reused.
4. Define or update backend contracts first.
5. Implement backend behavior and tests.
6. Implement frontend integration against the confirmed backend contract.
7. Add frontend validation states, loading states, and error states.
8. Update documentation in both stacks when structure or flow changes.
9. Verify backend and frontend separately before finishing.

## Clarification Gate

The 3 questions should usually cover:

- the exact user behavior or business flow
- the request and response contract
- key constraints such as auth, persistence, caching, responsiveness, or background work

If the user does not know the exact API shape, recommend one before implementation.

## Reuse Rules

- prefer extending an existing backend domain before creating a new one
- prefer extending an existing frontend route section before creating a new visual pattern
- keep backend business logic in services
- keep frontend presentation logic in reusable sections
- keep integration boundaries explicit between the two stacks
- for time-boxed app work, avoid placeholder marketing copy and verbose explanatory UI
- when frontend work is involved, prefer practical product UX over decorative layout filler

## Handoff To Child Flows

After routing:

- for backend work, follow `.cursor/backend-agentic-flow.md`
- for frontend work, follow `.cursor/frontend-agentic-flow.md`
- for full-stack work, use this file first, then apply both child flows

## Verification

Before finishing a feature:

- backend tests and runtime checks should pass unless blocked
- frontend lint, typecheck, and build should pass unless blocked
- frontend output should be visually reviewed for hierarchy, spacing, theme alignment, and state completeness
- shared docs should reflect the implemented flow
- Mermaid diagrams should be updated when architecture or request flow changed

## Response Rules

- keep updates and final summaries concise
- avoid spending tokens on long explanations unless the user asks for depth
