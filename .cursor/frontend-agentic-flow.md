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
- for time-boxed product work, avoid marketing copy, explanatory panels, and oversized placeholder content
- prefer minimal task-focused screens that help the user complete the next action fast
- design like a product designer shipping a real app, not a landing-page generator filling empty space
- every screen should have a clear primary action, readable hierarchy, and a reason for each block on the page
- use text sparingly and intentionally; if a paragraph does not help the user decide or act, cut it
- align third-party widgets and embedded controls with the surrounding theme using spacing, framing, contrast, and supporting layout
- prefer strong structure over decorative effects; blur, gradients, and glass should support hierarchy, not replace it
- keep spacing consistent across sections, cards, forms, and actions
- make forms and task flows feel practical: clear labels, obvious next step, short helper text, visible feedback
- prioritize scanability: headings, labels, actions, and key values should be legible within a quick glance
- avoid large dead zones, stretched copy blocks, or cards that exist only to balance composition
- avoid adding UI elements only because the layout feels empty
- keep mobile and desktop layouts intentional
- use HeroUI and local composition, not random dependency sprawl

## UX Rules

- start from the user task, then choose the smallest UI that supports it well
- keep the happy path obvious and reduce competing actions
- error, loading, empty, and success states should feel designed, not appended at the end
- preserve accessibility basics: contrast, button clarity, focusability, and sensible semantics
- prefer familiar interaction patterns for auth, forms, dashboards, and CRUD unless the user asks for something novel
- if a component looks visually imported from another system, restyle the surrounding container so it feels integrated

## Copy Rules

- avoid filler copy, product-speak, and generic motivational text
- keep headings short and specific
- keep supporting text to one or two useful sentences when possible
- do not explain implementation details in the UI unless the user needs that information to make a decision
- prefer labels and helper text that clarify action, input, or consequence

## Visual Review

Before finishing a frontend change, inspect the output and ask:

- does the page look like one coherent product instead of assembled demo blocks
- is there a strong focal point and a clear next action
- is any text present only to occupy space
- do embedded controls, forms, and widgets visually belong inside the current theme
- are spacing, corner radii, borders, and shadows consistent enough to feel intentional
- does mobile still feel designed, not merely stacked
- are loading, error, empty, and success states visually aligned with the main experience
- is there any section or card that can be removed without hurting usability

If any answer is weak, revise before finishing.

## Response Rules

- keep implementation summaries short by default
- report what changed, what was verified, and any blocker
- avoid long frontend explanations unless the user explicitly asks for them

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
- the screen passes the Visual Review section above
- copy is concise and task-focused
- components align with the established theme and spacing system
- docs are aligned
- lint, typecheck, and build pass unless blocked
