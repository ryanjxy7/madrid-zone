"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, primaryNav } from "@/lib/nav";
import { Logo } from "./Logo";
import { MobilePillNav } from "./MobilePillNav";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border-strong">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
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

        <div className="flex items-center gap-3 sm:gap-3.5">
          <span className="hidden font-body text-xs font-medium text-muted sm:inline">
            {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </span>
          <ThemeToggle />
        </div>
      </div>

      <MobilePillNav />
    </header>
  );
}
