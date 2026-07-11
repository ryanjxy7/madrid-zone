import { directionClasses, statusClasses } from "@/lib/utils/transferStyles";
import type { TransferDeal } from "@/types/football";

export function DealsTable({ deals }: { deals: TransferDeal[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="hidden grid-cols-[2fr_1fr_1.2fr_1fr_2.4fr] gap-3 border-b border-border-strong px-[22px] py-3 font-display text-[11px] font-bold tracking-[0.12em] text-muted md:grid">
        <span>PLAYER / POSITION</span>
        <span>DIRECTION</span>
        <span>STATUS</span>
        <span>FEE</span>
        <span>LATEST</span>
      </div>

      {deals.map((deal) => (
        <div key={deal.id}>
          {/* Desktop row */}
          <div className="hidden grid-cols-[2fr_1fr_1.2fr_1fr_2.4fr] items-center gap-3 border-b border-border-soft px-[22px] py-3.5 last:border-0 md:grid">
            <div className="flex flex-col gap-0.5">
              <span className="font-body text-[14.5px] font-semibold text-heading">{deal.player}</span>
              <span className="font-body text-[11px] font-medium text-muted">{deal.position}</span>
            </div>
            <span className={`font-body text-xs font-semibold ${directionClasses(deal.direction)}`}>{deal.direction}</span>
            <span>
              <span className={`inline-block rounded-[3px] px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.08em] ${statusClasses(deal.status)}`}>
                {deal.status}
              </span>
            </span>
            <span className="font-body text-[13px] font-semibold">{deal.fee}</span>
            <span className="font-body text-[12.5px] leading-snug text-subtle">{deal.latest}</span>
          </div>

          {/* Mobile card */}
          <div className="flex flex-col gap-1.5 border-b border-border-soft p-4 last:border-0 md:hidden">
            <div className="flex items-center justify-between gap-2">
              <span className="font-body text-[14.5px] font-semibold text-heading">{deal.player}</span>
              <span className={`flex-none rounded-[3px] px-2 py-1 font-display text-[9.5px] font-bold tracking-[0.08em] ${statusClasses(deal.status)}`}>
                {deal.status}
              </span>
            </div>
            <div className="flex gap-2.5 font-body text-[11px] font-medium text-muted">
              <span className={`font-bold ${directionClasses(deal.direction)}`}>{deal.direction}</span>
              <span>{deal.position}</span>
              <span>{deal.fee}</span>
            </div>
            <p className="font-body text-[12.5px] leading-snug text-subtle">{deal.latest}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
