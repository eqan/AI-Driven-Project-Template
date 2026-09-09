"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { siteConfig } from "@/config/site";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-1.5">
      {siteConfig.navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <NextLink
            key={item.href}
            className={clsx(
              "rounded-2xl border px-4 py-3.5 transition-all",
              isActive
                ? "border-accent/25 bg-[linear-gradient(180deg,rgba(124,178,255,0.12),rgba(124,178,255,0.04))] shadow-[0_12px_34px_rgba(2,6,23,0.14)] ring-1 ring-accent/15"
                : "border-transparent bg-transparent hover:border-[var(--line)] hover:bg-[var(--surface)]",
            )}
            href={item.href}
          >
            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  "h-8 w-1 rounded-full transition-colors",
                  isActive ? "bg-accent" : "bg-transparent",
                )}
              />
              <div className="min-w-0">
                <p
                  className={clsx(
                    "text-sm font-semibold transition-colors",
                    isActive ? "text-foreground" : "text-foreground",
                  )}
                >
                  {item.label}
                </p>
                <p
                  className={clsx(
                    "mt-1 text-sm leading-5 transition-colors",
                    isActive ? "text-foreground/80" : "text-muted",
                  )}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </NextLink>
        );
      })}
    </nav>
  );
}
