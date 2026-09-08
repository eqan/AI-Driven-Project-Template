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
                ? "border-white/10 bg-white/10"
                : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/6",
            )}
            href={item.href}
          >
            <p className="text-sm font-semibold text-foreground">{item.label}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
          </NextLink>
        );
      })}
    </nav>
  );
}
