import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photoObjectPosition } from "@/lib/utils/images";
import type { AssistStat } from "@/types/football";

export function AssistsList({ assists }: { assists: AssistStat[] }) {
  return (
    <Card className="flex flex-col p-4 sm:p-[16px_22px]">
      <SectionHeading title="MOST ASSISTS" tone="heading" />
      {assists.map((assist) => (
        <div key={assist.rank} className="flex items-center justify-between gap-2 border-b border-border-soft py-2.5 last:border-0">
          <div className="flex items-center gap-3">
            <span className="w-[18px] font-display text-sm font-bold text-muted">{assist.rank}</span>
            <Image
              src={assist.image}
              alt=""
              width={26}
              height={26}
              className="h-[26px] w-[26px] flex-none rounded-full border-[1.5px] border-border-strong object-cover"
              style={{ objectPosition: photoObjectPosition(assist.imageFocus) }}
            />
            <span className="font-body text-[13.5px] font-semibold text-heading">{assist.name}</span>
          </div>
          <span className="font-display text-sm font-bold text-accent">{assist.assists}</span>
        </div>
      ))}
    </Card>
  );
}
