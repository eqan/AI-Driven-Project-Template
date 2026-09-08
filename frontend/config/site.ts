export type NavItem = {
  label: string;
  href: string;
};

export type MetricCard = {
  value: string;
  label: string;
  note: string;
};

export type Principle = {
  title: string;
  description: string;
};

export type WorkflowStep = {
  title: string;
  description: string;
};

export type IntegrationSurface = {
  title: string;
  description: string;
};

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Project Template",
  description:
    "A HeroUI and Next.js frontend template shaped for interview-speed delivery, AI-assisted scaling, and clean backend integration.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Architecture",
      href: "/architecture",
    },
    {
      label: "Playbook",
      href: "/playbook",
    },
    {
      label: "Backend API",
      href: "/backend-api",
    },
  ] satisfies NavItem[],
  metrics: [
    {
      value: "App Router",
      label: "Structure",
      note: "Server-first routes with isolated client islands where interaction is needed.",
    },
    {
      value: "HeroUI v3",
      label: "Design System",
      note: "Aesthetic primitives with Tailwind v4 and clear ownership in-repo.",
    },
    {
      value: ".env + config",
      label: "Runtime",
      note: "Frontend runtime stays simple and production-ready from the start.",
    },
  ] satisfies MetricCard[],
  principles: [
    {
      title: "Route by intent, not by page count",
      description:
        "Use route groups and focused sections so feature growth does not flatten the app into a dumping ground.",
    },
    {
      title: "Keep data boundaries explicit",
      description:
        "Separate config, API calls, view models, and presentation so future AI edits stay surgical.",
    },
    {
      title: "Compose with reusable sections",
      description:
        "New pages should be assembled from sections and cards rather than one-off layout experiments.",
    },
  ] satisfies Principle[],
  workflow: [
    {
      title: "Clarify the screen and user action",
      description:
        "Confirm the route, actor, happy path, and failure states before building UI.",
    },
    {
      title: "Confirm the API contract",
      description:
        "Lock request and response shapes before wiring forms, tables, or detail views.",
    },
    {
      title: "Reuse an existing section pattern",
      description:
        "Extend cards, shell layouts, lists, and actions before introducing a fresh visual language.",
    },
    {
      title: "Add loading, empty, and error states",
      description:
        "Every feature should read as complete even before backend data is fully live.",
    },
  ] satisfies WorkflowStep[],
  integrations: [
    {
      title: "Environment-driven API base URL",
      description:
        "Use NEXT_PUBLIC_API_BASE_URL so local, staging, and production remain predictable.",
    },
    {
      title: "Typed fetch layer",
      description:
        "Centralize backend calls instead of scattering fetch logic across components.",
    },
    {
      title: "Feature-ready app shell",
      description:
        "Navigation, hero section, and content panels provide a stable base for dashboards or product flows.",
    },
  ] satisfies IntegrationSurface[],
};
