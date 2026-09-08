import { InfoCard } from "@/components/info-card";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";

export default function ArchitecturePage() {
  return (
    <section className="flex w-full flex-col gap-10">
      <PageHeader
        description="The frontend now grows around route groups, one workspace shell, and centralized integration helpers instead of coupling every page to a top-level template."
        eyebrow="Architecture"
        heading="Make the next feature feel like adding a module, not negotiating the whole app again."
      />

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

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-6 shadow-[0_24px_95px_rgba(7,10,20,0.18)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
            Route growth model
          </p>
          <div className="mt-5 grid gap-4">
            {[
              "Keep public pages outside the protected shell so auth does not inherit workspace chrome.",
              "Let protected routes share navigation, spacing, and account controls from one layout boundary.",
              "Add new product routes by composing route-level content, not by reworking global framing.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/10 bg-black/10 px-4 py-4 text-sm leading-7 text-muted dark:bg-white/4"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-6 shadow-[0_24px_95px_rgba(7,10,20,0.18)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
            Rendering defaults
          </p>
          <div className="mt-5 grid gap-4">
            {[
              "Start from server components so data-backed routes stay easy to cache and reason about.",
              "Use client components only where auth, browser APIs, or interaction state actually need them.",
              "Push environment checks and request parsing into shared helpers before more API modules land.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/10 bg-black/10 px-4 py-4 text-sm leading-7 text-muted dark:bg-white/4"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
