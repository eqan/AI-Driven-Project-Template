import { InfoCard } from "@/components/info-card";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";

export default function BackendApiPage() {
  return (
    <section className="flex w-full flex-col gap-10">
      <PageHeader
        description="The frontend should assume the backend is the source of truth for business logic, feature flags, and validated data contracts."
        eyebrow="Integration"
        heading="Frontend integration should stay thin, typed, and environment-aware."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {siteConfig.integrations.map((item, index) => (
          <InfoCard
            key={item.title}
            description={item.description}
            kicker={`Surface 0${index + 1}`}
            title={item.title}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <InfoCard
          description="Start with NEXT_PUBLIC_API_BASE_URL in .env files. When real API hooks land, centralize them in a dedicated lib or services layer so request logic does not spread across route components."
          kicker="Runtime"
          title="Prepare the environment contract now"
        />
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(7,10,20,0.18)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
            Good first integrations
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              "Auth session bootstrap",
              "Stats dashboard cards",
              "Ticket list and detail views",
              "Ingestion search playground",
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
