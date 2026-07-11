import type { StatTile } from "@/types/football";

export function StatTileCard({ tile }: { tile: StatTile }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-card p-4 sm:p-[18px_20px]">
      <span className="font-display text-2xl font-bold text-accent sm:text-[32px]">{tile.value}</span>
      <span className="font-body text-xs font-semibold text-heading">{tile.label}</span>
      <span className="font-body text-[11px] text-muted">{tile.sub}</span>
    </div>
  );
}
