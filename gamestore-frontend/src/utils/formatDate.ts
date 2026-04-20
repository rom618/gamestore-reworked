/**
 * Formats an ISO date string to a human-readable date.
 * e.g. "2024-11-03T14:22:00" → "November 3, 2024"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Formats an ISO date string to a short date.
 * e.g. "2024-11-03T14:22:00" → "Nov 3, 2024"
 */
export function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Formats a card expiration date (ISO string or "YYYY-MM") to "MM/YY".
 * e.g. "2026-09-01" → "09/26"
 */
export function formatExpirationDate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "N/A";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

/**
 * Returns a relative time string.
 * e.g. "2 days ago", "just now", "3 months ago"
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Unknown date";

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMs = date.getTime() - Date.now();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  if (Math.abs(diffSecs) < 60) return rtf.format(diffSecs, "second");
  if (Math.abs(diffMins) < 60) return rtf.format(diffMins, "minute");
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month");
  return rtf.format(diffYears, "year");
}