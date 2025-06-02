import Image from "next/image";

interface FormatNairaOptions {
  showDecimals?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Convert UI-friendly status to enum value expected by the server
export const statusToEnum = (status: string): any => {
  switch (status.toLowerCase()) {
    case "in_progress":
      return "IN_PROGRESS";
    case "resolved":
      return "RESOLVED";
    case "cancelled":
      return "CANCELLED";
    default:
      return "PENDING";
  }
};

// Convert enum value to UI-friendly text
export const enumToStatus = (statusEnum: string): string => {
  switch (statusEnum) {
    case "IN_PROGRESS":
      return "In_Progress";
    case "RESOLVED":
      return "Resolved";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Pending";
  }
};

  // Helper function to get the badge color based on status
  export const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "outline";
      case "in_progress":
        return "secondary";
      case "resolved":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };
  
  
  export function formatNaira(
    amount: number | string, 
    options: FormatNairaOptions = {}
  ): string {
    const {
      showDecimals = false,
      minimumFractionDigits = 0,
      maximumFractionDigits = showDecimals ? 2 : 0
    } = options;
  
    // Convert to number if string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Handle invalid numbers
    if (isNaN(numAmount)) {
      return '₦0';
    }
  
    // Format with commas and decimal handling
    const formatted = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(numAmount);
  
    return `₦${formatted}`;
  }



  
  export function ImageLoadingPlaceholder() {
    return (
      <div
        className="w-full md:w-28 h-28 bg-gray-100 rounded-lg overflow-hidden relative"
        style={{ minHeight: '7rem', minWidth: '7rem' }} // Fallback for size issues
        data-testid="image-loading-placeholder" // For debugging
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer"
          style={{
            backgroundImage: 'linear-gradient(90deg, #f3f4f6, #e5e7eb, #f3f4f6)',
            backgroundSize: '200% 100%',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg
            className="w-10 h-10 text-gray-300 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading image"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }
  
  export function NoImagePlaceholder() {
    return (
      <div className="w-full md:w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-label="No image available"
        >
          <path 
            stroke="currentColor" 
            strokeWidth="2" 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="sr-only">No image available</span>
      </div>
    );
  }
  