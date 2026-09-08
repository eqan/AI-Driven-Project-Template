# Backend Architecture

This backend is a reusable project template meant for interview-speed delivery, AI-assisted iteration, and controlled growth. The goal is not just to make the current feature set work, but to make the next feature easy to add without rewriting foundations.

## Purpose

This backend should feel:

- easy to extend without hunting through unrelated files
- predictable for AI agents and human contributors
- safe to evolve through typed configuration and shared patterns
- resilient when optional third-party systems are unavailable

The design principle is simple: if a pattern will likely repeat, codify it once and reuse it.

## Architectural Priorities

1. Keep controllers thin.
2. Put product behavior in services.
3. Put provider-specific code in integrations.
4. Put reusable request auth in dependencies.
5. Put deployment-specific values in `.env`.
6. Put template defaults in `app/config/runtime.json`.
7. Prefer shared infrastructure over one-off local fixes.

## Current Layout

```text
Backend/
├── app/
│   ├── app.py
│   ├── base.py
│   ├── database.py
│   ├── chatbot/
│   ├── config/
│   ├── dependencies/
│   ├── ingestion/
│   ├── integrations/
│   ├── prompts/
│   ├── stats/
│   ├── ticket/
│   ├── users/
│   └── utils/
├── alembic/
├── tests/
├── main.py
├── run.sh
└── pyproject.toml
```

## Domain Structure

Each backend domain should follow the same shape whenever possible:

1. `dtos/`
   Request and response contracts.
2. `models/`
   ORM models and persistence shapes.
3. `<domain>Controller.py`
   Route definitions and thin request handling.
4. `<domain>Service.py`
   Business logic and orchestration.

Current domains:

- `chatbot/`
  Chat generation, SSE streaming, chat persistence, ticket triggers.
- `users/`
  Google auth exchange, JWT verification, user persistence.
- `ticket/`
  Ticket creation, updates, retrieval.
- `stats/`
  Conversation analytics and scheduled stat generation.
- `ingestion/`
  Scraping, content transformation, embeddings, vector search.

## Cross-Cutting Layers

These directories exist to stop domains from re-implementing the same infrastructure concerns:

- `config/`
  Typed settings, runtime configuration, SQLAlchemy engine, limiter, lazy client factories.
- `dependencies/`
  Shared FastAPI dependencies, currently centered around auth.
- `integrations/`
  Provider adapters for Gemini, DeepSeek, Pinecone, Voyage, and Firecrawl.
- `utils/`
  Shared helpers such as caching and payload guards.
- `prompts/`
  Prompt loading and prompt assets for LLM workflows.

## Request Lifecycle

The intended backend flow for a typical request is:

1. Route enters through a controller.
2. Controller validates the incoming DTO.
3. Shared dependency handles auth or request guards if needed.
4. Controller delegates to exactly one main service flow.
5. Service coordinates domain logic.
6. Service uses `session_scope()` for DB work.
7. Service calls `integrations/` when external providers are involved.
8. Service returns a structured result.
9. Controller returns the result with minimal transformation.

In shorthand:

`controller -> dependency -> service -> database/integration -> service -> response`

## Application Bootstrap

The startup path is:

1. `main.py`
   Local launcher for Uvicorn.
2. `app/app.py`
   Builds the FastAPI app through `create_app()`.
3. `app/config/settings.py`
   Loads typed settings and runtime config.
4. `app/config/config.py`
   Initializes shared infrastructure and lazy external clients.

Rules for bootstrap changes:

- keep `create_app()` as the composition boundary
- avoid side effects in route modules where possible
- never make optional providers crash import-time startup
- keep reload and worker behavior deterministic

## Configuration Model

There are two configuration sources by design.

### Environment Layer

`Backend/.env` is for environment-specific values such as:

- secrets
- host and port overrides
- database credentials
- provider API keys
- deployment-specific runtime overrides

### Template Runtime Layer

`Backend/app/config/runtime.json` is for reusable template defaults such as:

- server defaults
- rate limits
- cache defaults
- feature flags
- CORS defaults
- DB pool tuning
- AI defaults

### Precedence

The intended rule is:

- `runtime.json` defines template defaults
- `.env` overrides values that vary by environment

If a new knob is likely to vary between local, staging, and production, prefer `.env`.
If a new knob expresses a reusable template default, prefer `runtime.json`.

## Feature Flags

Feature flags exist to let the same codebase support a slim demo mode and a fuller production-style mode.

Current feature flags:

- `enable_scheduler`
- `enable_stats`
- `enable_ticketing`
- `enable_ingestion`
- `enable_sentry`
- `enable_google_search_grounding`

Feature flags should be:

- declared in typed settings/runtime config
- checked in app composition or service boundaries
- reflected in tests when behavior changes materially

## Controller Conventions

Controllers are intentionally small.

Controllers should:

- define endpoints
- bind DTOs
- apply dependencies
- apply rate limits from runtime settings
- delegate to services
- return clean HTTP responses

Controllers should not:

- build raw SQLAlchemy queries
- manage transactions directly
- wire up SDK clients
- contain long orchestration logic
- hide configuration literals that belong in settings

## Service Conventions

Services are the primary home for backend logic.

Services should:

- own business rules
- orchestrate DB access
- orchestrate provider calls
- isolate transformation logic in helper methods
- keep methods small enough that future edits stay surgical

For new work:

- prefer `session_scope()` from `app/database.py`
- reuse existing helpers before introducing parallel patterns
- improve local legacy code if you are already changing that area

## Database Conventions

Current stack:

- PostgreSQL
- SQLAlchemy ORM
- Alembic for migrations
- `session_scope()` as the default transaction helper

Rules:

- keep DTOs separate from ORM models
- keep transaction scope narrow
- avoid leaking sessions across methods
- use UTC timestamps for created and updated fields
- plan schema changes with migrations instead of silent drift

When a schema change is required:

1. Update the ORM model.
2. Add an Alembic migration.
3. Adjust DTOs and service logic.
4. Update tests.

## Integration Conventions

External systems should be accessed through `app/integrations/`.

Current adapters include:

- `gemini_client.py`
- `deepseek_client.py`
- `pinecone_client.py`
- `voyage_client.py`
- `firecrawl_client.py`

Why this layer exists:

- provider code changes faster than domain logic
- AI agents tend to duplicate SDK wiring if not constrained
- service code is easier to reason about when provider details are isolated

Rules:

- controllers never talk directly to providers
- services should prefer integration adapters over SDK calls
- missing optional credentials should degrade gracefully
- configuration for integrations belongs in settings, not hardcoded call sites

## Auth And Dependency Conventions

Shared request dependencies belong in `app/dependencies/`.

Current usage:

- auth validation for protected endpoints
- user-id extraction for authenticated chatbot, stats, and ticket flows

This layer exists to:

- remove repeated token parsing from controllers
- keep auth behavior consistent
- make security-related changes land in one place

If a request concern repeats across routes, it probably belongs in `dependencies/`.

## Caching Strategy

Caching is centralized in `app/utils/cache.py`.

Current behavior:

- in-memory TTL cache by default
- Redis-capable abstraction for later scaling
- search caching already wired into ingestion search

Caching guidance:

- cache deterministic, expensive, repeatable reads
- avoid scattering ad hoc caches in services
- tune TTL through config when behavior may change
- be explicit before caching user-specific or auth-sensitive data

## Testing Strategy

The backend uses a mixed testing style:

- JSON-driven endpoint cases for repeatable permutations
- Python tests for richer flows, SSE behavior, auth logic, and integration edges
- contract-style tests for runtime configuration and feature flags

Testing locations:

- `tests/usecases/<domain>/`
- `tests/helpers/`
- `tests/config/`

When changing backend behavior:

- add or update at least one success-path test
- add or update at least one failure-path test
- update contract tests if configuration behavior changes
- keep docs aligned with test expectations

## Documentation Strategy

The backend docs should describe the current template, not a past deliverable.

Update docs in the same task when changing:

- architecture boundaries
- runtime/config behavior
- setup steps
- tests
- feature flags

Relevant docs:

- `readme.md`
- `Backend/ARCHITECTURE.md`
- `Backend/tests/README.md`
- `.cursor/backend-agentic-flow.md`
- `Backend/.env.example`

## Preferred Patterns

Prefer these patterns for all new work:

- `create_app()` for application composition
- typed settings and typed runtime config
- `.env` overrides for environment-specific behavior
- shared dependencies for repeated request concerns
- integration adapters for provider access
- `session_scope()` for DB lifecycle
- runtime-sourced rate limits
- shared cache abstraction

## Patterns To Avoid

Avoid growing these patterns further unless intentionally refactoring them:

- duplicated auth/token logic across controllers
- import-time initialization of optional providers in domain code
- direct SDK wiring inside controllers
- hardcoded operational values in business logic
- one-off fixes that bypass shared infrastructure

## How To Add A New Feature

When adding a new backend feature, follow this order:

1. Choose the correct domain.
2. Read the existing controller, service, DTOs, models, and tests.
3. Extend DTOs first.
4. Update persistence shape if needed.
5. Add or update service logic.
6. Keep controller changes small.
7. Add dependencies or integrations only if the concern is reusable.
8. Update tests.
9. Update docs and config examples.

If a feature does not fit any current domain, create a new domain only after confirming it is truly separate.

## How To Create A New Domain

Create:

- `<domain>/<domain>Controller.py`
- `<domain>/<domain>Service.py`
- `<domain>/dtos/`
- `<domain>/models/`
- tests in `tests/usecases/<domain>/`

Then:

- register the router in `app/app.py`
- add runtime settings if needed
- add dependencies or integrations if the concern is shared
- document the new shape

## AI-Assisted Development Notes

This backend is explicitly designed to work well with AI agents.

That means:

- patterns should be obvious from structure
- repeated problems should have one canonical solution
- docs should say what the system actually does
- new abstractions should reduce future ambiguity, not add it

If an AI agent keeps making the same mistake, the correct fix is usually to improve the shared pattern or documentation, not just patch the immediate output.

## Current Refinements Already Landed

The current baseline already includes:

1. shared auth dependencies
2. `session_scope()` as the preferred DB transaction pattern
3. an `integrations/` layer for third-party providers
4. runtime and feature-flag contract coverage
5. Redis as an explicit dependency with in-memory cache as the default runtime mode

## Decision Rule

When in doubt, choose the option that:

- reduces duplication
- makes the next feature easier
- keeps the runtime configurable
- preserves thin controllers
- preserves explicit contracts
- keeps provider logic isolated
