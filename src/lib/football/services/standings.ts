import type { AssistStat, ScorerStat, StandingRow } from "@/types/football";
import { footballConfig, type CompetitionKey } from "@/config/football";
import { sofascoreProvider } from "../providers/sofascore";
import type { RatedPlayer } from "../types/domain";

function competitionId(competition: CompetitionKey): string {
  return footballConfig.competitions[competition].id;
}

export async function getStandings(competition: CompetitionKey): Promise<StandingRow[] | null> {
  return sofascoreProvider.getStandings(competitionId(competition));
}

export async function getTopScorers(competition: CompetitionKey): Promise<ScorerStat[] | null> {
  return sofascoreProvider.getTopScorers(competitionId(competition));
}

export async function getTopAssists(competition: CompetitionKey): Promise<AssistStat[] | null> {
  return sofascoreProvider.getTopAssists(competitionId(competition));
}

export async function getBestRatedPlayers(competition: CompetitionKey): Promise<RatedPlayer[] | null> {
  return sofascoreProvider.getBestRatedPlayers(competitionId(competition));
}
