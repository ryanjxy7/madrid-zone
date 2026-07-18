"use client";

import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StatLeaderCategory } from "@/types/football";

export function StatLeadersWidget({ categories }: { categories: StatLeaderCategory[] }) {
  const [activeKey, setActiveKey] = useState(categories[0]?.key);
  const active = categories.find((category) => category.key === activeKey) ?? categories[0];

  return (
    <Card className="flex flex-col p-4 sm:p-[16px_22px]">
      <SectionHeading title="STAT LEADERS" href="/squad" linkLabel="SEE ALL →" tone="heading" />
      <div className="flex flex-wrap gap-1.5 pb-1 pt-3">
        {categories.map((category) => {
          const isActive = category.key === active?.key;
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveKey(category.key)}
              className={`cursor-pointer whitespace-nowrap rounded-full border px-[11px] py-1.5 font-display text-[10px] font-bold tracking-[0.08em] transition-colors ${
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-border-strong bg-transparent text-muted hover:border-brand/60"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
      {active?.rows.map((row) => (
        <div key={row.rank} className="flex items-center gap-2.5 border-b border-border-soft py-2.5 last:border-0">
          <span className="w-3.5 font-display text-[13px] font-bold text-muted">{row.rank}</span>
          <Image src={row.image} alt="" width={26} height={26} className="h-[26px] w-[26px] flex-none rounded-full border-[1.5px] border-border-strong object-cover" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-body text-[13px] font-semibold text-heading">{row.name}</span>
              <span className="font-display text-sm font-bold text-accent">{row.value}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-track">
              <div className="h-full rounded-full bg-brand" style={{ width: `${row.barPercent}%` }} />
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}
