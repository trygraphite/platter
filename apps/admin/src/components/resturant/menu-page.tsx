"use client";

import RestaurantContent from "@/app/(app)/menu/MenuContext";
import { RestaurantProvider } from "@/context/resturant-context";

export default function RestaurantPage() {
  return (
    <RestaurantProvider>
      <RestaurantContent />
    </RestaurantProvider>
  );
}
