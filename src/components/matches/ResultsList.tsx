import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
          <div className="flex flex-col gap-0.5">
            <span className="font-body text-sm font-semibold text-heading">{result.match}</span>
            <span className="font-body text-[11px] text-muted">{result.competition}</span>
          </div>
          <span className={`font-display text-[15px] font-bold ${outcomeClasses[result.outcome]}`}>{result.outcome}</span>
        </div>
      ))}
    </Card>
  );
}
