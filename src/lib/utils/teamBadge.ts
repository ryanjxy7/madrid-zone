/** Decorative circular-badge helpers for match/standings rows — not real crest data, just short codes derived from team names. */

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

/** "Opponent A" -> "OPA". Used for the small grey badge next to a fixture/result. */
export function deriveTeamBadge(name: string): string {
  const letters = name.replace(/[^a-zA-Z]/g, "").toUpperCase();
  return letters.slice(0, 3) || "OPP";
}

const KNOWN_TEAM_BADGES: Record<string, { badge: string; bg: string }> = {
  "real madrid": { badge: "RMA", bg: "#e0243e" },
  barcelona: { badge: "BAR", bg: "#a50044" },
  "fc barcelona": { badge: "BAR", bg: "#a50044" },
  "atlético": { badge: "ATM", bg: "#cb3524" },
  "atletico": { badge: "ATM", bg: "#cb3524" },
  "atlético madrid": { badge: "ATM", bg: "#cb3524" },
  "atletico madrid": { badge: "ATM", bg: "#cb3524" },
  "athletic club": { badge: "ATH", bg: "#ee2523" },
  "athletic bilbao": { badge: "ATH", bg: "#ee2523" },
};

/** Real crest colors for common La Liga/UCL sides; a neutral badge for anyone else. */
export function getTeamBadgeStyle(name: string): { badge: string; bg: string } {
  const known = KNOWN_TEAM_BADGES[name.toLowerCase()];
  if (known) return known;
  return { badge: deriveTeamBadge(name), bg: "#565d73" };
}
