interface FormatNairaOptions {
  showDecimals?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatNaira(
  amount: number | string,
  options: FormatNairaOptions = {},
): string {
  const {
    showDecimals = false,
    minimumFractionDigits = 0,
    maximumFractionDigits = showDecimals ? 2 : 0,
  } = options;

  // Convert to number if string
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  // Handle invalid numbers
  if (Number.isNaN(numAmount)) {
    return "₦0";
  }

  // Format with commas and decimal handling
  const formatted = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numAmount);

  return `₦${formatted}`;
}

// Convenience functions for common use cases
export const formatNairaWithDecimals = (amount: number | string) =>
  formatNaira(amount, { showDecimals: true });

export const formatNairaWholeNumbers = (amount: number | string) =>
  formatNaira(amount, { showDecimals: false });
