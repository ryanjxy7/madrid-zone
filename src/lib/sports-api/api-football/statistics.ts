import type { StatTile } from "@/types/football";
import { apiFootballFetch, LALIGA_LEAGUE_ID, REAL_MADRID_TEAM_ID, REVALIDATE } from "./client";
import type { ApiFootballTeamStatistics } from "./types";

/**
 * Three live stat tiles derived from API-Football's team-statistics
 * endpoint. Deliberately doesn't include a "Trophies" tile — that has no
 * clean live source (attributing a trophy count to "this season" isn't
 * something the API states directly) and stays an editorial figure in
 * Sanity/placeholder data instead.
 */
export async function fetchTeamStatistics(season: number): Promise<StatTile[] | null> {
  const data = await apiFootballFetch<ApiFootballTeamStatistics>(
    "/teams/statistics",
    { team: REAL_MADRID_TEAM_ID, league: LALIGA_LEAGUE_ID, season: String(season) },
    { revalidate: REVALIDATE.seasonData }
  );
  if (!data || !data.fixtures?.played?.total) return null;

  const played = data.fixtures.played.total;
  const wins = data.fixtures.wins.total;
  const draws = data.fixtures.draws.total;
  const losses = data.fixtures.loses.total;
  const winRate = played > 0 ? Math.round((wins / played) * 100) : 0;

  return [
    { value: String(played), label: "Matches played", sub: "All competitions" },
    {
      value: String(data.goals.for.total.total),
      label: "Goals scored",
      sub: `${data.goals.for.average.total} per match`,
    },
    { value: `${winRate}%`, label: "Win rate", sub: `${wins}W · ${draws}D · ${losses}L` },
  ];
}
