import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  accentTop = false,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  accentTop?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-card shadow-card ${
        accentTop ? "border-t-[3px] border-t-brand" : ""
      } ${hover ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
