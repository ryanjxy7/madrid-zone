import type { Metadata } from "next";
import { DealsTable } from "@/components/transfers/DealsTable";
import { RumourCard } from "@/components/transfers/RumourCard";
import { TransferSummaryCards } from "@/components/transfers/TransferSummaryCards";
import { getDeals, getRumours } from "@/lib/data/transfers";
import { getSiteSettings } from "@/lib/data/siteSettings";

export const metadata: Metadata = {
  title: "Transfer Centre",
  description: "Every Real Madrid deal, rumour and medical — verified before we publish.",
  alternates: { canonical: "/transfers" },
};

export default async function TransfersPage() {
  const [deals, rumours, settings] = await Promise.all([getDeals(), getRumours(), getSiteSettings()]);

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2.5">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[28px] font-bold tracking-[0.02em] text-heading sm:text-[34px]">
            TRANSFER CENTRE
          </h1>
          <p className="font-body text-[13px] text-muted">Every deal, rumour and medical — verified before we publish.</p>
        </div>
        <div className="rounded-md border border-border bg-card px-4 py-2.5 font-body text-[13px] font-semibold">
          <span className="text-muted">Window closes in</span> <span className="text-accent">{settings.transferWindowClosesText}</span>
        </div>
      </div>

      <TransferSummaryCards
        totalSpent={settings.transferTotalSpent}
        spentNote={settings.transferSpentNote}
        totalSales={settings.transferTotalSales}
        salesNote={settings.transferSalesNote}
      />

      <DealsTable deals={deals} />

      <div className="flex flex-col gap-3">
        <h2 className="border-b border-border-strong pb-2 font-display text-[13px] font-bold tracking-[0.14em] text-muted">
          RUMOUR MILL
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rumours.map((rumour) => (
            <RumourCard key={rumour.id} rumour={rumour} />
          ))}
        </div>
      </div>
    </div>
  );
}
