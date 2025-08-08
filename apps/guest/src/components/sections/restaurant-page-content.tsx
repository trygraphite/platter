import { RestaurantInfo } from "./restaurant-info";
import { RestaurantLanding } from "./restaurant-landing";
import { RestaurantMenu } from "./restaurant-menu";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  popular?: boolean;
  varieties?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface RestaurantMenuData {
  categories: MenuCategory[];
}

interface RestaurantPageContentProps {
  restaurantDetails: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    icon: string | null;
    cuisine: string | null;
    openingHours: string | null;
    closingHours: string | null;
    googleReviewLink: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    phone: string | null;
    website: string | null;
  };
  menuData: RestaurantMenuData;
}

export function RestaurantPageContent({
  restaurantDetails,
  menuData,
}: RestaurantPageContentProps) {
  return (
    <section className="min-h-screen bg-gray-50">
      <RestaurantLanding restaurantDetails={restaurantDetails} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <RestaurantInfo restaurantDetails={restaurantDetails} />
          <RestaurantMenu
            restaurantDetails={restaurantDetails}
            data={menuData}
          />
        </div>
      </div>
    </section>
  );
}
