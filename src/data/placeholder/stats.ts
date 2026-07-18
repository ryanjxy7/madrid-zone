import { placeholderImage } from "@/lib/utils/images";
import type { AssistStat, GoalkeepingStat, HomeStatRow, ScorerStat, StatTile } from "@/types/football";

export const placeholderStatTiles: StatTile[] = [
  { value: "58", label: "Matches played", sub: "All competitions" },
  { value: "131", label: "Goals scored", sub: "2.26 per match" },
  { value: "68%", label: "Win rate", sub: "39W · 11D · 8L" },
  { value: "2", label: "Trophies", sub: "LaLiga · Supercopa" },
];

export const placeholderScorers: ScorerStat[] = [
  { rank: 1, name: "K. Mbappé", goals: 38, barPercent: 100, image: placeholderImage("K. Mbappé", 80, 80) },
  { rank: 2, name: "Vinícius Jr", goals: 24, barPercent: 63, image: placeholderImage("Vinícius Jr", 80, 80) },
  { rank: 3, name: "J. Bellingham", goals: 17, barPercent: 45, image: placeholderImage("J. Bellingham", 80, 80) },
  { rank: 4, name: "Rodrygo", goals: 13, barPercent: 34, image: placeholderImage("Rodrygo", 80, 80) },
  { rank: 5, name: "F. Valverde", goals: 8, barPercent: 21, image: placeholderImage("F. Valverde", 80, 80) },
];

export const placeholderAssists: AssistStat[] = [
  { rank: 1, name: "Vinícius Jr", assists: 15, image: placeholderImage("Vinícius Jr", 80, 80) },
  { rank: 2, name: "J. Bellingham", assists: 12, image: placeholderImage("J. Bellingham", 80, 80) },
  { rank: 3, name: "K. Mbappé", assists: 10, image: placeholderImage("K. Mbappé", 80, 80) },
  { rank: 4, name: "A. Güler", assists: 9, image: placeholderImage("A. Güler", 80, 80) },
];

export const placeholderGoalkeeping: GoalkeepingStat[] = [
  { label: "Clean sheets — T. Courtois", value: "19" },
  { label: "Save percentage", value: "78%" },
];

/** Raw name/value pairs for the Stat Leaders widget's tabs — rank, bar %, and photo are computed in lib/data/stats.ts. */
export const placeholderAppearancesLeaders: { name: string; value: string }[] = [
  { name: "F. Valverde", value: "52" },
  { name: "J. Bellingham", value: "49" },
  { name: "K. Mbappé", value: "47" },
  { name: "Vinícius Jr", value: "46" },
  { name: "T. Courtois", value: "45" },
];

export const placeholderMinutesLeaders: { name: string; value: string }[] = [
  { name: "T. Courtois", value: "4,590" },
  { name: "F. Valverde", value: "4,410" },
  { name: "A. Rüdiger", value: "4,120" },
  { name: "J. Bellingham", value: "3,980" },
  { name: "K. Mbappé", value: "3,870" },
];

export const placeholderTopRatedLeaders: { name: string; value: string }[] = [
  { name: "K. Mbappé", value: "7.9" },
  { name: "Vinícius Jr", value: "7.7" },
  { name: "J. Bellingham", value: "7.6" },
  { name: "F. Valverde", value: "7.4" },
  { name: "T. Courtois", value: "7.3" },
];

export const placeholderHomeStats: HomeStatRow[] = [
  { label: "Most assists", player: "Vinícius Jr", value: "15", barPercent: 88 },
  { label: "Clean sheets", player: "T. Courtois", value: "19", barPercent: 76 },
  { label: "Most minutes", player: "F. Valverde", value: "4,410", barPercent: 96 },
  { label: "Top rated", player: "K. Mbappé", value: "7.9", barPercent: 79 },
];
