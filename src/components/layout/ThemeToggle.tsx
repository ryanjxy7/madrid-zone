"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex w-[42px] flex-none cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-border-strong py-1.5 font-body text-[8.5px] font-semibold tracking-wide text-muted transition-colors hover:text-heading sm:w-[80px] sm:py-2 sm:text-[11px]"
    >
      <span className="sm:hidden">{theme === "light" ? "NIGHT" : "DAY"}</span>
      <span className="hidden sm:inline">{theme === "light" ? "NIGHT MODE" : "DAY MODE"}</span>
    </button>
  );
}
