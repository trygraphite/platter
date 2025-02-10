"use client";

import { RestaurantProvider } from "@/app/(app)/context/resturant-context";
import RestaurantContent from "@/app/(app)/menu/MenuContext";

export default function RestaurantPage() {
  return (
    <RestaurantProvider>
      <RestaurantContent />
    </RestaurantProvider>
  );
}
