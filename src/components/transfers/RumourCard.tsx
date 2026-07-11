import type { Rumour } from "@/types/football";

export function RumourCard({ rumour }: { rumour: Rumour }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="font-display text-[10px] font-bold tracking-[0.1em] text-muted">{rumour.source}</span>
        <span className="rounded-[3px] bg-negative/[0.14] px-2 py-[3px] font-display text-[10px] font-bold tracking-[0.08em] text-accent">
          {rumour.tier}
        </span>
      </div>
      <p className="font-body text-[15px] font-semibold leading-snug text-heading">{rumour.text}</p>
      <span className="font-body text-[11px] text-muted">{rumour.time}</span>
    </div>
  );
}
