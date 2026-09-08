export type NavItem = {
  label: string;
  href: string;
  description: string;
};

export type WorkspaceSignal = {
  value: string;
  label: string;
  note: string;
};

export type ProofMetric = {
  value: string;
  label: string;
  note: string;
};

export type ProductArea = {
  title: string;
  href: string;
  status: string;
  description: string;
  outcome: string;
};

export type Principle = {
  title: string;
  description: string;
};

export type ArchitectureLayer = {
  title: string;
  description: string;
};

export type WorkflowStep = {
  title: string;
  description: string;
};

export type DeliveryTrack = {
  title: string;
  status: string;
  description: string;
};

export type IntegrationSurface = {
  title: string;
  description: string;
};

export type BackendDomain = {
  title: string;
  route: string;
  description: string;
};

export type CacheScenario = {
  title: string;
  recommendation: string;
  description: string;
};

export type QuickLink = {
  label: string;
  href: string;
  description: string;
};

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Project Template",
  productTagline: "Operator-ready SaaS workspace",
  description:
    "A SaaS-ready Next.js frontend shaped for protected routes, predictable product surfaces, and clean backend integration.",
  navItems: [
    {
      label: "Overview",
      href: "/",
      description: "Workspace shell, scaling posture, and the current product surface.",
    },
    {
      label: "Architecture",
      href: "/architecture",
      description: "Route groups, shell composition, and rendering boundaries.",
    },
    {
      label: "Playbook",
      href: "/playbook",
      description: "The repeatable delivery loop for frontend feature work.",
    },
    {
      label: "Backend API",
      href: "/backend-api",
      description: "Integration posture for auth, tickets, stats, ingestion, and chat.",
    },
  ] satisfies NavItem[],
  proofMetrics: [
    {
      value: "4",
      label: "Core routes",
      note: "Overview, architecture, playbook, and backend mapping all follow the same workspace pattern.",
    },
    {
      value: "1",
      label: "Auth path",
      note: "Public sign-in stays isolated so product routes keep one protected shell and one clear trust boundary.",
    },
    {
      value: "3",
      label: "Next modules",
      note: "Stats, ticketing, and chat can land without redesigning the app frame again.",
    },
    {
      value: "0",
      label: "Filler sections",
      note: "Every block is now meant to orient, prove readiness, or move the next implementation decision forward.",
    },
  ] satisfies ProofMetric[],
  workspaceSignals: [
    {
      value: "Public + protected layouts",
      label: "Route model",
      note: "Authentication stays outside the workspace shell so product routes inherit a cleaner frame.",
    },
    {
      value: "Thin client islands",
      label: "Rendering posture",
      note: "Pages stay server-first while auth, navigation, and sign-in interactions remain local to client components.",
    },
    {
      value: "Central env + API client",
      label: "Integration boundary",
      note: "Runtime validation and request parsing are reusable now instead of being duplicated at each entry point.",
    },
    {
      value: "Docs wired to structure",
      label: "Change hygiene",
      note: "Architecture and README stay aligned with how routes, shells, and helpers actually fit together.",
    },
  ] satisfies WorkspaceSignal[],
  productAreas: [
    {
      title: "Workspace overview",
      href: "/",
      status: "Start here",
      description:
        "The operating page for product posture, route readiness, and what the next build steps should be.",
      outcome:
        "Use this as the baseline for dashboards, launch checklists, and operator-facing summaries.",
    },
    {
      title: "Architecture guide",
      href: "/architecture",
      status: "System map",
      description:
        "Shows how route groups, shared shell ownership, and integration helpers fit together.",
      outcome:
        "Keeps future contributors aligned without re-explaining the whole app in every task.",
    },
    {
      title: "Delivery playbook",
      href: "/playbook",
      status: "Build rhythm",
      description:
        "Captures the repeatable flow for shipping new product surfaces without losing UX discipline.",
      outcome:
        "Makes human and AI-assisted frontend work more consistent under deadline pressure.",
    },
    {
      title: "Backend integration map",
      href: "/backend-api",
      status: "Contract map",
      description:
        "Connects frontend route planning to auth, ticketing, ingestion, chatbot, and analytics domains.",
      outcome:
        "Helps the next data-backed route land against an existing contract instead of inventing one.",
    },
  ] satisfies ProductArea[],
  principles: [
    {
      title: "Separate trust boundaries early",
      description:
        "Public auth and protected workspace routes should not share the same layout contract once the app starts behaving like software.",
    },
    {
      title: "Keep integration logic boring",
      description:
        "Environment validation and request parsing should live behind shared helpers before more modules start making fetch calls.",
    },
    {
      title: "Scale by patterns, not rewrites",
      description:
        "Reusable cards, headers, and panels keep route files readable while making the next SaaS surface cheaper to add.",
    },
  ] satisfies Principle[],
  architectureLayers: [
    {
      title: "Route groups split public and protected surfaces",
      description:
        "Auth now renders in a public layout while the workspace routes share a dedicated protected app shell.",
    },
    {
      title: "One workspace shell owns navigation and framing",
      description:
        "Sidebar, top bar, account controls, and route spacing are now controlled from one place instead of leaking into every page.",
    },
    {
      title: "Runtime and API logic live behind reusable helpers",
      description:
        "Frontend environment checks and request parsing are centralized so future auth, stats, and CRUD modules reuse the same boundary.",
    },
    {
      title: "Pages stay content-focused",
      description:
        "Route files mainly compose product sections and stateful panels now, which makes them easier to review and extend.",
    },
  ] satisfies ArchitectureLayer[],
  workflow: [
    {
      title: "Define the screen before styling it",
      description:
        "Define who uses the screen, what they need to finish, and what loading, empty, error, and success look like.",
    },
    {
      title: "Lock the contract early",
      description:
        "Confirm request and response shapes before wiring tables, forms, or optimistic actions around them.",
    },
    {
      title: "Reuse the product skeleton",
      description:
        "Extend shared cards, shell panels, and route sections first so the product still feels like one system.",
    },
    {
      title: "Design the state path, not just the happy path",
      description:
        "Treat loading, empty, recovery, and success behavior as part of the feature instead of polish for later.",
    },
  ] satisfies WorkflowStep[],
  deliveryTracks: [
    {
      title: "Shell and routing",
      status: "Foundation",
      description:
        "Protected routes now share a workspace frame while auth stays isolated as a public flow.",
    },
    {
      title: "Reusable sections",
      status: "Composition",
      description:
        "Cards, headers, and summary panels are shared so new routes grow through composition.",
    },
    {
      title: "Integration layer",
      status: "Readiness",
      description:
        "Environment validation and request helpers are ready for future typed modules.",
    },
    {
      title: "Docs and verification",
      status: "Ops",
      description:
        "Architecture docs, lint, typecheck, and build now reinforce the structure instead of chasing it later.",
    },
  ] satisfies DeliveryTrack[],
  integrations: [
    {
      title: "Environment contract",
      description:
        "NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_GOOGLE_CLIENT_ID are validated centrally before the UI depends on them.",
    },
    {
      title: "Shared API client",
      description:
        "Auth already runs through reusable request parsing and error handling that future modules can extend.",
    },
    {
      title: "Backend-ready product shell",
      description:
        "Navigation and route framing are now shaped around stats, ticketing, ingestion, and chat instead of a generic homepage.",
    },
  ] satisfies IntegrationSurface[],
  backendDomains: [
    {
      title: "Auth",
      route: "/google-login + /verify-token",
      description:
        "Bootstraps Google sign-in, verifies JWT state, and gates the protected workspace.",
    },
    {
      title: "Stats",
      route: "/stats",
      description:
        "Supports dashboard cards, reporting views, and lightweight analytics summaries.",
    },
    {
      title: "Ticketing",
      route: "/tickets + /ticket/{uuid}",
      description:
        "Fits queue views, detail surfaces, and operator workflows inside the shared shell.",
    },
    {
      title: "Ingestion",
      route: "/ingestion/*",
      description:
        "Provides room for scrape, indexing, and search tooling without changing the app frame again.",
    },
    {
      title: "Chatbot",
      route: "/chatbot-response* + /all-chats",
      description:
        "Can evolve into conversation workspaces, review panels, and streaming task flows.",
    },
  ] satisfies BackendDomain[],
  cacheScenarios: [
    {
      title: "Auth and current user",
      recommendation: "Always fresh",
      description:
        "Use no-store and verify against the backend because stale auth data creates trust and authorization bugs.",
    },
    {
      title: "Dashboard summaries",
      recommendation: "Short-lived",
      description:
        "Revalidate on navigation or focus so the UI feels current without refetching every click.",
    },
    {
      title: "Static product references",
      recommendation: "Cacheable",
      description:
        "Public docs, feature descriptions, and reference content can use explicit revalidation windows.",
    },
    {
      title: "Drafts and filters",
      recommendation: "Browser-sticky",
      description:
        "Use local browser state for non-secret drafts and preferences when resuming work helps the user.",
    },
  ] satisfies CacheScenario[],
  quickLinks: [
    {
      label: "Review architecture",
      href: "/architecture",
      description: "See the route-group split and shell ownership at a glance.",
    },
    {
      label: "Check the playbook",
      href: "/playbook",
      description: "Use the feature-delivery loop before adding more screens.",
    },
    {
      label: "Plan API routes",
      href: "/backend-api",
      description: "Map the next frontend module to a backend contract first.",
    },
  ] satisfies QuickLink[],
};
