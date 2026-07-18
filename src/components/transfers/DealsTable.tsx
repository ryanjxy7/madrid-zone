import { directionClasses, statusClasses } from "@/lib/utils/transferStyles";
import type { TransferDeal } from "@/types/football";

/** Real Madrid's badge is always red "RMA"; the other club's badge is gray with an editor-set short code (defaults to "CLB" for an unnamed club). Order flips so the arrow always reads left-to-right as "where the player is coming from → going to". */
function dealBadges(deal: TransferDeal): { left: string; right: string } {
  const rma = "RMA";
  const counterpart = deal.counterpartMark ?? "CLB";
  return deal.direction === "OUT" ? { left: rma, right: counterpart } : { left: counterpart, right: rma };
}

function ClubBadge({ mark, isMadrid }: { mark: string; isMadrid: boolean }) {
  return (
    <span
      className={`flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full font-display text-[7.5px] font-bold text-white ${
        isMadrid ? "bg-brand" : "bg-[#565d73]"
      }`}
    >
      {mark}
    </span>
  );
}

function DirectionBadges({ deal }: { deal: TransferDeal }) {
  const { left, right } = dealBadges(deal);
  return (
    <div className="flex flex-none items-center gap-2">
      <ClubBadge mark={left} isMadrid={left === "RMA"} />
      <span className={`font-display text-sm font-bold ${directionClasses(deal.direction)}`}>→</span>
      <ClubBadge mark={right} isMadrid={right === "RMA"} />
    </div>
  );
}

export function DealsTable({ deals }: { deals: TransferDeal[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="hidden grid-cols-[2.2fr_1.4fr_1.2fr_1fr] gap-3 border-b border-border-strong px-[22px] py-3 font-display text-[11px] font-bold tracking-[0.12em] text-muted md:grid">
        <span>PLAYER / POSITION</span>
        <span>MOVE</span>
        <span>STATUS</span>
        <span>FEE</span>
      </div>

      {deals.map((deal) => (
        <div key={deal.id}>
          {/* Desktop row */}
          <div className="hidden grid-cols-[2.2fr_1.4fr_1.2fr_1fr] items-center gap-3 border-b border-border-soft px-[22px] py-3.5 last:border-0 md:grid">
            <div className="flex flex-col gap-0.5">
              <span className="font-body text-[14.5px] font-semibold text-heading">{deal.player}</span>
              <span className="font-body text-[11px] font-medium text-muted">{deal.position}</span>
            </div>
            <DirectionBadges deal={deal} />
            <span>
              <span className={`inline-block rounded-[3px] px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.08em] ${statusClasses(deal.status)}`}>
                {deal.status}
              </span>
            </span>
            <span className="font-body text-[13px] font-semibold">{deal.fee}</span>
          </div>

          {/* Mobile card */}
          <div className="flex flex-col gap-2.5 border-b border-border-soft p-4 last:border-0 md:hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-body text-[14.5px] font-semibold text-heading">{deal.player}</span>
                <span className={`w-fit rounded-[3px] px-1.5 py-0.5 font-display text-[9px] font-bold tracking-[0.08em] ${statusClasses(deal.status)}`}>
                  {deal.status}
                </span>
              </div>
              <DirectionBadges deal={deal} />
            </div>
            <div className="flex gap-2.5 font-body text-[11px] font-medium text-muted">
              <span>{deal.position}</span>
              <span>{deal.fee}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
