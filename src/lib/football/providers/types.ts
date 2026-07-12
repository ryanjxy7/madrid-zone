import type { Fixture, MatchResult, ScorerStat, AssistStat, StandingRow, SquadGroup } from "@/types/football";
import type { CompetitionKey } from "@/config/football";
import type { LiveMatchDetail, PlayerProfile, PlayerSeasonStats, RatedPlayer, TeamInfo } from "../types/domain";

/**
 * The contract every football data provider must satisfy. footballService
 * depends only on this interface, never on a concrete provider — swapping
 * providers later (this project has swapped twice: API-Football ->
 * Sofascore -> ESPN, all still present and all implementing this same
 * interface) means writing one new file and changing one import per
 * service file. No page or component changes required.
 *
 * Competition-scoped methods take the semantic CompetitionKey ("laLiga" /
 * "championsLeague") rather than a pre-resolved ID string, because
 * different providers identify competitions completely differently
 * (Sofascore: opaque numeric IDs; ESPN: league slugs like "esp.1") — each
 * provider resolves the key to whatever it needs internally.
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
  getStandings(competition: CompetitionKey): Promise<StandingRow[] | null>;
  getTopScorers(competition: CompetitionKey): Promise<ScorerStat[] | null>;
  getTopAssists(competition: CompetitionKey): Promise<AssistStat[] | null>;
  getBestRatedPlayers(competition: CompetitionKey): Promise<RatedPlayer[] | null>;
}
