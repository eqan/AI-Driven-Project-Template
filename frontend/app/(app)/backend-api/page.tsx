import { HeroBanner } from "@/components/hero-banner";
import { InfoCard } from "@/components/info-card";
import { SectionShell } from "@/components/section-shell";
import { siteConfig } from "@/config/site";

export default function BackendApiPage() {
  return (
    <section className="flex w-full flex-col gap-10">
      <HeroBanner
        actions={[
          { href: "/architecture", label: "Review boundaries" },
          { href: "/playbook", label: "Open workflow", variant: "secondary" },
        ]}
        asideDescription="The safest frontend is boring at the edge: strict runtime config, one request layer, explicit freshness rules, and no secrets drifting into random browser state."
        asideTitle="Integration posture"
        description="The frontend is prepared for backend-backed routes by centralizing runtime checks, auth requests, cache decisions, and reusable route composition."
        eyebrow="Integration"
        heading="Keep the API edge thin, typed, and hard to misuse."
        metrics={[
          {
            value: "1",
            label: "Request layer",
            note: "Auth and future modules should flow through one shared API boundary.",
          },
          {
            value: "4",
            label: "Cache modes",
            note: "Fresh, short-lived, cacheable, and browser-sticky are enough to classify most product data.",
          },
          {
            value: "0",
            label: "Secret storage copies",
            note: "Sensitive auth state should not spread across multiple browser persistence layers.",
          },
        ]}
      />

      <SectionShell
        description="These integration surfaces give new modules one consistent place to plug into the frontend."
        eyebrow="Foundations"
        title="A few contracts should carry most of the app."
      >
        <div className="grid gap-6 xl:grid-cols-3">
          {siteConfig.integrations.map((item, index) => (
            <InfoCard
              key={item.title}
              description={item.description}
              kicker={`Surface 0${index + 1}`}
              title={item.title}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description="These backend domains already map cleanly to product modules inside the protected shell."
        eyebrow="Backend modules"
        title="Build on real contracts instead of inventing one-off route logic."
      >
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-7 shadow-[0_24px_95px_rgba(7,10,20,0.2)] backdrop-blur">
          <div className="grid gap-5 xl:grid-cols-2">
            {siteConfig.backendDomains.map((domain) => (
              <article
                key={domain.title}
                className="rounded-[24px] border border-white/10 bg-black/10 p-5 dark:bg-white/4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-foreground">{domain.title}</h3>
                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {domain.route}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted">{domain.description}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell
        description="Frontend cache rules should be explicit enough that contributors do not have to guess whether data belongs in live fetches, revalidation, or browser storage."
        eyebrow="Caching"
        title="Use a small set of browser-freshness decisions."
      >
        <div className="grid gap-5 xl:grid-cols-2">
          {siteConfig.cacheScenarios.map((scenario) => (
            <article
              key={scenario.title}
              className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-6 shadow-[0_20px_80px_rgba(7,10,20,0.16)] backdrop-blur"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-foreground">{scenario.title}</h3>
                <span className="rounded-full border border-white/10 bg-black/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent/80 dark:bg-white/4">
                  {scenario.recommendation}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted">{scenario.description}</p>
            </article>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
