export interface PlayerLink {
  name: string;
  slug: string;
}

export type LinkifiedSegment = { type: "text"; text: string } | { type: "player"; text: string; slug: string };

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits plain text into segments, tagging any substring that matches a
 * known player's name (case-insensitive, whole-word) with that player's
 * slug so callers can render it as a link. Longest names are matched first
 * so "Vinícius Jr" wins over a bare "Vinícius", and matches never straddle
 * word boundaries (Unicode-aware, so accented names work correctly).
 */
export function linkifyPlayerNames(text: string, players: PlayerLink[]): LinkifiedSegment[] {
  const candidates = players.filter((player) => player.name.trim().length > 0).sort((a, b) => b.name.length - a.name.length);

  if (candidates.length === 0 || !text) {
    return [{ type: "text", text }];
  }

  const alternation = candidates.map((player) => escapeRegExp(player.name)).join("|");
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${alternation})(?![\\p{L}\\p{N}])`, "gui");

  const byLowerName = new Map(candidates.map((player) => [player.name.toLowerCase(), player.slug]));

  const segments: LinkifiedSegment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", text: text.slice(lastIndex, index) });
    }
    const slug = byLowerName.get(match[0].toLowerCase());
    if (slug) {
      segments.push({ type: "player", text: match[0], slug });
    } else {
      segments.push({ type: "text", text: match[0] });
    }
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", text: text.slice(lastIndex) });
  }
  return segments;
}

/** Whole-word, case-insensitive, Unicode-aware check for whether `text` mentions `name` — the same boundary rules linkifyPlayerNames uses, so "mentions this player" and "links this player" always agree. */
export function textMentionsName(text: string, name: string): boolean {
  if (!text || !name.trim()) return false;
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(name)}(?![\\p{L}\\p{N}])`, "ui");
  return pattern.test(text);
}

/**
 * Squad rosters display abbreviated names ("K. Mbappé", "Vinícius Jr") for
 * compact cards, but news prose almost always uses just the surname
 * ("Mbappé scored twice") or first name ("Vinícius picked out..."). Returns
 * the full display name plus a derived shorter alias so matching/linking
 * catches both styles: "X. Surname" -> "Surname"; anything else -> its
 * first word (covers mononyms like "Rodrygo"/"Endrick" as a no-op, and
 * "Vinícius Jr" -> "Vinícius").
 */
export function playerNameAliases(name: string): string[] {
  const trimmed = name.trim();
  const initialMatch = trimmed.match(/^\p{L}\.\s+(.+)$/u);
  const alias = initialMatch ? initialMatch[1] : trimmed.split(/\s+/)[0];
  return Array.from(new Set([trimmed, alias].filter((value) => value.length > 0)));
}
