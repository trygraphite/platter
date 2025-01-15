export interface RestaurantInfo {
  name: string;
  cuisine?: string | null;
  hours?: string;
  image?: string | null;
}

export interface PageConfig {
  title: string;
  description: string;
  restaurantInfo: RestaurantInfo;
  buttons: Array<{
    label: string;
    href: string;
    variant: "default" | "secondary" | "outline";
  }>;
}
