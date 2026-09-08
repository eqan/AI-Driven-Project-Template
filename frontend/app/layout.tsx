import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { AuthGuard } from "@/components/auth-guard";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head />
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        <Providers>
          <AuthGuard>
            <div className="relative flex min-h-screen flex-col overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(120,168,255,0.25),transparent_45%),radial-gradient(circle_at_right,rgba(242,163,90,0.16),transparent_28%)]" />
              <Navbar />
              <main className="mx-auto flex w-full max-w-7xl flex-1 px-6 pb-16 pt-10 lg:pt-14">
                {children}
              </main>
              <footer className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6 text-sm text-muted">
                <p>Frontend template for AI-assisted product delivery.</p>
                <p>Next.js App Router, HeroUI, Tailwind v4.</p>
              </footer>
            </div>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
