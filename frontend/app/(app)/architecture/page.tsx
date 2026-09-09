import { HeroBanner } from "@/components/hero-banner";
import { InfoCard } from "@/components/info-card";
import { ListPanel } from "@/components/list-panel";
import { SectionShell } from "@/components/section-shell";
import { siteConfig } from "@/config/site";

export default function ArchitecturePage() {
  return (
    <section className="flex w-full flex-col gap-10">
      <HeroBanner
        actions={[
          { href: "/playbook", label: "Open playbook" },
          { href: "/backend-api", label: "Inspect contracts", variant: "secondary" },
        ]}
        asideDescription="The architecture should answer practical questions quickly: where auth lives, where route chrome lives, and where data wiring should start."
        asideTitle="What this page clarifies"
        description="The frontend grows around route groups, one workspace shell, and centralized integration helpers instead of coupling every new page to a global template rewrite."
        eyebrow="Architecture"
        heading="See the structure before adding the next module."
        metrics={siteConfig.workspaceSignals}
      />

      <SectionShell
        description="These are the structural bets that keep the product coherent as routes, data needs, and auth requirements expand."
        eyebrow="Layers"
        title="The app is organized around a few durable boundaries."
      >
        <div className="grid gap-6 xl:grid-cols-2">
          {siteConfig.architectureLayers.map((layer, index) => (
            <InfoCard
              key={layer.title}
              description={layer.description}
              kicker={`Layer 0${index + 1}`}
              title={layer.title}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description="The route model and rendering defaults should be so clear that the next feature mostly becomes a data and UX question."
        eyebrow="Defaults"
        title="Predictability comes from repeating the same decisions."
      >
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <ListPanel
            eyebrow="Route growth model"
            items={[
              "Keep public pages outside the protected shell so auth does not inherit workspace chrome.",
              "Let protected routes share navigation, spacing, and account controls from one layout boundary.",
              "Add new product routes by composing route-level content, not by reworking global framing.",
            ]}
            title="Split access, then scale surfaces."
          />

          <ListPanel
            eyebrow="Rendering defaults"
            items={[
              "Start from server components so data-backed routes stay easy to cache and reason about.",
              "Use client components only where auth, browser APIs, or interaction state actually need them.",
              "Push environment checks and request parsing into shared helpers before more API modules land.",
            ]}
            title="Keep dynamic behavior intentional."
          />
        </div>
      </SectionShell>
    </section>
  );
}
