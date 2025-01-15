export interface RestaurantDetails {
  name: string;
  description: string | null;
  image: string | null;
  cuisine: string | null;
  openingHours: string | null;
  closingHours: string | null;
}

export interface MenuCategory {
  id: string;
  name: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  isAvailable: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
