/**
 * Bundled crest images for the clubs that come up often enough to ship
 * with the site outright (public/crests/) — no CMS upload required.
 * Editors can still override any of these (or add crests for other
 * clubs) via the Clubs section in Studio; see getClubBadges(), which is
 * checked first and wins when both exist.
 */
const LOCAL_CRESTS: Record<string, string> = {
  "real madrid": "/crests/real-madrid.webp",
  barcelona: "/crests/barcelona.webp",
  "fc barcelona": "/crests/barcelona.webp",
  "atlético": "/crests/atletico.svg",
  atletico: "/crests/atletico.svg",
  "atlético madrid": "/crests/atletico.svg",
  "atletico madrid": "/crests/atletico.svg",
  "real betis": "/crests/betis.webp",
  betis: "/crests/betis.webp",
};

export function localCrestUrl(name: string): string | undefined {
  return LOCAL_CRESTS[name.toLowerCase()];
}
