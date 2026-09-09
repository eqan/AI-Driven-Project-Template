"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

import { useAuth } from "@/components/auth-provider";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, status, user } = useAuth();

  function handleSignOut() {
    signOut();
    setIsMenuOpen(false);
    router.replace("/auth");
  }

  function isActivePath(href: string) {
    return href === "/" ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav className="sticky top-4 z-40">
      <header className="flex items-center gap-4 rounded-[24px] border border-[var(--line-strong)] bg-[var(--surface-strong)] px-4 py-4 shadow-[0_14px_44px_rgba(2,6,23,0.14)] sm:px-5">
        <div className="flex min-w-0 items-center gap-4 lg:hidden">
          <NextLink className="flex items-center gap-3" href="/">
            <span className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 text-accent">
              <Logo size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent/80">
                {siteConfig.name}
              </p>
              <p className="text-sm text-muted">{siteConfig.productTagline}</p>
            </div>
          </NextLink>
        </div>

        <div className="hidden min-w-0 items-center gap-2 md:flex lg:hidden">
          {siteConfig.navItems.map((item) => {
            return (
              <NextLink
                key={item.href}
                className={clsx(
                  "rounded-2xl px-4 py-2 text-sm transition-colors",
                  isActivePath(item.href)
                    ? "bg-[var(--surface)] text-foreground"
                    : "text-muted hover:text-foreground",
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            );
          })}
        </div>

        <div className="ml-auto hidden items-center gap-3 sm:flex">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Protected workspace
          </div>

          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-accent/20 text-sm font-semibold text-foreground">
                  {user.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={user.name}
                      className="h-full w-full object-cover"
                      decoding="async"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      src={user.picture}
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="max-w-[12rem]">
                  <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
              </div>
              <button
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
                onClick={handleSignOut}
                type="button"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm text-muted">
              {status === "loading" ? "Restoring session" : "Account unavailable"}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 sm:hidden">
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2 text-foreground"
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
        <div className="mt-3 rounded-[24px] border border-[var(--line-strong)] bg-[var(--surface-strong)] px-4 pb-4 pt-4 shadow-[0_14px_44px_rgba(2,6,23,0.14)] sm:hidden">
          <div className="flex flex-col gap-2">
            {siteConfig.navItems.map((item) => {
              return (
                <NextLink
                  key={item.href}
                  className={clsx(
                    "rounded-2xl px-4 py-3 text-sm transition-colors",
                    isActivePath(item.href)
                      ? "bg-[var(--surface)] text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="block font-semibold text-foreground">{item.label}</span>
                  <span className="mt-1 block text-sm text-muted">{item.description}</span>
                </NextLink>
              );
            })}

            {user ? (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="mt-1 text-xs text-muted">{user.email}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-muted">
                {status === "loading" ? "Restoring session" : "Account unavailable"}
              </div>
            )}

            {user ? (
              <button
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-left text-sm font-semibold text-foreground"
                onClick={handleSignOut}
                type="button"
              >
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
