# Frontend Architecture

This frontend is a HeroUI and Next.js template optimized for aesthetic defaults, explicit extension points, and AI-assisted feature delivery.

## System Map

```mermaid
flowchart LR
    User[User]
    Routes[App Router routes]
    Sections[Section components]
    Config[Config and content maps]
    Theme[Theme and global styles]
    API[Typed API layer]
    Backend[Backend services]

    User --> Routes
    Routes --> Sections
    Routes --> Config
    Routes --> API
    Sections --> Theme
    API --> Backend
```

## Current Layout

```mermaid
flowchart TD
    Frontend[frontend]
    App[app]
    Components[components]
    Config[config]
    Styles[styles]
    Docs[ARCHITECTURE.md]

    Frontend --> App
    Frontend --> Components
    Frontend --> Config
    Frontend --> Styles
    Frontend --> Docs

    App --> Home[page.tsx]
    App --> Architecture[architecture/page.tsx]
    App --> Playbook[playbook/page.tsx]
    App --> BackendApi[backend-api/page.tsx]
    App --> Layout[layout.tsx]
```

## Rendering Flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as Route
    participant C as Config
    participant S as Section components
    participant A as API layer
    participant B as Backend

    U->>R: Navigate
    R->>C: Read page config
    R->>S: Compose sections
    opt Dynamic data
        R->>A: Request data
        A->>B: Call backend API
        B-->>A: DTO response
        A-->>R: View model
    end
    R-->>U: Render page
```

## Page Composition

```mermaid
flowchart TD
    Page[Route page]
    Header[Page header]
    Grid[Section grid]
    Card[Reusable info cards]
    CTA[CTA links/actions]

    Page --> Header
    Page --> Grid
    Grid --> Card
    Page --> CTA
```

## Styling Model

```mermaid
flowchart LR
    Globals[styles/globals.css]
    Tokens[CSS variables and Tailwind theme]
    Components[HeroUI and local components]
    Html[html.dark baseline]

    Globals --> Tokens
    Html --> Tokens
    Tokens --> Components
```

## Integration Boundary

```mermaid
flowchart TD
    Env[".env.local"]
    PublicVar["NEXT_PUBLIC_API_BASE_URL"]
    ApiClient[Future typed API client]
    Pages[Route pages]
    Backend[FastAPI backend]

    Env --> PublicVar
    PublicVar --> ApiClient
    Pages --> ApiClient
    ApiClient --> Backend
```

## Feature Workflow

```mermaid
flowchart TD
    Clarify[Ask 3 clarifying questions]
    Screen[Confirm route and UX states]
    Contract[Confirm API inputs and outputs]
    Reuse{Existing section fits?}
    Extend[Extend current route/components]
    New[Create new route or section]
    Build[Implement UI]
    States[Add loading, empty, error states]
    Verify[Run lint and build]
    Docs[Update docs and AI instructions]

    Clarify --> Screen
    Screen --> Contract
    Contract --> Reuse
    Reuse -->|Yes| Extend
    Reuse -->|No| New
    Extend --> Build
    New --> Build
    Build --> States
    States --> Verify
    Verify --> Docs
```

## Guardrails

```mermaid
flowchart TD
    Prefer[Prefer]
    Avoid[Avoid]

    Prefer --> P1[Server components by default]
    Prefer --> P2[Reusable sections]
    Prefer --> P3[Config-driven page content]
    Prefer --> P4[Typed API integration]
    Prefer --> P5[One visual language]

    Avoid --> A1[Random per-page styling]
    Avoid --> A2[Fetch logic inside leaf components]
    Avoid --> A3[Unclear loading states]
    Avoid --> A4[One-off layout experiments]
    Avoid --> A5[Frontend contracts drifting from backend DTOs]
```

## Theme Baseline

```mermaid
flowchart LR
    Stable[Stable default dark theme]
    HtmlClass[html.dark]
    Globals[Global CSS variables]
    UI[HeroUI and route sections]

    Stable --> HtmlClass
    HtmlClass --> Globals
    Globals --> UI
```
