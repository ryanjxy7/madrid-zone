import { PlayerCard } from "@/components/squad/PlayerCard";
import type { SquadGroup } from "@/types/football";

export function SquadGroupSection({ group }: { group: SquadGroup }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="border-b border-border-strong pb-2 font-display text-[13px] font-bold tracking-[0.14em] text-accent">
        {group.label}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {group.players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}
