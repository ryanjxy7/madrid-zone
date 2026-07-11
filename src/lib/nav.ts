export interface NavItem {
  label: string;
  href: string;
  match: string[];
  icon?: string;
}

export const primaryNav: NavItem[] = [
  { label: "News", href: "/", match: ["/", "/news"] },
  { label: "Transfers", href: "/transfers", match: ["/transfers"] },
  { label: "Matches", href: "/matches", match: ["/matches"] },
  { label: "Stats", href: "/stats", match: ["/stats"] },
  { label: "Analysis", href: "/analysis", match: ["/analysis"] },
  { label: "Squad", href: "/squad", match: ["/squad"] },
  { label: "About", href: "/about", match: ["/about"] },
];

export const mobileTabs: NavItem[] = [
  { label: "Home", href: "/", icon: "🏠", match: ["/", "/news"] },
  { label: "Transfers", href: "/transfers", icon: "⇄", match: ["/transfers"] },
  { label: "Matches", href: "/matches", icon: "⚽", match: ["/matches"] },
  { label: "Squad", href: "/squad", icon: "👤", match: ["/squad"] },
  { label: "Stats", href: "/stats", icon: "📊", match: ["/stats"] },
];

export function isNavActive(pathname: string, item: NavItem): boolean {
  return item.match.some((prefix) =>
    prefix === "/" ? pathname === "/" : pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
