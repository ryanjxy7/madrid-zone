import Image from "next/image";
import { getClubBadges } from "@/lib/data/clubs";
import { getTeamBadgeStyle } from "@/lib/utils/teamBadge";

/**
 * A club's crest, everywhere one is shown — fixtures, results, standings,
 * transfer deals. Renders the real uploaded logo when a `name` is given
 * and a matching club exists in Studio; otherwise falls back to a
 * colored-initials circle (a real club's own color/shortcode via
 * getTeamBadgeStyle, or the given fallbackMark/fallbackColor for
 * non-club marks like a transfer deal's "FA"/"LOAN" badge).
 */
export async function ClubBadge({
  name,
  sizePx,
  fallbackMark,
  fallbackColor,
  className = "",
}: {
  name?: string;
  sizePx: number;
  fallbackMark?: string;
  fallbackColor?: string;
  className?: string;
}) {
  const clubs = await getClubBadges();
  const entry = name ? clubs.get(name.toLowerCase()) : undefined;
  const style = name ? getTeamBadgeStyle(name) : null;

  if (entry?.logoUrl) {
    return (
      <span
        className={`flex flex-none items-center justify-center overflow-hidden rounded-full bg-white ${className}`}
        style={{ width: sizePx, height: sizePx, filter: "drop-shadow(0 2px 3px rgba(0,0,0,.35))" }}
      >
        <Image src={entry.logoUrl} alt={name ?? ""} width={sizePx} height={sizePx} className="h-full w-full object-contain p-[12%]" />
      </span>
    );
  }

  return (
    <span
      className={`flex flex-none items-center justify-center rounded-full font-display font-bold text-white ${className}`}
      style={{
        width: sizePx,
        height: sizePx,
        background: entry?.color ?? style?.bg ?? fallbackColor ?? "#565d73",
        fontSize: Math.max(6, Math.round(sizePx * 0.3)),
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,.35))",
      }}
    >
      {fallbackMark ?? style?.badge ?? "?"}
    </span>
  );
}
