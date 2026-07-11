import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getWireItems } from "@/lib/data/articles";

export async function LatestNewsWidget() {
  const items = await getWireItems();

  return (
    <Card className="flex flex-col p-4">
      <SectionHeading title="LATEST NEWS" href="/transfers" linkLabel="All news →" />
      {items.map((item) => (
        <div key={item.time} className="flex flex-col gap-0.5 border-b border-border-soft py-3 last:border-0">
          <span className="font-body text-[10.5px] font-semibold text-muted">{item.time}</span>
          <p className="font-body text-[13px] leading-snug">{item.text}</p>
        </div>
      ))}
    </Card>
  );
}
