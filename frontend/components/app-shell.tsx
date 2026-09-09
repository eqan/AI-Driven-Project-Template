import NextLink from "next/link";

import { Logo } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { SidebarNav } from "@/components/sidebar-nav";
import { siteConfig } from "@/config/site";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(124,178,255,0.06),transparent_18%),radial-gradient(circle_at_top_left,rgba(124,178,255,0.06),transparent_24%)]" />

      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 pb-10 pt-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:pb-12 lg:pt-6">
        <aside className="hidden lg:flex lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:flex-col">
          <div className="flex h-full flex-col rounded-[28px] border border-[var(--line-strong)] bg-[var(--surface)] p-5 shadow-[0_18px_56px_rgba(2,6,23,0.14)]">
            <NextLink className="flex items-center gap-3" href="/">
              <span className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-2 text-accent">
                <Logo size={22} />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent/80">
                  {siteConfig.name}
                </p>
                <p className="text-sm text-muted">{siteConfig.productTagline}</p>
              </div>
            </NextLink>

            <SidebarNav />

            <div className="mt-auto">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
                    Workspace status
                  </p>
                  <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Ready
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {siteConfig.proofMetrics.slice(0, 3).map((signal) => (
                    <div
                      key={signal.label}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                          {signal.label}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-foreground">{signal.value}</p>
                    </div>
                  ))}
                </div>
                <NextLink
                  className="mt-4 inline-flex rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
                  href="/backend-api"
                >
                  Open backend map
                </NextLink>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <Navbar />
          <main className="pt-6 lg:pt-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
