import Image from "next/image";
import type { Player } from "@/types/football";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-negative/55">
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={player.image}
          alt={player.name}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>
      <span className="absolute left-3.5 top-2.5 font-display text-3xl font-bold text-white/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-[46px]">
        {player.number}
      </span>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-[rgba(7,8,12,0.96)] to-transparent px-4 pb-3.5 pt-9 sm:pt-12">
        <span className="font-display text-base font-bold uppercase tracking-[0.05em] text-white sm:text-[19px]">
          {player.name}
        </span>
        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#ff8b9c] sm:text-[10.5px]">
          {player.role}
        </span>
      </div>
    </div>
  );
}
