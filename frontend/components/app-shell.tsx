import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/config/site";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/75">
              Workspace summary
            </p>
            <p className="mt-1 text-sm text-muted">
              Shared shell, guarded routes, and reusable product modules.
            </p>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {siteConfig.proofMetrics.slice(0, 3).map((signal) => (
              <div key={signal.label} className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {signal.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{signal.value}</p>
              </div>
            ))}
          </div>
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}
