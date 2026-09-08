import NextLink from "next/link";

import { HeroBanner } from "@/components/hero-banner";
import { InfoCard } from "@/components/info-card";
import { SectionShell } from "@/components/section-shell";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <section className="flex w-full flex-col gap-12">
      <HeroBanner
        actions={[
          { href: "/architecture", label: "See architecture" },
          { href: "/backend-api", label: "Map backend routes", variant: "secondary" },
        ]}
        asideDescription="This workspace is designed to make the next feature obvious: clear shell ownership, one auth trust boundary, reusable sections, and a thin API edge."
        asideTitle="Founder-style product posture"
        description="The frontend now behaves like an operator-facing SaaS product: one protected shell, one public sign-in route, and a repeatable page system that stays usable as modules pile up."
        eyebrow="Workspace"
        heading="Build the app like a real product, not a one-page demo."
        metrics={siteConfig.proofMetrics}
      />

      <SectionShell
        description="Each route has a job: orient the team, prove a system decision, or speed up the next implementation choice."
        eyebrow="Now Live"
        title="One product skeleton, four useful entry points."
      >
        <div className="grid gap-5 xl:grid-cols-2">
          {siteConfig.productAreas.map((area) => (
            <article
              key={area.title}
              className="flex h-full flex-col rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-6 shadow-[0_24px_90px_rgba(7,10,20,0.17)] backdrop-blur"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent/80">
                  {area.status}
                </p>
                <NextLink
                  className="text-sm font-semibold text-foreground transition-colors hover:text-accent"
                  href={area.href}
                >
                  Open route
                </NextLink>
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-foreground">{area.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{area.description}</p>
              <p className="mt-5 rounded-[22px] border border-white/10 bg-black/10 px-4 py-4 text-sm leading-7 text-foreground/88 dark:bg-white/4">
                {area.outcome}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description="These rules keep the frontend fast to extend without turning every request into a layout rethink."
        eyebrow="Principles"
        title="Pattern decisions that keep product work predictable."
      >
        <div className="grid gap-6 xl:grid-cols-3">
          {siteConfig.principles.map((principle, index) => (
            <InfoCard
              key={principle.title}
              description={principle.description}
              kicker={`Principle 0${index + 1}`}
              title={principle.title}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description="The route flow stays useful when the page gives the team a clear next move instead of only describing the system."
        eyebrow="Next Moves"
        title="Use the workspace like a build board."
      >
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-7 shadow-[0_24px_95px_rgba(7,10,20,0.2)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
              Delivery order
            </p>
            <div className="mt-6 grid gap-4">
              {siteConfig.deliveryTracks.map((track) => (
                <div
                  key={track.title}
                  className="rounded-[24px] border border-white/10 bg-black/10 p-5 dark:bg-white/4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground">{track.title}</h3>
                    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                      {track.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{track.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-7 shadow-[0_24px_95px_rgba(7,10,20,0.2)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
              Quick routes
            </p>
            <div className="mt-6 grid gap-4">
              {siteConfig.quickLinks.map((link) => (
                <NextLink
                  key={link.href}
                  className="block rounded-[24px] border border-white/10 bg-black/10 p-5 transition-colors hover:bg-white/6 dark:bg-white/4"
                  href={link.href}
                >
                  <p className="text-lg font-semibold text-foreground">{link.label}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{link.description}</p>
                </NextLink>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
