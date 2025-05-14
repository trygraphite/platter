export interface RestaurantDetails {
  name: string;
  description: string | null;
  image: string | null;
  cuisine: string | null;
  openingHours: string | null;
  closingHours: string | null;
  googleReviewLink?: string

}

export interface MenuCategory {
  id: string;
  name: string;
  menuItems: MenuItem[];
  groupId?: string | null
  description?: string

}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  isAvailable: boolean;
  categoryId: string

}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface CategoryGroup {
  id: string
  name: string
  description?: string | null
  position?: number
}