export interface RestaurantInfo {
  name: string;
  icon?: string;
  cuisine?: string;
  openingHours?: string;
  closingHours?: string;
  hours?: string; // For backward compatibility
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  googleReviewLink?: string;
  seatingCapacity?: number;
}

export interface Button {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export interface PageConfig {
  title: string;
  description: string;
  restaurantInfo: RestaurantInfo;
  buttons: Button[];
}
