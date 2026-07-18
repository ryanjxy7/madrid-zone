import Image from "next/image";
import Link from "next/link";
import { slugifyPlayerName } from "@/lib/football/footballService";
import { countryFlagUrl } from "@/lib/utils/countries";
import type { Player } from "@/types/football";

export function PlayerCard({ player }: { player: Player }) {
  const flagUrl = countryFlagUrl(player.nationality);

  return (
    <Link
      href={`/players/${slugifyPlayerName(player.name)}`}
      className="relative flex flex-col overflow-hidden rounded-lg border border-border border-t-[3px] border-t-brand bg-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-negative/55"
    >
      <div className="relative h-[132px] overflow-hidden bg-white sm:h-[185px]">
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-[54%] whitespace-nowrap font-display text-[120px] font-extrabold leading-none tracking-[-0.04em] text-[#e9ecf3] sm:text-[170px]">
          {player.number}
        </span>
        <Image
          src={player.image}
          alt={player.name}
          fill
          sizes="(min-width: 1024px) 240px, 45vw"
          className="z-10 object-cover"
          style={{
            objectPosition: player.imageFocus ? `${player.imageFocus.x * 100}% ${player.imageFocus.y * 100}%` : "50% 0%",
          }}
        />
      </div>
      {flagUrl ? (
        <span className="absolute right-[9px] top-[96px] z-20 h-7 w-7 flex-none overflow-hidden rounded-full border-2 border-brand shadow-md sm:right-3 sm:top-[141px] sm:h-[34px] sm:w-[34px]">
          <Image src={flagUrl} alt="" width={34} height={34} className="h-full w-full object-cover" />
        </span>
      ) : null}
      <div className="flex items-center gap-2 p-[10px_10px_12px_12px] sm:gap-[11px] sm:p-[13px_14px_15px_16px]">
        <span className="min-w-6 flex-none text-center font-display text-[22px] font-bold leading-none text-accent sm:min-w-[34px] sm:text-[30px]">
          {player.number}
        </span>
        <span className="w-px flex-none self-stretch bg-border-strong" />
        <div className="flex min-w-0 flex-col gap-0.5 sm:gap-[3px]">
          <span className="truncate font-display text-[12.5px] font-semibold uppercase tracking-[0.01em] text-heading sm:text-base sm:font-bold">
            {player.name}
          </span>
          <span className="font-body text-[8.5px] font-semibold uppercase tracking-[0.1em] text-muted sm:text-[10px] sm:tracking-[0.14em]">
            {player.role}
          </span>
        </div>
      </div>
    </Link>
  );
}
