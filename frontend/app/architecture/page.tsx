import { InfoCard } from "@/components/info-card";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";

export default function ArchitecturePage() {
  return (
    <section className="flex w-full flex-col gap-10">
      <PageHeader
        description="The frontend is meant to scale by composition: routes stay small, view sections stay reusable, and integration logic stays outside leaf components."
        eyebrow="Architecture"
        heading="Frontend patterns should be obvious enough that the next feature feels routine."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {siteConfig.principles.map((item, index) => (
          <InfoCard
            key={item.title}
            description={item.description}
            kicker={`Principle 0${index + 1}`}
            title={item.title}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard
          description="Keep route segments focused. If a page grows, extract section components before complexity spreads into the page file."
          kicker="Routes"
          title="App Router is the composition boundary"
        />
        <InfoCard
          description="Config values, route metadata, and reusable display content should live in dedicated config files instead of being repeated across sections."
          kicker="Config"
          title="Static structure belongs in config, not in component sprawl"
        />
        <InfoCard
          description="Use server components by default. Introduce client components only for interactions, local state, theming, or browser APIs."
          kicker="Rendering"
          title="Server-first by default"
        />
        <InfoCard
          description="Create a typed API layer when backend integration starts, then map backend DTOs into UI-friendly shapes before they reach the visual layer."
          kicker="Data"
          title="Separate fetch logic from presentational sections"
        />
      </div>
    </section>
  );
}
