"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, mobileTabs } from "@/lib/nav";

function TabIcon({ href }: { href: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "block",
  };

  switch (href) {
    case "/":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
      );
    case "/transfers":
      return (
        <svg {...common}>
          <path d="M4 8h13" />
          <path d="M14 5l3 3-3 3" />
          <path d="M20 16H7" />
          <path d="M10 13l-3 3 3 3" />
        </svg>
      );
    case "/matches":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.4 16.4 10.6 14.7 15.6 9.3 15.6 7.6 10.6Z" />
        </svg>
      );
    case "/squad":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.6" />
          <path d="M5 20c1.2-3.8 3.8-5.6 7-5.6s5.8 1.8 7 5.6" />
        </svg>
      );
    case "/stats":
      return (
        <svg {...common}>
          <path d="M5 20v-8" />
          <path d="M12 20V5" />
          <path d="M19 20v-11" />
        </svg>
      );
    default:
      return null;
  }
}

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
            <TabIcon href={item.href} />
            {item.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
