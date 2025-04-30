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