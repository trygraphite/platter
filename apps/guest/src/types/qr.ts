export interface RestaurantInfo {
  id: string;
  name: string;
  cuisine?: string | null;
  hours?: string;
  image?: string | null;
  icon?: string | null;
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
