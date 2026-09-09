import NextLink from "next/link";

import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--line)] bg-[rgba(248,250,252,0.9)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <NextLink className="inline-flex items-center gap-3" href="/">
            <span className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2 text-accent">
            <Logo size={22} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{siteConfig.name}</p>
              <p className="text-sm text-muted">{siteConfig.productTagline}</p>
            </div>
          </NextLink>

          <p className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-muted">
            Secure access
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
