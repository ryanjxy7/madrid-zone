/** "Jude Bellingham" -> "jude-bellingham". Used for /players/[slug] URLs, both when the Sofascore provider builds a profile and when matching Sanity editorial content to it. */
export function slugifyPlayerName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
