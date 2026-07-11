"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, mobileTabs } from "@/lib/nav";

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-40 flex justify-around border-t border-border-strong bg-card px-1 py-2.5 pb-[calc(env(safe-area-inset-bottom)+10px)] md:hidden">
      {mobileTabs.map((item) => {
        const active = isNavActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 font-display text-[9.5px] font-bold tracking-[0.06em] ${
              active ? "text-accent" : "text-muted"
            }`}
          >
            <span aria-hidden className="text-base leading-none">
              {item.icon}
            </span>
            {item.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
