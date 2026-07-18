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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1 rounded-lg border border-border border-t-[3px] border-t-brand bg-card p-[18px_22px] shadow-card">
        <span className="font-display text-[11px] font-bold tracking-[0.14em] text-muted">TOTAL SPENT · THIS WINDOW</span>
        <div className="flex items-baseline gap-2.5">
          <span className="font-display text-[28px] font-bold text-accent sm:text-[34px]">{totalSpent}</span>
          <span className="font-body text-xs font-semibold text-negative">↓ money out</span>
        </div>
        <span className="font-body text-xs text-muted">{spentNote}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-border border-t-[3px] border-t-positive bg-card p-[18px_22px] shadow-card">
        <span className="font-display text-[11px] font-bold tracking-[0.14em] text-muted">TOTAL SALES · THIS WINDOW</span>
        <div className="flex items-baseline gap-2.5">
          <span className="font-display text-[28px] font-bold text-positive sm:text-[34px]">{totalSales}</span>
          <span className="font-body text-xs font-semibold text-positive">↑ money in</span>
        </div>
        <span className="font-body text-xs text-muted">{salesNote}</span>
      </div>
    </div>
  );
}
