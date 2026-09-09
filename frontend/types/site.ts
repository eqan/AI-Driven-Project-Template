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

export type SiteConfig = {
  name: string;
  productTagline: string;
  description: string;
  navItems: NavItem[];
  proofMetrics: ProofMetric[];
  workspaceSignals: WorkspaceSignal[];
  productAreas: ProductArea[];
  principles: Principle[];
  architectureLayers: ArchitectureLayer[];
  workflow: WorkflowStep[];
  deliveryTracks: DeliveryTrack[];
  integrations: IntegrationSurface[];
  backendDomains: BackendDomain[];
  cacheScenarios: CacheScenario[];
  quickLinks: QuickLink[];
};
