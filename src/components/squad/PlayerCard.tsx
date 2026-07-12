import Link from "next/link";
import { slugifyPlayerName } from "@/lib/football/footballService";
import type { Player } from "@/types/football";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/players/${slugifyPlayerName(player.name)}`}
      className="group relative flex min-h-[130px] flex-col justify-end gap-0.5 overflow-hidden rounded-lg border border-border border-t-[3px] border-t-brand bg-card p-[18px] shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-negative/55"
    >
      <span className="pointer-events-none absolute -right-2 -top-[18px] font-display text-[108px] font-bold leading-none text-track">
        {player.number}
      </span>
      <span className="font-display text-[13px] font-bold tracking-[0.06em] text-accent">№ {player.number}</span>
      <span className="font-display text-xl font-bold uppercase tracking-[0.04em] text-heading">{player.name}</span>
      <span className="font-body text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">{player.role}</span>
    </Link>
  );
}
