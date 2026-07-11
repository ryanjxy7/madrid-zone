"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, mobileTabs } from "@/lib/nav";

export function MobilePillNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-t border-border px-4 py-2.5 md:hidden">
      {mobileTabs.map((item) => {
        const active = isNavActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-none rounded-full border border-border px-3.5 py-1.5 font-body text-xs font-semibold ${
              active ? "bg-brand text-white" : "text-subtle"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
