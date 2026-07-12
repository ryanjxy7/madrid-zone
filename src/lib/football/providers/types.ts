import type { Fixture, MatchResult, ScorerStat, AssistStat, StandingRow, SquadGroup } from "@/types/football";
import type { LiveMatchDetail, PlayerProfile, PlayerSeasonStats, RatedPlayer, TeamInfo } from "../types/domain";

/**
 * The contract every football data provider must satisfy. footballService
 * depends only on this interface, never on a concrete provider — swapping
 * Sofascore for something else later (including reverting to the existing
 * API-Football implementation in src/lib/sports-api/api-football, which
 * still works and is left in place for exactly this reason) means writing
 * one new file that implements this interface and changing one import in
 * footballService.ts. No service, page, or component changes required.
 */
export interface FootballProvider {
  getTeamInfo(): Promise<TeamInfo | null>;
  getUpcomingFixtures(count: number): Promise<Fixture[] | null>;
  getRecentResults(count: number): Promise<MatchResult[] | null>;
  getLiveMatch(): Promise<LiveMatchDetail | null>;
  getMatchDetail(matchId: string): Promise<LiveMatchDetail | null>;
  getSquad(): Promise<SquadGroup[] | null>;
  getPlayerProfile(playerId: string): Promise<PlayerProfile | null>;
  getPlayerSeasonStats(playerId: string): Promise<PlayerSeasonStats | null>;
  getStandings(competitionId: string): Promise<StandingRow[] | null>;
  getTopScorers(competitionId: string): Promise<ScorerStat[] | null>;
  getTopAssists(competitionId: string): Promise<AssistStat[] | null>;
  getBestRatedPlayers(competitionId: string): Promise<RatedPlayer[] | null>;
}
