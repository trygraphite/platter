"use client";

import { RestaurantProvider } from "../context/resturant-context";
import RestaurantContent from "./MenuContext";

export default function RestaurantPage() {
  return (
    <RestaurantProvider>
      <RestaurantContent />
    </RestaurantProvider>
  );
}
