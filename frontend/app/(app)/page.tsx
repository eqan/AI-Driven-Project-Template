import NextLink from "next/link";

import { InfoCard } from "@/components/info-card";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <section className="flex w-full flex-col gap-12">
      <PageHeader
        description="The frontend now behaves like a product workspace: one protected shell, one public auth surface, and clear integration boundaries ready for feature growth."
        eyebrow="Workspace"
        heading="Ship the app surface without letting the frontend flatten into a template."
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {siteConfig.workspaceSignals.map((signal) => (
            <article
              key={signal.label}
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_22px_90px_rgba(7,10,20,0.18)] backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent/80">
                {signal.label}
              </p>
              <p className="mt-4 text-2xl font-semibold text-foreground">{signal.value}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{signal.note}</p>
            </article>
          ))}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-7 shadow-[0_28px_120px_rgba(7,10,20,0.2)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
            Why this refactor matters
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            The shell is ready for dashboard, CRUD, chat, and search flows instead of demo-only sections.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted">
            Route groups keep auth isolated, reusable sections keep pages small,
            and runtime helpers stop integration logic from scattering across components.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <NextLink
              className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              href="/architecture"
            >
              Review architecture
            </NextLink>
            <NextLink
              className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
              href="/backend-api"
            >
              Map integrations
            </NextLink>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
              Product surfaces
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">
              Build out the workspace by module, not by one-off screens.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted">
            These routes are now framed as durable SaaS surfaces that can accept
            backend data, auth rules, and future task flows without another shell rewrite.
          </p>
        </div>

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
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-6">
          {siteConfig.principles.map((principle, index) => (
            <InfoCard
              key={principle.title}
              description={principle.description}
              kicker={`Principle 0${index + 1}`}
              title={principle.title}
            />
          ))}
        </div>

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
      </div>
    </section>
  );
}
