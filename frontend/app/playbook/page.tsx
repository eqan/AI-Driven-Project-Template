import { InfoCard } from "@/components/info-card";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";

export default function PlaybookPage() {
  return (
    <section className="flex w-full flex-col gap-10">
      <PageHeader
        description="This is the feature-delivery loop the frontend should follow so AI-assisted changes stay readable, consistent, and easy to review."
        eyebrow="Playbook"
        heading="Use one repeatable workflow for every frontend feature."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {siteConfig.workflow.map((step, index) => (
          <InfoCard
            key={step.title}
            description={step.description}
            kicker={`Step 0${index + 1}`}
            title={step.title}
          />
        ))}
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(7,10,20,0.18)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
          Delivery checklist
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            "Confirm route, user action, and states before implementation.",
            "Prefer existing sections and patterns before inventing new ones.",
            "Keep forms, tables, and dialogs driven by typed contracts.",
            "Add loading, empty, success, and error states deliberately.",
            "Document structural changes in the frontend architecture files.",
            "Verify with lint and build before closing the task.",
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
    </section>
  );
}
