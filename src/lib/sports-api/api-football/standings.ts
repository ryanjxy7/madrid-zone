import type { StandingRow } from "@/types/football";
import { apiFootballFetch, LALIGA_LEAGUE_ID, REAL_MADRID_TEAM_ID, REVALIDATE } from "./client";
import type { ApiFootballStandingRow } from "./types";

export async function fetchStandings(season: number): Promise<StandingRow[] | null> {
  const data = await apiFootballFetch<Array<{ league: { standings: ApiFootballStandingRow[][] } }>>(
    "/standings",
    { league: LALIGA_LEAGUE_ID, season: String(season) },
    { revalidate: REVALIDATE.matchData }
  );
  const table = data?.[0]?.league.standings?.[0];
  if (!table) return null;

  return table.map((row) => ({
    position: row.rank,
    team: row.team.name,
    points: row.points,
    isHighlighted: row.team.id.toString() === REAL_MADRID_TEAM_ID,
  }));
}
