# Backend Architecture

This backend is being shaped as a reusable interview template: predictable enough for fast feature work, but structured enough that an AI agent or a new teammate can extend it safely.

## Core Rules

1. Put product behavior behind services, not controllers.
2. Keep infra decisions configurable through `app/config/runtime.json` or environment variables.
3. Prefer one reusable pattern per problem class instead of hand-fixing the same bug in many files.
4. Make optional integrations fail gracefully instead of crashing the whole app at import time.

## Runtime Configuration

Two layers control runtime behavior:

- `Backend/.env`
  For secrets and environment-specific values like DB credentials and API keys.
- `Backend/app/config/runtime.json`
  For operational knobs like workers, timeouts, feature flags, rate limits, cache backend, and CORS behavior.

Use `RUNTIME_CONFIG_PATH` to point to another JSON file when needed.

## Canonical Backend Pattern

When adding a new module, follow this flow:

1. DTOs in `<domain>/dtos/`
2. ORM models in `<domain>/models/`
3. Business logic in `<domain>/<domain>Service.py`
4. Thin route handlers in `<domain>/<domain>Controller.py`

Controllers should:

- validate inputs
- call one service
- avoid data access logic
- avoid external SDK wiring

Services should:

- contain domain logic
- call shared infra helpers
- use `session_scope()` for straightforward DB flows
- keep external API usage behind helper functions or adapters

## Shared Infrastructure

- `app/config/settings.py`
  Typed environment settings plus typed JSON runtime config.
- `app/config/config.py`
  Shared engine, limiter, generation config, and lazy third-party client factories.
- `app/database.py`
  Table creation and the reusable `session_scope()` pattern.
- `app/utils/cache.py`
  Cache abstraction with in-memory TTL by default and Redis-ready wiring when a Redis client is installed.

## Feature Flags

Use `runtime.json` to enable or disable template capabilities:

- `enable_scheduler`
- `enable_stats`
- `enable_ticketing`
- `enable_ingestion`
- `enable_sentry`
- `enable_google_search_grounding`

This keeps the same codebase usable for both a slim interview demo and a fuller production-style walkthrough.

## Completed Refinements

1. Shared auth dependencies now centralize repeated token verification patterns.
2. Services and scheduled DB jobs now prefer `session_scope()` instead of repeating manual session cleanup.
3. A dedicated `integrations/` layer isolates Gemini, DeepSeek, Pinecone, Voyage, and Firecrawl provider logic from domain services.
4. Runtime configuration and feature-flag behavior are covered by contract-style tests.
5. Redis is now an explicit dependency, while the cache layer still defaults to in-memory TTL until the environment is configured to use Redis.
