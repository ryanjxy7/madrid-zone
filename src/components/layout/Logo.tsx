import Link from "next/link";

export function Logo({ size = "default" }: { size?: "default" | "small" }) {
  const isSmall = size === "small";
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Madrid Zone — home">
      <span
        className={`font-display font-bold leading-none tracking-[0.02em] text-heading ${
          isSmall ? "text-[26px]" : "text-[34px]"
        }`}
      >
        MZ
      </span>
      <span className="flex flex-col">
        <span className={`font-display font-bold tracking-[0.05em] text-heading ${isSmall ? "text-[17px]" : "text-xl"}`}>
          MADRID ZONE
        </span>
        <span className="font-body text-[9px] font-medium tracking-[0.14em] text-muted sm:text-[10px]">
          YOUR HUB FOR EVERYTHING
        </span>
      </span>
    </Link>
  );
}
