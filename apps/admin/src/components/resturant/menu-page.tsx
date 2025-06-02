"use client";

import MenuPage from "@/app/(app)/menu/MenuContext";
import { RestaurantProvider } from "@/context/resturant-context";

export default function RestaurantPage() {
  return (
    <RestaurantProvider>
      <MenuPage />
    </RestaurantProvider>
  );
}
