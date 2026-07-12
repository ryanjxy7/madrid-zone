/**
 * Raw Sofascore response shapes. Unofficial, undocumented API — every
 * field here is optional-by-convention even where Sofascore usually sends
 * it, because there is no contract guaranteeing it stays that way. Mapping
 * functions in services/ must never assume a field exists.
 */

export interface SofascoreTeam {
  id: number;
  name: string;
  nameCode?: string;
  country?: { name?: string };
  venue?: { name?: string; city?: { name?: string } };
  manager?: { name?: string };
}

export interface SofascoreScore {
  current?: number;
  display?: number;
}

export interface SofascoreEventStatus {
  code?: number;
  description?: string;
  type?: "notstarted" | "inprogress" | "finished" | "postponed" | "canceled" | string;
}

export interface SofascoreTournament {
  id?: number;
  name?: string;
  uniqueTournament?: { id?: number; name?: string };
}

export interface SofascoreEvent {
  id: number;
  startTimestamp: number;
  status?: SofascoreEventStatus;
  homeTeam: SofascoreTeam;
  awayTeam: SofascoreTeam;
  homeScore?: SofascoreScore;
  awayScore?: SofascoreScore;
  tournament?: SofascoreTournament;
  venue?: { name?: string };
  roundInfo?: { round?: number };
  time?: { currentPeriodStartTimestamp?: number };
}

export interface SofascoreEventsResponse {
  events?: SofascoreEvent[];
}

export interface SofascoreSingleEventResponse {
  event?: SofascoreEvent;
}

export interface SofascoreIncident {
  incidentType?: "goal" | "card" | "substitution" | "period" | string;
  time?: number;
  addedTime?: number;
  text?: string;
  player?: { name?: string };
  playerIn?: { name?: string };
  playerOut?: { name?: string };
  assist1?: { name?: string };
  isHome?: boolean;
  incidentClass?: "yellow" | "red" | "yellowRed" | "regular" | "penalty" | "ownGoal" | string;
}

export interface SofascoreIncidentsResponse {
  incidents?: SofascoreIncident[];
}

export interface SofascoreStatisticItem {
  name?: string;
  home?: string;
  away?: string;
  homeValue?: number;
  awayValue?: number;
}

export interface SofascoreStatisticsGroup {
  groupName?: string;
  statisticsItems?: SofascoreStatisticItem[];
}

export interface SofascoreStatisticsPeriod {
  period?: string;
  groups?: SofascoreStatisticsGroup[];
}

export interface SofascoreStatisticsResponse {
  statistics?: SofascoreStatisticsPeriod[];
}

export interface SofascoreLineupPlayer {
  player?: {
    id?: number;
    name?: string;
    position?: string;
    jerseyNumber?: string;
    userCount?: number;
  };
  substitute?: boolean;
  position?: string;
  jerseyNumber?: string;
  statistics?: { rating?: number };
}

export interface SofascoreLineupSide {
  players?: SofascoreLineupPlayer[];
  formation?: string;
}

export interface SofascoreLineupsResponse {
  home?: SofascoreLineupSide;
  away?: SofascoreLineupSide;
}

export interface SofascoreSquadEntry {
  player?: {
    id?: number;
    name?: string;
    position?: string;
    jerseyNumber?: string;
    dateOfBirthTimestamp?: number;
    country?: { name?: string };
  };
}

export interface SofascoreSquadResponse {
  players?: SofascoreSquadEntry[];
}

export interface SofascorePlayerResponse {
  player?: {
    id?: number;
    name?: string;
    position?: string;
    jerseyNumber?: string;
    country?: { name?: string };
    dateOfBirthTimestamp?: number;
  };
}

export interface SofascorePlayerStatisticsResponse {
  statistics?: {
    appearances?: number;
    minutesPlayed?: number;
    goals?: number;
    goalAssist?: number;
    yellowCards?: number;
    redCards?: number;
    rating?: number;
  };
}

export interface SofascoreSeason {
  id: number;
  year?: string;
  name?: string;
}

export interface SofascoreSeasonsResponse {
  seasons?: SofascoreSeason[];
}

export interface SofascoreStandingsRow {
  position?: number;
  team?: { id?: number; name?: string };
  matches?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  points?: number;
}

export interface SofascoreStandingsGroup {
  rows?: SofascoreStandingsRow[];
}

export interface SofascoreStandingsResponse {
  standings?: SofascoreStandingsGroup[];
}

export interface SofascoreTopPlayerEntry {
  player?: { id?: number; name?: string };
  team?: { name?: string };
  statistics?: { goals?: number; goalAssist?: number; rating?: number };
}

export interface SofascoreTopPlayersResponse {
  topPlayers?: {
    goals?: SofascoreTopPlayerEntry[];
    goalAssist?: SofascoreTopPlayerEntry[];
    rating?: SofascoreTopPlayerEntry[];
  };
}
