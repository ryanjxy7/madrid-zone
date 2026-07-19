/** Opponent-name helpers for match/standings rows — real crest lookup lives in clubCrests.ts and src/lib/data/clubs.ts; this file is just string parsing. */

import { isRealMadrid } from "@/lib/utils/clubNames";

/**
 * `Fixture.opponent` is meant to be just the opponent's name ("Barcelona"),
 * but older/free-text Sanity content or a provider that hasn't been
 * updated might still send "Real Madrid vs Barcelona" or "vs Barcelona" —
 * strip either shape so every display site can trust it gets a bare name
 * back, regardless of where the data came from.
 */
export function opponentName(opponent: string): string {
  return opponent.replace(/^Real Madrid vs\s+/i, "").replace(/\s+vs Real Madrid$/i, "").replace(/^vs\s+/i, "");
}

/**
 * `MatchResult.match` is always a full scoreline sentence — "Real Madrid
 * 3–1 Barcelona" or "Barcelona 1–1 Real Madrid" — with no separate
 * opponent field. Strips the score and whichever side is "Real Madrid" to
 * recover just the opponent's name, so results can show a real club badge
 * instead of a generic "OPP" placeholder.
 */
export function extractOpponentFromResult(match: string): string {
  const [teamA, teamB] = match
    .replace(/\d+\s*[–—-]\s*\d+/, "|")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  if (!teamA) return "Opponent";
  // isRealMadrid (not a strict "=== 'real madrid'" check) so a result written as
  // "Real Madrid CF 3-1 ..." or any other suffix variant still gets recognised as
  // our own side — getting this wrong used to show Real Madrid's own crest in the
  // *opponent* slot too (the misidentified "opponent" name still fuzzy-matched
  // Real Madrid's crest), i.e. Real Madrid's badge twice with no opponent badge.
  return isRealMadrid(teamA) ? (teamB ?? "Opponent") : teamA;
}

/** "Opponent A" -> "OPA". Used for the small grey badge next to a fixture/result when there's no crest image (real or bundled) for a club. */
export function deriveTeamBadge(name: string): string {
  const letters = name.replace(/[^a-zA-Z]/g, "").toUpperCase();
  return letters.slice(0, 3) || "OPP";
}
