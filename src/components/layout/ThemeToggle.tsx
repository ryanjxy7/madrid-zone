"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="cursor-pointer whitespace-nowrap rounded-full border border-border-strong px-2 py-1 font-body text-[8.5px] font-semibold tracking-wide text-muted transition-colors hover:text-heading sm:px-3 sm:py-1.5 sm:text-[11px]"
    >
      <span className="sm:hidden">{theme === "light" ? "NIGHT" : "DAY"}</span>
      <span className="hidden sm:inline">{theme === "light" ? "NIGHT MODE" : "DAY MODE"}</span>
    </button>
  );
}
