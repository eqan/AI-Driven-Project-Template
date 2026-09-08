# Backend Agentic Flow

Use this file as the parent instruction set for any backend feature, bugfix, refactor, infra change, or backend-facing documentation update.

## Mission

This repository is a backend-first project template designed for:

- fast interview implementation
- AI-assisted feature delivery
- predictable extension patterns
- low-friction scaling from a clean baseline

Optimize for reuse, consistency, and future velocity. Do not solve backend requests with one-off patches if a shared pattern is the better fit.

## Read First

Before editing backend behavior, read these files:

- `Backend/ARCHITECTURE.md`
- `Backend/app/app.py`
- `Backend/app/config/settings.py`
- `Backend/app/config/config.py`
- `Backend/app/database.py`
- `Backend/app/config/runtime.json`
- `Backend/tests/README.md`

When changing a specific domain, also read its controller, service, DTOs, models, and tests.

## Backend Structure

The backend is organized by domain under `Backend/app/`:

- `chatbot/`: chat endpoints, SSE flow, LLM orchestration, chat persistence
- `users/`: Google auth exchange, JWT verification, user persistence
- `ticket/`: ticket creation, updates, retrieval
- `stats/`: conversation analytics and scheduled stat generation
- `ingestion/`: scraping, embedding, vector search, ingestion workflows
- `config/`: typed settings, runtime config, DB engine, limiter, lazy integration clients
- `dependencies/`: shared FastAPI dependencies such as auth helpers
- `integrations/`: provider adapters for Gemini, DeepSeek, Pinecone, Voyage, and Firecrawl
- `utils/`: shared helpers such as caching and payload guards
- `prompts/`: prompt loading and prompt assets
- `database.py`: DB lifecycle helpers including `session_scope()`

## Source Of Truth

Configuration has two layers:

1. `Backend/app/config/runtime.json`
   Template defaults for reusable runtime behavior.
2. `Backend/.env`
   Environment-specific overrides for development, staging, and production.

Rules:

- never hardcode secrets, hosts, ports, API keys, or deployment-specific worker settings
- use `.env` for environment-specific values
- use `runtime.json` for template defaults
- if a new operational knob is needed, add it to typed settings or typed runtime config

## App Bootstrap

The canonical startup flow is:

1. `Backend/main.py`
2. `Backend/app/app.py`
3. `Backend/app/config/settings.py`
4. `Backend/app/config/config.py`

When changing startup behavior:

- keep `create_app()` as the app-construction boundary
- preserve feature-flag checks at bootstrap time
- avoid import-time crashes from optional integrations
- keep reload and worker behavior deterministic

## Feature Workflow

When asked to add a backend feature:

1. Identify the domain.
2. Read the existing flow in that domain before editing.
3. Extend DTOs and response contracts first.
4. Update persistence shape if required.
5. Implement business logic in the service layer.
6. Keep controllers thin and delegate to services.
7. Add tests.
8. Update docs and examples if setup or behavior changed.

Create a new domain only when the concept is truly separate from existing ones.

## Controller Rules

Controllers should:

- define routes and request/response shapes
- apply shared auth dependencies from `Backend/app/dependencies/` when auth is required
- apply rate limits from `settings.runtime.rate_limits`
- delegate to a service
- translate exceptional states into HTTP responses when needed

Controllers should not:

- build SQLAlchemy queries
- instantiate external SDK clients
- hold long orchestration logic
- hardcode configuration values already available in settings

## Service Rules

Services own backend business logic.

Services should:

- encapsulate domain behavior
- call shared infra helpers instead of duplicating setup
- use helper methods for parsing, validation, mapping, and retries
- keep provider-specific logic explicit and localized

For new code:

- prefer `session_scope()` from `Backend/app/database.py`
- do not copy older `Session.remove()` boilerplate into new services
- if touching legacy service code, improve local session handling where practical

## Database Rules

Current stack:

- PostgreSQL
- SQLAlchemy ORM
- shared engine in `Backend/app/config/config.py`
- `session_scope()` in `Backend/app/database.py`

Guidelines:

- keep transactions short
- avoid leaking sessions across method boundaries
- keep ORM models in `<domain>/models/`
- keep DTOs separate from ORM models
- use UTC timestamps for created/updated fields

If schema changes are needed:

- update the ORM model
- add or plan an Alembic migration
- avoid silent schema drift

## Runtime, Cache, And Feature Flags

When adding or changing a backend feature, check whether it needs:

- a feature flag
- a rate-limit setting
- a cache TTL
- a DB pool setting
- a server/runtime setting

If yes, extend the typed settings rather than scattering raw literals.

Canonical cache entrypoint:

- `Backend/app/utils/cache.py`

Current cache posture:

- in-memory TTL cache by default
- Redis-ready abstraction for later scaling

## Integration Rules

Current integrations include:

- Gemini / LLM APIs
- Voyage
- Pinecone
- Firecrawl
- Google OAuth
- Sentry

Rules:

- use provider adapters from `Backend/app/integrations/`
- let those adapters rely on lazy client access patterns from `Backend/app/config/config.py`
- missing optional credentials should degrade gracefully, not crash startup
- keep provider wiring out of controllers
- if integration complexity grows, extract adapter-style helpers or an `integrations/` module

## API And DTO Rules

- define request/response DTOs in `<domain>/dtos/`
- validate input constraints in Pydantic models
- keep payload names stable once introduced
- return structured responses that are easy for frontend and AI tooling to consume

For chatbot work:

- preserve the SSE event contract unless intentionally versioning it
- keep prompt loading centralized through `Backend/app/prompts/load_prompt.py`

## Testing Rules

Testing is required for backend changes unless explicitly skipped by the user.

Patterns:

- use JSON-driven test cases for endpoint permutations
- use Python tests for multi-step flows, SSE, auth, and edge cases
- if adding a route, add at least one success-path and one failure-path test
- if changing a shared contract, update all affected tests

Test locations:

- `Backend/tests/usecases/<domain>/`
- `Backend/tests/helpers/`

## Documentation Rules

When backend behavior changes, update the relevant docs in the same task:

- `readme.md`
- `Backend/ARCHITECTURE.md`
- `Backend/tests/README.md`
- `Backend/.env.example`

The repo should always read like a current template, not an outdated demo artifact.

## Preferred Vs Legacy Patterns

Prefer for new work:

- `create_app()` bootstrap pattern
- typed settings plus typed runtime config
- `.env` overrides for deployment-specific values
- shared auth dependencies under `Backend/app/dependencies/`
- lazy optional clients
- provider adapters under `Backend/app/integrations/`
- `session_scope()` for DB lifecycle
- shared cache abstraction
- runtime-sourced rate limits

Avoid expanding these unless intentionally refactoring them:

- duplicated rate-limit literals
- import-time initialization of optional services
- direct session management copied into every method
- backend assumptions tied to the old static widget frontend

## Delivery Checklist

Before finishing backend work, verify:

- imports still resolve
- settings are typed and documented
- routes remain thin
- services own the logic
- tests cover the change
- docs are aligned
- no secrets were added to tracked example files
