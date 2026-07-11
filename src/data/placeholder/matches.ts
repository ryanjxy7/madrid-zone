import type { Fixture, MatchResult, StandingRow } from "@/types/football";

export const placeholderNextMatch: Fixture = {
  id: "next-1",
  opponent: "Opponent A",
  competition: "Pre-season · US Summer Tour",
  date: "Sat 26 Jul",
  kickOff: "02:30 CET",
  venue: "Soldier Field, Chicago",
  isHome: false,
};

export const placeholderUpcoming: Fixture[] = [
  { id: "up-1", opponent: "Real Madrid vs Opponent A", competition: "US Tour · Chicago", date: "Jul 26" },
  { id: "up-2", opponent: "Real Madrid vs Opponent B", competition: "US Tour · Miami", date: "Jul 30" },
  { id: "up-3", opponent: "Real Madrid vs Opponent C", competition: "US Tour · New York", date: "Aug 3" },
  { id: "up-4", opponent: "LaLiga Matchday 1", competition: "Opponent TBC · Bernabéu", date: "Aug 16" },
];

export const placeholderResults: MatchResult[] = [
  { id: "res-1", match: "Real Madrid 3–1 Opponent", competition: "CWC Semi-final", outcome: "W" },
  { id: "res-2", match: "Real Madrid 2–0 Opponent", competition: "CWC Quarter-final", outcome: "W" },
  { id: "res-3", match: "Opponent 1–1 Real Madrid", competition: "CWC Group", outcome: "D" },
  { id: "res-4", match: "Real Madrid 4–0 Opponent", competition: "CWC Group", outcome: "W" },
];

export const placeholderStandings: StandingRow[] = [
  { position: 1, team: "Real Madrid", points: 88, isHighlighted: true },
  { position: 2, team: "Barcelona", points: 85 },
  { position: 3, team: "Atlético", points: 76 },
  { position: 4, team: "Athletic Club", points: 71 },
];
