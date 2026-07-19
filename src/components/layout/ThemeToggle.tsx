"use client";

import { useTheme } from "./ThemeProvider";

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const light = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={light ? "Switch to night mode" : "Switch to day mode"}
      className="flex w-[50px] flex-none cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-full border-[1.5px] border-brand/45 py-1.5 font-display text-[8.5px] font-bold tracking-wide text-accent transition-colors hover:border-brand hover:bg-brand/10 sm:w-[90px] sm:gap-1.5 sm:py-2 sm:text-[11px]"
    >
      {light ? <MoonIcon /> : <SunIcon />}
      <span className="sm:hidden">{light ? "NIGHT" : "DAY"}</span>
      <span className="hidden sm:inline">{light ? "NIGHT MODE" : "DAY MODE"}</span>
    </button>
  );
}
