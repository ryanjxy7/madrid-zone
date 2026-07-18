export function TransferSummaryCards({
  totalSpent,
  spentNote,
  totalSales,
  salesNote,
}: {
  totalSpent: string;
  spentNote: string;
  totalSales: string;
  salesNote: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="flex flex-col gap-0.5 rounded-lg border border-border border-t-[3px] border-t-brand bg-card p-[13px_15px] shadow-card sm:gap-1 sm:p-[18px_22px]">
        <span className="font-display text-[9.5px] font-bold tracking-[0.12em] text-muted sm:text-[11px] sm:tracking-[0.14em]">
          TOTAL SPENT<span className="hidden sm:inline"> · THIS WINDOW</span>
        </span>
        <div className="flex items-baseline gap-1.5 sm:gap-2.5">
          <span className="font-display text-[25px] font-bold text-accent sm:text-[34px]">{totalSpent}</span>
          <span className="font-body text-[10px] font-semibold text-negative sm:text-xs">↓ money out</span>
        </div>
        <span className="hidden font-body text-xs text-muted sm:block">{spentNote}</span>
      </div>
      <div className="flex flex-col gap-0.5 rounded-lg border border-border border-t-[3px] border-t-positive bg-card p-[13px_15px] shadow-card sm:gap-1 sm:p-[18px_22px]">
        <span className="font-display text-[9.5px] font-bold tracking-[0.12em] text-muted sm:text-[11px] sm:tracking-[0.14em]">
          TOTAL SALES<span className="hidden sm:inline"> · THIS WINDOW</span>
        </span>
        <div className="flex items-baseline gap-1.5 sm:gap-2.5">
          <span className="font-display text-[25px] font-bold text-positive sm:text-[34px]">{totalSales}</span>
          <span className="font-body text-[10px] font-semibold text-positive sm:text-xs">↑ money in</span>
        </div>
        <span className="hidden font-body text-xs text-muted sm:block">{salesNote}</span>
      </div>
    </div>
  );
}
