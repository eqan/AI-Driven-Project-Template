"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/75 backdrop-blur-xl">
      <header className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-4">
          <NextLink className="flex items-center gap-3" href="/">
            <span className="rounded-2xl border border-white/12 bg-white/6 p-2 text-accent shadow-[0_12px_36px_rgba(48,88,255,0.18)]">
              <Logo size={24} />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent/80">
                Project Template
              </p>
              <p className="text-sm text-muted">
                HeroUI frontend baseline
              </p>
            </div>
          </NextLink>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {siteConfig.navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <NextLink
                key={item.href}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-white/10 text-foreground"
                    : "text-muted hover:text-foreground",
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="rounded-xl border border-white/10 bg-white/6 p-2 text-foreground"
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="border-t border-white/10 px-6 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-2">
            {siteConfig.navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <NextLink
                  key={item.href}
                  className={clsx(
                    "rounded-2xl px-4 py-3 text-sm transition-colors",
                    isActive
                      ? "bg-white/10 text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NextLink>
              );
            })}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
