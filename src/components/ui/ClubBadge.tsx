import { findClubBadge, getClubBadges } from "@/lib/data/clubs";
import { localCrestUrl } from "@/lib/utils/clubCrests";
import { deriveTeamBadge } from "@/lib/utils/teamBadge";

/**
 * A club's crest, everywhere one is shown — next match, fixtures,
 * results, standings, transfer deals. Renders the real crest bare (no
 * circle clipping, no white backdrop) when one exists — a Studio upload
 * takes priority, falling back to the bundled crests in public/crests/
 * (see clubCrests.ts) — since several are shield-shaped, not round, and
 * clipping them to a circle cuts their corners off. Falls back to a
 * colored-initials circle (drawn with a radial-gradient, not
 * border-radius, so both badge types share the same drop-shadow
 * behaviour) only when neither a Studio nor a bundled crest exists.
 *
 * `sizePx` is the size from the 640px breakpoint up; `mobileSizePx`
 * (defaults to `sizePx`) is the size below it.
 */
export async function ClubBadge({
  name,
  sizePx,
  mobileSizePx,
  fallbackMark,
  fallbackColor,
  className = "",
}: {
  name?: string;
  sizePx: number;
  mobileSizePx?: number;
  fallbackMark?: string;
  fallbackColor?: string;
  className?: string;
}) {
  const clubs = await getClubBadges();
  const entry = name ? findClubBadge(name, clubs) : undefined;
  const crestUrl = entry?.logoUrl ?? (name ? localCrestUrl(name) : undefined);

  const sizeVars = {
    "--badge-mobile": `${mobileSizePx ?? sizePx}px`,
    "--badge-desktop": `${sizePx}px`,
  } as React.CSSProperties;

  if (crestUrl) {
    return (
      <span
        className={`club-badge-box flex-none ${className}`}
        style={{
          ...sizeVars,
          backgroundImage: `url(${crestUrl})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,.35))",
        }}
        role={name ? "img" : undefined}
        aria-label={name}
      />
    );
  }

  return (
    <span
      className={`club-badge-box flex flex-none items-center justify-center font-display font-bold text-white ${className}`}
      style={{
        ...sizeVars,
        background: `radial-gradient(circle closest-side, ${entry?.color ?? fallbackColor ?? "#565d73"} 98%, transparent 100%)`,
        fontSize: Math.max(6, Math.round(sizePx * 0.3)),
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,.35))",
      }}
    >
      {fallbackMark ?? (name ? deriveTeamBadge(name) : "?")}
    </span>
  );
}
