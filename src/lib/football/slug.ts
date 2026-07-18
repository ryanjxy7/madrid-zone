/** "Jude Bellingham" -> "jude-bellingham". Used for /players/[slug] URLs, both when the Sofascore provider builds a profile and when matching Sanity editorial content to it. */
export function slugifyPlayerName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Squad cards, scorer lists, etc. display abbreviated names ("J.
 * Bellingham"), but an editor uploading a photo in Studio will often type
 * a player's full name ("Jude Bellingham") instead — there's no reason
 * they should have to match the site's display convention exactly for a
 * photo to link up. Returns every slug this name could plausibly be
 * matched against: the name as typed, and — for a two-or-more-word name —
 * the "F. Last" abbreviated form the site actually displays. Use as the
 * set of keys to register a photo override under, or the set of keys to
 * probe when looking one up (both sides should use this, so either
 * convention matches the other regardless of which side typed which).
 */
export function playerNameSlugAliases(name: string): string[] {
  const trimmed = name.trim();
  const slugs = new Set([slugifyPlayerName(trimmed)]);

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const [first, ...rest] = words;
    const initial = Array.from(first)[0]; // Unicode-safe first character
    if (initial) {
      slugs.add(slugifyPlayerName(`${initial}. ${rest.join(" ")}`));
    }
  }

  return Array.from(slugs);
}
