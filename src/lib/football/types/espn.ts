/**
 * Raw ESPN response shapes (site.api.espn.com — unofficial, undocumented).
 * Every field is optional-by-convention, same discipline as
 * types/sofascore.ts: there's no contract guaranteeing any of this stays
 * the same shape, so mapping functions in providers/espn.ts must never
 * assume a field exists.
 */

export interface EspnLogo {
  href?: string;
}

export interface EspnTeam {
  id: string;
  uid?: string;
  displayName?: string;
  name?: string;
  shortDisplayName?: string;
  abbreviation?: string;
  location?: string;
  logos?: EspnLogo[];
  logo?: string;
  venue?: { fullName?: string; address?: { country?: string } };
  coach?: { name?: string }[];
}

export interface EspnTeamResponse {
  team?: EspnTeam;
}

export interface EspnCompetitor {
  id?: string;
  homeAway?: "home" | "away";
  team?: EspnTeam;
  score?: string;
  winner?: boolean;
}

export interface EspnStatusType {
  id?: string;
  name?: string;
  state?: "pre" | "in" | "post" | string;
  completed?: boolean;
  description?: string;
  detail?: string;
  shortDetail?: string;
}

export interface EspnStatus {
  clock?: number;
  displayClock?: string;
  period?: number;
  type?: EspnStatusType;
}

export interface EspnCompetition {
  id?: string;
  date?: string;
  venue?: { fullName?: string };
  status?: EspnStatus;
  competitors?: EspnCompetitor[];
}

export interface EspnEvent {
  id: string;
  date?: string;
  name?: string;
  shortName?: string;
  competitions?: EspnCompetition[];
}

export interface EspnEventsResponse {
  events?: EspnEvent[];
}

export interface EspnAthleteRef {
  id?: string;
  displayName?: string;
  fullName?: string;
  jersey?: string;
  position?: { name?: string; abbreviation?: string };
  headshot?: { href?: string };
  citizenship?: string;
  birthPlace?: { country?: string };
  dateOfBirth?: string;
}

export interface EspnAthleteResponse {
  athlete?: EspnAthleteRef;
}

/** Roster responses are sometimes grouped by position, sometimes a flat list — handled defensively in the mapper. */
export interface EspnRosterGroup {
  position?: string;
  items?: EspnAthleteRef[];
}

export interface EspnRosterResponse {
  athletes?: (EspnRosterGroup | EspnAthleteRef)[];
}

export interface EspnKeyEvent {
  id?: string;
  type?: { id?: string; text?: string };
  text?: string;
  clock?: { displayValue?: string; value?: number };
  team?: { id?: string };
  athletesInvolved?: { displayName?: string }[];
}

export interface EspnRosterEntry {
  athlete?: EspnAthleteRef;
  position?: { abbreviation?: string };
  starter?: boolean;
  jersey?: string;
  stats?: { name?: string; value?: number }[];
}

export interface EspnTeamRoster {
  team?: EspnTeam;
  homeAway?: "home" | "away";
  formation?: string;
  roster?: EspnRosterEntry[];
}

export interface EspnBoxscoreStat {
  name?: string;
  label?: string;
  displayValue?: string;
}

export interface EspnBoxscoreTeam {
  team?: EspnTeam;
  homeAway?: "home" | "away";
  statistics?: EspnBoxscoreStat[];
}

export interface EspnSummaryResponse {
  header?: { competitions?: EspnCompetition[] };
  boxscore?: { teams?: EspnBoxscoreTeam[] };
  rosters?: EspnTeamRoster[];
  keyEvents?: EspnKeyEvent[];
}

export interface EspnStandingsStat {
  name?: string;
  abbreviation?: string;
  value?: number;
  displayValue?: string;
}

export interface EspnStandingsEntry {
  team?: EspnTeam;
  stats?: EspnStandingsStat[];
}

export interface EspnStandingsGroup {
  entries?: EspnStandingsEntry[];
}

export interface EspnStandingsResponse {
  standings?: EspnStandingsGroup;
  children?: { standings?: EspnStandingsGroup }[];
}
