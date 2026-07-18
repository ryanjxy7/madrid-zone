import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none sm:gap-2.5" aria-label="Madrid Zone — home">
      <Image
        src="/logo.png"
        alt="Madrid Zone"
        width={48}
        height={48}
        className="h-8 w-auto flex-none sm:h-12"
        style={{ filter: "var(--logo-filter)" }}
        priority
      />
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-display text-[15px] font-bold tracking-[0.04em] text-heading sm:text-xl sm:tracking-[0.05em]">
          MADRID ZONE
        </span>
        <span className="truncate font-body text-[7.5px] font-medium tracking-[0.12em] text-muted sm:text-[10px] sm:tracking-[0.14em]">
          YOUR HUB FOR EVERYTHING
        </span>
      </span>
    </Link>
  );
}
