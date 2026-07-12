import Image from "next/image";
import Link from "next/link";

export function Logo({ size = "default" }: { size?: "default" | "small" }) {
  const isSmall = size === "small";
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Madrid Zone — home">
      <Image
        src="/logo.png"
        alt="Madrid Zone"
        width={48}
        height={48}
        className={isSmall ? "h-9 w-auto" : "h-12 w-auto"}
        style={{ filter: "var(--logo-filter)" }}
        priority
      />
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
