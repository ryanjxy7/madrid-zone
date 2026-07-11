import Link from "next/link";

export function SectionHeading({
  title,
  href,
  linkLabel = "All →",
  tone = "accent",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  tone?: "accent" | "heading";
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-border pb-2.5">
      <h2
        className={`font-display text-[13px] font-bold tracking-[0.1em] ${
          tone === "accent" ? "text-accent" : "text-heading"
        }`}
      >
        {title}
      </h2>
      {href ? (
        <Link href={href} className="font-body text-xs font-semibold text-accent hover:opacity-85">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
