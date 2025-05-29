import Image from "next/image";

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
  
  // Image component with loading state
  export function OptimizedMenuItemImage({ 
    src, 
    alt, 
    isAvailable 
  }: { 
    src: string; 
    alt: string; 
    isAvailable: boolean; 
  }) {
    return (
      <div className="relative w-full md:w-28 h-28 bg-gray-200 rounded-md overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 112px"
          className={`object-cover transition-opacity duration-200 ${!isAvailable ? 'opacity-60' : ''}`}
          priority={false} // Set to true for above-the-fold images if needed
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli5VVaHUcaMlaNjs0vkyD/Z/jfI4i9OPlrQ=="
        />
      </div>
    );
  }
  
  // Loading placeholder component
  export function ImageLoadingPlaceholder() {
    return (
      <div className="w-full md:w-28 h-28 bg-gray-200 rounded-md animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
      </div>
    );
  }
  
  // No image placeholder
  export function NoImagePlaceholder() {
    return (
      <div className="w-28 h-28 bg-gray-200 rounded-md flex items-center justify-center">
        <span className="text-gray-400">No image</span>
      </div>
    );
  }
  