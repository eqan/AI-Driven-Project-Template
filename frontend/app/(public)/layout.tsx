import NextLink from "next/link";

import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(84,122,255,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(242,163,90,0.16),transparent_26%)]" />

      <header className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <NextLink className="inline-flex items-center gap-3" href="/">
          <span className="rounded-2xl border border-white/12 bg-white/6 p-2 text-accent shadow-[0_18px_50px_rgba(48,88,255,0.22)]">
            <Logo size={22} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent/80">
              {siteConfig.name}
            </p>
            <p className="text-sm text-muted">{siteConfig.productTagline}</p>
          </div>
        </NextLink>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 pb-10 pt-6 sm:px-6">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <p className="text-xs font-medium tracking-[0.08em] text-muted">
          Secure workspace access
        </p>
      </footer>
    </div>
  );
}
