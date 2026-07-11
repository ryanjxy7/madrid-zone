import type { Rumour, TransferDeal } from "@/types/football";

export const placeholderDeals: TransferDeal[] = [
  { id: "deal-1", player: "Goalkeeper — Free agent", position: "GK · 28", direction: "IN", status: "CONFIRMED", fee: "Free", latest: "Announced Tuesday. Presentation at Valdebebas complete." },
  { id: "deal-2", player: "Midfield anchor", position: "CM · 24", direction: "IN", status: "ADVANCED", fee: "€80m + add-ons", latest: "Medical pencilled for Friday. Five-year framework agreed." },
  { id: "deal-3", player: "Teenage winger", position: "RW · 18", direction: "IN", status: "MEDICAL", fee: "€34m", latest: "Arrives in Madrid tonight ahead of Friday unveiling." },
  { id: "deal-4", player: "Right winger", position: "RW · 25", direction: "OUT", status: "TALKS", fee: "Loan + option", latest: "Two Premier League clubs in contact. Player undecided." },
  { id: "deal-5", player: "Backup left-back", position: "LB · 30", direction: "OUT", status: "AGREED", fee: "€12m", latest: "Personal terms done. Announcement expected this weekend." },
  { id: "deal-6", player: "Castilla striker", position: "ST · 20", direction: "LOAN", status: "RUMOUR", fee: "—", latest: "Several LaLiga sides monitoring. Club prefers development loan." },
];

export const placeholderRumours: Rumour[] = [
  { id: "rumour-1", source: "MZ SOURCES", tier: "TIER 1", text: "Left-back scouting shortlist narrowed to two names", time: "3h ago" },
  { id: "rumour-2", source: "SPANISH PRESS", tier: "TIER 2", text: "Interest in Serie A centre-back is “real but early”", time: "7h ago" },
  { id: "rumour-3", source: "AGGREGATED", tier: "TIER 3", text: "Striker exit talk dismissed by player camp", time: "1d ago" },
];
