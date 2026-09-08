import { InfoCard } from "@/components/info-card";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";

export default function BackendApiPage() {
  return (
    <section className="flex w-full flex-col gap-10">
      <PageHeader
        description="The frontend is now prepared for backend-backed product routes by centralizing runtime checks, auth requests, and reusable route composition."
        eyebrow="Integration"
        heading="Keep the API layer thin, typed, and ready for the next product module."
      />

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

      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-7 shadow-[0_24px_95px_rgba(7,10,20,0.2)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
          Backend domains ready to surface
        </p>
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
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
    </section>
  );
}
