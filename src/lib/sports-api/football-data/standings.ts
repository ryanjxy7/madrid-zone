import type { StandingRow } from "@/types/football";
import { footballDataFetch, LALIGA_COMPETITION_CODE, REAL_MADRID_TEAM_ID, REVALIDATE } from "./client";
import type { FootballDataStandingsResponse } from "./types";

export async function fetchStandings(competitionCode: string = LALIGA_COMPETITION_CODE): Promise<StandingRow[] | null> {
  const data = await footballDataFetch<FootballDataStandingsResponse>(
    `/competitions/${competitionCode}/standings`,
    {},
    { revalidate: REVALIDATE.matchData }
  );
  const table = data?.standings?.find((group) => group.type === "TOTAL")?.table;
  if (!table || table.length === 0) return null;

  return table.map((row) => ({
    position: row.position,
    team: row.team.name,
    points: row.points,
    isHighlighted: String(row.team.id) === REAL_MADRID_TEAM_ID,
  }));
}
