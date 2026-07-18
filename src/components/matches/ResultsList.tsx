import { Card } from "@/components/ui/Card";
import { ClubBadge } from "@/components/ui/ClubBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { extractOpponentFromResult } from "@/lib/utils/teamBadge";
import type { MatchResult, MatchResultOutcome } from "@/types/football";

const outcomeClasses: Record<MatchResultOutcome, string> = {
  W: "text-positive",
  D: "text-warning",
  L: "text-negative",
};

export function ResultsList({ results }: { results: MatchResult[] }) {
  return (
    <Card className="flex flex-col p-4 sm:p-[16px_22px]">
      <SectionHeading title="RECENT RESULTS" tone="heading" />
      {results.map((result) => (
        <div key={result.id} className="flex items-center justify-between gap-2 border-b border-border-soft py-3 last:border-0">
          <div className="flex items-center gap-2.5">
            <div className="flex flex-none">
              <ClubBadge name="Real Madrid" sizePx={24} fallbackMark="RMA" />
              <ClubBadge name={extractOpponentFromResult(result.match)} sizePx={24} className="-ml-1.5 border-2 border-card" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-body text-sm font-semibold text-heading">{result.match}</span>
              <span className="font-body text-[11px] text-muted">{result.competition}</span>
            </div>
          </div>
          <span className={`font-display text-[15px] font-bold ${outcomeClasses[result.outcome]}`}>{result.outcome}</span>
        </div>
      ))}
    </Card>
  );
}
