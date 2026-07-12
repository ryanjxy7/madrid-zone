import { placeholderNextMatch, placeholderResults, placeholderStandings, placeholderUpcoming } from "@/data/placeholder/matches";
import { isSanityConfigured, sanityFetch } from "@/lib/cms/sanity";
import { fixturesQuery, leagueTableQuery, nextMatchQuery, resultsQuery } from "@/lib/cms/sanity/queries";
import type { SanityFixture, SanityLeagueTable, SanityMatchResult, SanityNextMatch } from "@/lib/cms/sanity/types";
import { fetchRecentResults, fetchStandings, fetchUpcomingFixtures, getCurrentSeason, isApiFootballConfigured } from "@/lib/sports-api/api-football";
import { formatMatchDate, formatShortDate } from "@/lib/utils/format";
import type { Fixture, MatchResult, StandingRow } from "@/types/football";

export async function getNextMatch(): Promise<Fixture> {
  if (isApiFootballConfigured) {
    const upcoming = await fetchUpcomingFixtures(1);
    if (upcoming?.[0]) return upcoming[0];
  }
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityNextMatch>(nextMatchQuery);
    if (result) {
      return {
        id: "next-match",
        opponent: result.opponent,
        competition: result.competition,
        date: formatMatchDate(result.matchDate),
        kickOff: result.kickOff,
        venue: result.venue,
        isHome: result.isHome,
      };
    }
  }
  return placeholderNextMatch;
}

/** The full editorial fixture list (Matches page) — one list, edited once. */
export async function getUpcomingFixtures(): Promise<Fixture[]> {
  if (isApiFootballConfigured) {
    const upcoming = await fetchUpcomingFixtures(4);
    if (upcoming && upcoming.length > 0) return upcoming;
  }
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityFixture[]>(fixturesQuery);
    if (result && result.length > 0) {
      return result.map((f) => ({ id: f.id, opponent: f.opponent, competition: f.competition, date: formatShortDate(f.matchDate) }));
    }
  }
  return placeholderUpcoming;
}

/** A shorter cut of the same list for the homepage sidebar widget. */
export async function getFixtures(): Promise<Fixture[]> {
  const fixtures = await getUpcomingFixtures();
  return fixtures.slice(0, 3);
}

export async function getRecentResults(): Promise<MatchResult[]> {
  if (isApiFootballConfigured) {
    const results = await fetchRecentResults(4);
    if (results && results.length > 0) return results;
  }
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityMatchResult[]>(resultsQuery);
    if (result && result.length > 0) return result;
  }
  return placeholderResults;
}

export async function getStandings(): Promise<StandingRow[]> {
  if (isApiFootballConfigured) {
    const season = await getCurrentSeason();
    const standings = await fetchStandings(season);
    if (standings && standings.length > 0) return standings;
  }
  if (isSanityConfigured) {
    const result = await sanityFetch<SanityLeagueTable>(leagueTableQuery);
    if (result?.rows?.length) return result.rows;
  }
  return placeholderStandings;
}
