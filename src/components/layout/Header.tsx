"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, primaryNav } from "@/lib/nav";
import { Logo } from "./Logo";
import { MobilePillNav } from "./MobilePillNav";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ followerCount }: { followerCount: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-border-strong">
      <div className="flex flex-nowrap items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-6 font-body text-[13px] font-semibold tracking-[0.03em] md:flex">
          {primaryNav.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "text-accent" : "text-subtle hover:text-heading"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-none items-center gap-1.5 sm:gap-3.5">
          <span className="hidden font-body text-xs font-medium text-muted sm:inline">
            {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </span>
          <ThemeToggle />
          <Link
            href="/follow"
            className="whitespace-nowrap rounded-full bg-brand px-2.5 py-1.5 font-display text-[8.5px] font-bold tracking-[0.05em] text-white hover:opacity-90 sm:px-3.5 sm:py-2 sm:text-[11px] sm:tracking-[0.08em]"
          >
            FOLLOW · {followerCount}
          </Link>
        </div>
      </div>

      <MobilePillNav />
    </header>
  );
}
