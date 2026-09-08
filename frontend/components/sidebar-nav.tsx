"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { siteConfig } from "@/config/site";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {siteConfig.navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <NextLink
            key={item.href}
            className={clsx(
              "rounded-[22px] border px-4 py-4 transition-colors",
              isActive
                ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] shadow-[0_18px_50px_rgba(7,10,20,0.12)]"
                : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/6",
            )}
            href={item.href}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent/70">
              Route
            </p>
            <p className="text-sm font-semibold text-foreground">{item.label}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
          </NextLink>
        );
      })}
    </nav>
  );
}
