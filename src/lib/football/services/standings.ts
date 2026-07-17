import type { AssistStat, ScorerStat, StandingRow } from "@/types/football";
import type { CompetitionKey } from "@/config/football";
import { apiFootballProvider as activeProvider } from "../providers/apiFootball";
import type { RatedPlayer } from "../types/domain";

export async function getStandings(competition: CompetitionKey): Promise<StandingRow[] | null> {
  return activeProvider.getStandings(competition);
}

export async function getTopScorers(competition: CompetitionKey): Promise<ScorerStat[] | null> {
  return activeProvider.getTopScorers(competition);
}

export async function getTopAssists(competition: CompetitionKey): Promise<AssistStat[] | null> {
  return activeProvider.getTopAssists(competition);
}

export async function getBestRatedPlayers(competition: CompetitionKey): Promise<RatedPlayer[] | null> {
  return activeProvider.getBestRatedPlayers(competition);
}
