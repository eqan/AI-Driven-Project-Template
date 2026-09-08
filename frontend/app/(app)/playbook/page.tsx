import { HeroBanner } from "@/components/hero-banner";
import { InfoCard } from "@/components/info-card";
import { ListPanel } from "@/components/list-panel";
import { SectionShell } from "@/components/section-shell";
import { siteConfig } from "@/config/site";

export default function PlaybookPage() {
  return (
    <section className="flex w-full flex-col gap-10">
      <HeroBanner
        actions={[
          { href: "/", label: "Back to overview" },
          { href: "/backend-api", label: "Align with API", variant: "secondary" },
        ]}
        asideDescription="The fastest teams repeat a small number of good moves: define the task, lock the contract, reuse the shell, and design the state path before polish."
        asideTitle="Operating rhythm"
        description="This is the repeatable build loop for shipping frontend features without losing state handling, product clarity, or integration discipline under pressure."
        eyebrow="Playbook"
        heading="Use one rhythm for every new screen, form, and integration."
        metrics={[
          {
            value: "4",
            label: "Core moves",
            note: "Define the screen, lock the contract, reuse the shell, and design the state path.",
          },
          {
            value: "1",
            label: "Pattern system",
            note: "The same page structure should survive onboarding, dashboards, CRUD, and settings work.",
          },
          {
            value: "100%",
            label: "State awareness",
            note: "Loading, empty, success, and recovery are part of the feature, not a cleanup pass.",
          },
        ]}
      />

      <SectionShell
        description="The goal is not more process. It is fewer layout rewrites, fewer surprise states, and faster confident delivery."
        eyebrow="Workflow"
        title="Every feature should move through the same sequence."
      >
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
      </SectionShell>

      <SectionShell
        description="A predictable team workflow needs both an entry checklist and an exit checklist."
        eyebrow="Finish Criteria"
        title="Know when a surface is ready to ship."
      >
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ListPanel
            eyebrow="Definition of ready"
            items={[
              "The route has a clear primary action and the next step is obvious.",
              "Loading, empty, success, and error states are designed rather than appended.",
              "Copy explains decisions and consequences, not implementation trivia.",
              "Shared sections or helpers were reused before inventing new patterns.",
            ]}
            title="Start with a clear bar for usefulness."
          />

          <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-6 shadow-[0_24px_95px_rgba(7,10,20,0.18)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/80">
              Verification loop
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-foreground">
              Finish with the same checks every time.
            </h3>
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
          </article>
        </div>
      </SectionShell>
    </section>
  );
}
