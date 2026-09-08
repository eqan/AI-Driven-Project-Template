import { InfoCard } from "@/components/info-card";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";

export default function PlaybookPage() {
  return (
    <section className="flex w-full flex-col gap-10">
      <PageHeader
        description="This is the build loop for shipping frontend features without letting the system lose state handling, product clarity, or integration discipline."
        eyebrow="Playbook"
        heading="Use one operating rhythm for every new screen, form, and integration."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {siteConfig.workflow.map((step, index) => (
          <InfoCard
            key={step.title}
            description={step.description}
            kicker={`Step 0${index + 1}`}
            title={step.title}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-6 shadow-[0_24px_95px_rgba(7,10,20,0.18)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
            Definition of ready
          </p>
          <div className="mt-5 grid gap-4">
            {[
              "The route has a clear primary action and the next step is obvious.",
              "Loading, empty, success, and error states are designed rather than appended.",
              "Copy explains decisions and consequences, not implementation trivia.",
              "Shared sections or helpers were reused before inventing new patterns.",
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
            Verification loop
          </p>
          <div className="mt-5 grid gap-4">
            {siteConfig.deliveryTracks.map((track) => (
              <div
                key={track.title}
                className="rounded-[22px] border border-white/10 bg-black/10 px-4 py-4 dark:bg-white/4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{track.title}</h3>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
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
