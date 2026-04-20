/**
 * Given a float rating (0–5), returns an object describing the star breakdown.
 *
 * e.g. getRatingStars(3.7) →
 *   { full: 3, half: 1, empty: 1, display: "3.7" }
 */
export function getRatingStars(rating: number): {
  full: number;
  half: number;
  empty: number;
  display: string;
} {
  const clamped = Math.max(0, Math.min(5, rating));
  const full = Math.floor(clamped);
  const half = clamped - full >= 0.25 && clamped - full < 0.75 ? 1 : 0;
  const roundedFull = clamped - full >= 0.75 ? full + 1 : full;
  const empty = 5 - roundedFull - half;

  return {
    full: roundedFull,
    half,
    empty: Math.max(0, empty),
    display: clamped.toFixed(1),
  };
}

/**
 * Returns a star string for quick text rendering.
 * e.g. getStarString(3.7) → "★★★½☆"
 */
export function getStarString(rating: number): string {
  const { full, half, empty } = getRatingStars(rating);
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

/**
 * Returns a label for a rating value.
 * e.g. getRatingLabel(4.5) → "Excellent"
 */
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 3.5) return "Good";
  if (rating >= 2.5) return "Average";
  if (rating >= 1.5) return "Poor";
  return "Terrible";
}