export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Compact relative time ("4h", "2d", "1w") for story metadata rows. */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.round(days / 7);
  return `${weeks}w`;
}

/** "21:40" from an ISO datetime — used for the live ticker. */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/**
 * Sanity's `date` type is a plain "YYYY-MM-DD" string with no time
 * component. Parsing it with `new Date(str)` treats it as UTC midnight,
 * which can shift a day in either direction depending on the reader's
 * timezone — so date-only strings are parsed as local-time components
 * instead.
 */
function parseCalendarDate(dateOnly: string): Date {
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** "Jul 26" from a "YYYY-MM-DD" date-only string. */
export function formatShortDate(dateOnly: string): string {
  return parseCalendarDate(dateOnly).toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

/** "Sat 26 Jul" from a "YYYY-MM-DD" date-only string. */
export function formatMatchDate(dateOnly: string): string {
  return parseCalendarDate(dateOnly).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
