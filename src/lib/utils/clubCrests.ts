import { clubNamesMatch } from "@/lib/utils/clubNames";

/**
 * Bundled crest images for the clubs that come up often enough to ship
 * with the site outright (public/crests/) — no CMS upload required.
 * Editors can still override any of these (or add crests for other
 * clubs) via the Clubs section in Studio; see getClubBadges(), which is
 * checked first and wins when both exist.
 *
 * Matched with clubNamesMatch, not an exact-string lookup, so name
 * variants ("Atlético Madrid" vs "Atlético de Madrid", "Barcelona" vs "FC
 * Barcelona") resolve to the same crest without needing a hand-maintained
 * alias per variant.
 */
const LOCAL_CRESTS: { name: string; url: string }[] = [
  { name: "Real Madrid", url: "/crests/real-madrid.webp" },
  { name: "Barcelona", url: "/crests/barcelona.webp" },
  { name: "Atlético Madrid", url: "/crests/atletico.svg" },
  { name: "Real Betis", url: "/crests/betis.webp" },
];

export function localCrestUrl(name: string): string | undefined {
  return LOCAL_CRESTS.find((crest) => clubNamesMatch(crest.name, name))?.url;
}
