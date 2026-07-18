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
      className="flex flex-col overflow-hidden rounded-lg border border-border border-t-[3px] border-t-brand bg-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-negative/55"
    >
      <div className="relative h-[120px] overflow-hidden bg-gradient-to-b from-track to-card sm:h-[170px]">
        <Image
          src={player.image}
          alt={player.name}
          fill
          sizes="(min-width: 1024px) 240px, 45vw"
          className="object-cover object-center grayscale-[15%] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-card" />
        <span className="absolute right-[9px] top-[5px] font-display text-[44px] font-bold leading-none text-white/35 [text-shadow:0_2px_8px_rgba(0,0,0,.4)] sm:right-3 sm:top-2 sm:text-[64px] sm:[text-shadow:0_2px_10px_rgba(0,0,0,.4)]">
          {player.number}
        </span>
        {flagUrl ? (
          <span className="absolute bottom-2.5 right-2.5 h-7 w-7 flex-none overflow-hidden rounded-full border-2 border-brand shadow-md sm:h-[34px] sm:w-[34px]">
            <Image src={flagUrl} alt="" width={34} height={34} className="h-full w-full object-cover" />
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-0.5 p-3 pb-3.5 sm:p-4">
        <span className="font-display text-[10px] font-bold tracking-[0.06em] text-accent sm:text-xs">№ {player.number}</span>
        <span className="font-display text-[15px] font-bold uppercase tracking-[0.04em] text-heading sm:text-xl">{player.name}</span>
        <span className="font-body text-[9px] font-semibold uppercase tracking-[0.1em] text-muted sm:text-[10.5px] sm:tracking-[0.12em]">{player.role}</span>
      </div>
    </Link>
  );
}
