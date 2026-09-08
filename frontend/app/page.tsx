import NextLink from "next/link";

import { InfoCard } from "@/components/info-card";
import { siteConfig } from "@/config/site";
import { subtitle, title } from "@/components/primitives";

export default function HomePage() {
  return (
    <section className="flex w-full flex-col gap-14 lg:gap-18">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent/85 shadow-[0_12px_40px_rgba(26,35,126,0.14)]">
            HeroUI template baseline
          </div>

          <div className="max-w-4xl space-y-5">
            <h1 className={title({ size: "lg" })}>
              Build fast, <span className={title({ size: "lg", color: "blue" })}>present well</span>,
              and keep the codebase easy for AI to scale.
            </h1>
            <p className={subtitle({ fullWidth: true, class: "max-w-2xl" })}>
              This frontend template is shaped for interview-speed product work:
              clean sections, obvious extension points, HeroUI styling, and a
              backend-friendly structure that does not collapse once features start landing.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <NextLink
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              href="/architecture"
            >
              Explore architecture
            </NextLink>
            <NextLink
              className="rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
              href="/playbook"
            >
              Open AI playbook
            </NextLink>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.16),rgba(255,255,255,0.05))] p-7 shadow-[0_30px_120px_rgba(16,18,25,0.18)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/85">
            Why this starter works
          </p>
          <div className="mt-6 space-y-5">
            {siteConfig.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[24px] border border-white/10 bg-black/4 p-5 dark:bg-white/4"
              >
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                    <p className="mt-1 text-sm font-medium text-foreground/80">
                      {metric.label}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted">{metric.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {siteConfig.principles.map((principle, index) => (
          <InfoCard
            key={principle.title}
            description={principle.description}
            kicker={`0${index + 1}`}
            title={principle.title}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <InfoCard
          description="The backend already leans on typed config, feature flags, clean services, and use-case tests. This frontend mirrors that mindset with route-level structure, page composition, and explicit integration boundaries."
          kicker="Fit"
          title="Designed to plug into the existing backend contract"
        />

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(7,10,20,0.18)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
            Next route ideas
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              "Dashboard shell with live backend stats",
              "Auth flow wired to shared JWT/session strategy",
              "Feature-flag-aware page sections",
              "Typed API client with optimistic state patterns",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-black/4 px-4 py-4 text-sm text-muted dark:bg-white/4"
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
