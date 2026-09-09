import NextLink from "next/link";

import { SectionShell } from "@/components/section-shell";
import { WorkspaceRouteTable } from "@/components/workspace-route-table";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <section className="flex w-full flex-col gap-8">
      <section className="rounded-[30px] border border-[var(--line-strong)] bg-[linear-gradient(180deg,var(--surface-strong),var(--surface))] p-6 shadow-[0_18px_56px_rgba(2,6,23,0.16)] sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/75">
              Workspace
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl xl:text-[3.25rem]">
              Operate the product from one predictable shell.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              This route is now a working dashboard for the frontend: check what surfaces
              exist, see which contracts are ready, and jump directly into the next build area
              without wading through product-story copy.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[360px]">
            {siteConfig.quickLinks.slice(0, 2).map((link) => (
              <NextLink
                key={link.href}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-4 transition-colors hover:bg-[var(--surface-strong)]"
                href={link.href}
              >
                <p className="text-sm font-semibold text-foreground">{link.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{link.description}</p>
              </NextLink>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {siteConfig.proofMetrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5"
            >
              <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {metric.value}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent/75">
                {metric.label}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">{metric.note}</p>
            </article>
          ))}
        </div>
      </section>

      <SectionShell
        description="Each route should own a clear job, fit the shared shell, and point to the next implementation move."
        eyebrow="Route Map"
        title="Active routes and the work they support."
      >
        <WorkspaceRouteTable areas={siteConfig.productAreas} />
      </SectionShell>

      <SectionShell
        description="The dashboard should help the team decide what to build next and how state should behave once those modules land."
        eyebrow="Operating View"
        title="Execution lanes and browser-state decisions."
      >
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_14px_44px_rgba(2,6,23,0.12)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/75">
                Delivery order
              </p>
              <span className="rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                Shared sequence
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {siteConfig.deliveryTracks.map((track) => (
                <div
                  key={track.title}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-foreground">{track.title}</h3>
                    <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                      {track.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{track.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_14px_44px_rgba(2,6,23,0.12)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/75">
                Cache posture
              </p>
              <span className="rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                Browser-aware
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {siteConfig.cacheScenarios.map((scenario) => (
                <article
                  key={scenario.title}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-foreground">{scenario.title}</h3>
                    <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                      {scenario.recommendation}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{scenario.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
