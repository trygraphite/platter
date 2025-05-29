// Updated types/menu.ts

export interface RestaurantDetails {
  name: string;
  description: string | null;
  image: string | null;
  cuisine: string | null;
  openingHours: string | null;
  closingHours: string | null;
  googleReviewLink?: string;
}

export interface MenuItemVariety {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  position: number;
  isAvailable: boolean;
  isDefault: boolean;
  menuItemId: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  menuItems: MenuItem[];
  groupId?: string | null;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  isAvailable: boolean;
  categoryId: string;
  varieties?: MenuItemVariety[]; 
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedVariety?: MenuItemVariety; 
}

export interface CategoryGroup {
  id: string;
  name: string;
  description?: string | null;
  position?: number;
}