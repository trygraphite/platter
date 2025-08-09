/**
 * Format a number as Nara currency with commas after every thousand
 * @param amount - Amount in kobo (smallest currency unit)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | undefined | null): string {
  // Handle undefined, null, or NaN values
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    return "₦0";
  }

  const naraAmount = amount;

  // Format with commas after every thousand
  const formattedAmount = naraAmount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `₦${formattedAmount}`;
}

/**
 * Format a date to a readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleString();
}
