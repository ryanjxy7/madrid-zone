/**
 * Tolerant club-name matching, shared by every place that has to decide
 * "is this the same club" — the crest lookup (Studio-uploaded and
 * bundled), and recognising Real Madrid's own side in a result sentence.
 * Editors (and API data) don't always write the exact same string for a
 * club — "Real Sociedad" vs "Real Sociedad de Fútbol", "Real Madrid" vs
 * "Real Madrid CF", "Barcelona" vs "FC Barcelona", "Atlético Madrid" vs
 * "Atlético de Madrid" — so an exact case-insensitive match is too
 * strict: it was the actual cause of a bug where a result written with
 * any "Real Madrid ..." variant got treated as the *opponent* (since it
 * didn't match "real madrid" exactly), which then went on to fuzzy-match
 * Real Madrid's own crest — showing Real Madrid's badge twice instead of
 * Real Madrid + the actual opponent.
 */

/** Generic words that appear in official club names but don't distinguish one club from another. */
const CLUB_STOPWORDS = new Set(["fc", "cf", "cd", "ac", "afc", "de", "club", "futbol", "sad"]);

function coreWords(name: string): Set<string> {
  const words = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents: Atlético -> Atletico
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // strip punctuation: "Real Madrid C.F." -> "real madrid c f"
    .split(/\s+/)
    .filter(Boolean);
  return new Set(words.filter((word) => !CLUB_STOPWORDS.has(word)));
}

/**
 * True if the two names' core words (accents/punctuation/generic
 * "FC"/"CF"/"de"-type words stripped) are a subset of one another —
 * "Real Sociedad" ⊆ "Real Sociedad de Fútbol", "Barcelona" ⊆ "FC
 * Barcelona", "Atlético Madrid" == "Atlético de Madrid" — but "Barcelona"
 * is not a subset of "Real Sociedad".
 */
export function clubNamesMatch(a: string, b: string): boolean {
  const wordsA = coreWords(a);
  const wordsB = coreWords(b);
  if (wordsA.size === 0 || wordsB.size === 0) return false;
  const [smaller, larger] = wordsA.size <= wordsB.size ? [wordsA, wordsB] : [wordsB, wordsA];
  for (const word of smaller) {
    if (!larger.has(word)) return false;
  }
  return true;
}

/** True if `name` refers to Real Madrid itself, tolerating suffix/particle variants ("Real Madrid CF", "Real Madrid Club de Fútbol", ...). */
export function isRealMadrid(name: string): boolean {
  return clubNamesMatch(name, "Real Madrid");
}
