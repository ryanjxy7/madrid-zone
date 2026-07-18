import type { AssistStat, Player, PlayerPosition, ScorerStat, SquadGroup } from "@/types/football";
import { placeholderImage } from "@/lib/utils/images";
import { apiFootballFetch, REAL_MADRID_TEAM_ID, REVALIDATE } from "./client";
import type { ApiFootballSquadPlayer, ApiFootballTopScorer } from "./types";

export async function fetchTopScorers(season: number): Promise<ScorerStat[] | null> {
  const data = await apiFootballFetch<ApiFootballTopScorer[]>(
    "/players/topscorers",
    { league: process.env.API_FOOTBALL_LEAGUE_ID ?? "140", season: String(season), team: REAL_MADRID_TEAM_ID },
    { revalidate: REVALIDATE.matchData }
  );
  if (!data || data.length === 0) return null;

  const top = data[0]?.statistics[0]?.goals.total ?? 1;
  return data.map((entry, index) => ({
    rank: index + 1,
    name: entry.player.name,
    goals: entry.statistics[0]?.goals.total ?? 0,
    barPercent: Math.round(((entry.statistics[0]?.goals.total ?? 0) / top) * 100),
    image: entry.player.photo ?? placeholderImage(entry.player.name, 80, 80),
  }));
}

export async function fetchTopAssists(season: number): Promise<AssistStat[] | null> {
  const data = await apiFootballFetch<ApiFootballTopScorer[]>(
    "/players/topassists",
    { league: process.env.API_FOOTBALL_LEAGUE_ID ?? "140", season: String(season), team: REAL_MADRID_TEAM_ID },
    { revalidate: REVALIDATE.matchData }
  );
  if (!data || data.length === 0) return null;

  return data.map((entry, index) => ({
    rank: index + 1,
    name: entry.player.name,
    assists: entry.statistics[0]?.goals.assists ?? 0,
    image: entry.player.photo ?? placeholderImage(entry.player.name, 80, 80),
  }));
}

/** API-Football's four broad position categories, mapped to ours ("Attacker" -> "Forward"). */
function mapPosition(apiPosition: string): PlayerPosition | null {
  switch (apiPosition) {
    case "Goalkeeper":
      return "Goalkeeper";
    case "Defender":
      return "Defender";
    case "Midfielder":
      return "Midfielder";
    case "Attacker":
      return "Forward";
    default:
      return null;
  }
}

const GROUP_ORDER: { position: PlayerPosition; label: string }[] = [
  { position: "Goalkeeper", label: "GOALKEEPERS" },
  { position: "Defender", label: "DEFENDERS" },
  { position: "Midfielder", label: "MIDFIELDERS" },
  { position: "Forward", label: "FORWARDS" },
];

/**
 * Live squad list. API-Football only gives broad position categories
 * (Goalkeeper/Defender/Midfielder/Attacker), not specific roles like
 * "Right-back" — `role` falls back to that broad category. For granular
 * roles, manage the squad in Sanity instead (it takes priority only when
 * API-Football isn't configured).
 */
export async function fetchSquad(season: number): Promise<SquadGroup[] | null> {
  const data = await apiFootballFetch<ApiFootballSquadPlayer[]>(
    "/players",
    { team: REAL_MADRID_TEAM_ID, season: String(season) },
    { revalidate: REVALIDATE.seasonData }
  );
  if (!data || data.length === 0) return null;

  const players: (Player & { position: PlayerPosition })[] = [];
  for (const entry of data) {
    const apiPosition = entry.statistics[0]?.games.position;
    const position = apiPosition ? mapPosition(apiPosition) : null;
    if (!position) continue;

    players.push({
      id: String(entry.player.id),
      number: entry.statistics[0]?.games.number ? String(entry.statistics[0].games.number) : "—",
      name: entry.player.name,
      role: position,
      position,
      image: entry.player.photo,
      nationality: entry.player.nationality,
    });
  }

  return GROUP_ORDER.map(({ position, label }) => ({
    label,
    players: players.filter((player) => player.position === position),
  })).filter((group) => group.players.length > 0);
}
