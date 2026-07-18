import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFixtures } from "@/lib/data/matches";
import { opponentName } from "@/lib/utils/teamBadge";

export async function FixturesWidget() {
  const fixtures = await getFixtures();

  return (
    <Card className="flex flex-col p-4">
      <SectionHeading title="FIXTURES" href="/matches" linkLabel="All matches →" tone="heading" />
      {fixtures.map((fixture) => (
        <div key={fixture.id} className="flex items-center justify-between gap-2 border-b border-border-soft py-[11px] last:border-0">
          <span className="font-body text-[13px]">vs {opponentName(fixture.opponent)}</span>
          <span className="font-body text-[11px] font-semibold text-muted">{fixture.date}</span>
        </div>
      ))}
    </Card>
  );
}
