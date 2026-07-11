import type { SchemaTypeDefinition } from "sanity";
import { article } from "./article";
import { author } from "./author";
import { fixture } from "./fixture";
import { leagueTable } from "./leagueTable";
import { legalPage } from "./legalPage";
import { matchResult } from "./matchResult";
import { nextMatch } from "./nextMatch";
import { player } from "./player";
import { rumour } from "./rumour";
import { seasonStats } from "./seasonStats";
import { siteSettings } from "./siteSettings";
import { sponsor } from "./sponsor";
import { transferDeal } from "./transferDeal";
import { wireItem } from "./wireItem";

export const schemaTypes: SchemaTypeDefinition[] = [
  article,
  author,
  player,
  transferDeal,
  rumour,
  nextMatch,
  fixture,
  matchResult,
  leagueTable,
  seasonStats,
  sponsor,
  wireItem,
  legalPage,
  siteSettings,
];

/** Document types that should only ever have one instance in the dataset. */
export const singletonTypes = new Set(["siteSettings", "nextMatch", "leagueTable", "seasonStats"]);
