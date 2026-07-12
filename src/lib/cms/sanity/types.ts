import type { SanityImageSource } from "@sanity/image-url";
import type { ArticleCategory } from "@/types/content";
import type { PlayerPosition, TransferDirection, TransferStatus } from "@/types/football";

export type SanityImageWithAlt = SanityImageSource & { alt?: string };

export interface SanityArticle {
  slug: string;
  title: string;
  dek: string;
  category: ArticleCategory;
  tags?: string[];
  isExclusive?: boolean;
  mainImage: SanityImageWithAlt;
  author: { name: string; slug: string };
  publishedAt: string;
  readingTime?: string;
  body: unknown[];
}

export interface SanitySponsor {
  name: string;
  tag: string;
  logo?: SanityImageSource;
  website?: string;
}

export interface SanityWireItem {
  text: string;
  publishedAt: string;
}

export interface SanityPlayer {
  id: string;
  name: string;
  number: string;
  role: string;
  position: PlayerPosition;
  image: SanityImageWithAlt;
  nationality?: string;
  bio?: string;
}

export interface SanityTransferDeal {
  id: string;
  player: string;
  position: string;
  direction: TransferDirection;
  status: TransferStatus;
  fee: string;
  latest: string;
}

export interface SanityRumour {
  id: string;
  source: string;
  tier: "TIER 1" | "TIER 2" | "TIER 3";
  text: string;
  publishedAt: string;
}

export interface SanityNextMatch {
  opponent: string;
  competition: string;
  matchDate: string;
  kickOff?: string;
  venue?: string;
  isHome?: boolean;
}

export interface SanityFixture {
  id: string;
  opponent: string;
  competition: string;
  matchDate: string;
}

export interface SanityMatchResult {
  id: string;
  match: string;
  competition: string;
  outcome: "W" | "D" | "L";
}

export interface SanityLeagueTable {
  heading: string;
  rows: { position: number; team: string; points: number; isHighlighted?: boolean }[];
}

export interface SanitySeasonStats {
  statTiles?: { value: string; label: string; sub?: string }[];
  topScorers?: { name: string; goals: number }[];
  topAssists?: { name: string; assists: number }[];
  goalkeeping?: { label: string; value: string }[];
  homeStats?: { label: string; player: string; value: string; barPercent: number }[];
}

export interface SanityLegalPage {
  pageType: "privacy" | "terms" | "cookies";
  updatedAt: string;
  sections: { heading: string; body: string }[];
}

export interface SanitySiteSettings {
  followerCount?: string;
  monthlyReach?: string;
  tickerEnabled?: boolean;
  transferWindowClosesText?: string;
  editorialEmail?: string;
  partnersEmail?: string;
  pressEmail?: string;
  socialLinks?: { x?: string; facebook?: string; instagram?: string; youtube?: string; tiktok?: string };
  newsletterHeading?: string;
  newsletterBody?: string;
}

export interface SanityAdSlot {
  enabled?: boolean;
  mode?: "placeholder" | "image" | "code";
  creative?: SanityImageWithAlt;
  linkUrl?: string;
  advertiserName?: string;
  adNetworkCode?: string;
  width?: number;
  height?: number;
}
