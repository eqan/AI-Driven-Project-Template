import NextLink from "next/link";

import { Logo } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { SidebarNav } from "@/components/sidebar-nav";
import { siteConfig } from "@/config/site";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(84,122,255,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(242,163,90,0.13),transparent_26%)]" />

      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 pb-10 pt-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:pb-12 lg:pt-6">
        <aside className="hidden lg:flex lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:flex-col">
          <div className="flex h-full flex-col rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 shadow-[0_28px_110px_rgba(7,10,20,0.2)] backdrop-blur-xl">
            <NextLink className="flex items-center gap-3" href="/">
              <span className="rounded-2xl border border-white/12 bg-white/6 p-2 text-accent shadow-[0_16px_42px_rgba(48,88,255,0.2)]">
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

            <div className="mt-auto space-y-4">
              <div className="rounded-[26px] border border-white/10 bg-black/10 p-4 dark:bg-white/4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
                  Proof of readiness
                </p>
                <div className="mt-4 space-y-3">
                  {siteConfig.proofMetrics.slice(0, 3).map((signal) => (
                    <div
                      key={signal.label}
                      className="rounded-[20px] border border-white/10 bg-white/5 p-3"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                        {signal.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {signal.value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">{signal.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-black/10 p-4 dark:bg-white/4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
                  Product rules
                </p>
                <div className="mt-4 space-y-3">
                  {siteConfig.principles.map((principle) => (
                    <div
                      key={principle.title}
                      className="rounded-[20px] border border-white/10 bg-white/5 p-3"
                    >
                      <p className="text-sm font-semibold text-foreground">{principle.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {principle.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-black/10 p-4 dark:bg-white/4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/80">
                  Go next
                </p>
                <div className="mt-4 space-y-3">
                  {siteConfig.quickLinks.map((link) => (
                    <NextLink
                      key={link.href}
                      className="block rounded-[18px] border border-white/10 bg-white/5 px-3 py-3 transition-colors hover:bg-white/10"
                      href={link.href}
                    >
                      <p className="text-sm font-semibold text-foreground">{link.label}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{link.description}</p>
                    </NextLink>
                  ))}
                </div>
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
