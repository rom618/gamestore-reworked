/**
 * Formats a raw integer price (stored as cents or whole dollars) to a
 * display string.
 *
 * Your Game model stores `price` as an `int`. Adjust the divisor below
 * depending on how your backend stores prices:
 *   - Whole dollars (e.g. 60  → "$60.00") → divide by 1
 *   - Cents        (e.g. 5999 → "$59.99") → divide by 100
 *
 * Current assumption: whole dollars.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(price);
}

/**
 * Formats a discount percentage for display.
 * e.g. 20 → "20% off"
 */
export function formatDiscount(percentageValue: number): string {
  return `${percentageValue}% off`;
}

/**
 * Applies a promotion code discount to a price and returns the discounted value.
 */
export function applyDiscount(price: number, percentageValue: number): number {
  return price * (1 - percentageValue / 100);
}