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
  const isAuthenticated = status === "authenticated";
  const isAuthPage = pathname === "/auth";

  function handleSignOut() {
    signOut();
    setIsMenuOpen(false);
    router.replace("/auth");
  }

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
          {isAuthenticated ? siteConfig.navItems.map((item) => {
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
          }) : (
            <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-muted">
              {isAuthPage ? "Secure Google sign-in" : "Authentication required"}
            </div>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-accent/20 text-sm font-semibold text-foreground">
                  {user.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={user.name}
                      className="h-full w-full object-cover"
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
                className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
                onClick={handleSignOut}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <NextLink
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              href="/auth"
            >
              Login / Signup
            </NextLink>
          )}
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
            {isAuthenticated ? siteConfig.navItems.map((item) => {
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
            }) : (
              <NextLink
                className="rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background"
                href="/auth"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Signup
              </NextLink>
            )}

            {isAuthenticated && user ? (
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="mt-1 text-xs text-muted">{user.email}</p>
              </div>
            ) : null}

            {isAuthenticated ? (
              <button
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-left text-sm font-semibold text-foreground"
                onClick={handleSignOut}
                type="button"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
