"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="cursor-pointer rounded-full border border-border-strong px-3 py-1.5 font-body text-[11px] font-semibold tracking-wide text-muted transition-colors hover:text-heading"
    >
      {theme === "light" ? "NIGHT MODE" : "DAY MODE"}
    </button>
  );
}
