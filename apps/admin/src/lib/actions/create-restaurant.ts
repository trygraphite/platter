"use server";

import db from "@platter/db";
import session from "../auth/server";
import {
  type RestaurantDetailsData,
  restaurantDetailsSchema,
} from "../validations/auth";

type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function createRestaurantAction(
  data: RestaurantDetailsData,
  restaurantId: string,
): Promise<ActionResponse> {
  const isAllowed = session;
  if (!isAllowed) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  try {
    const validatedData = restaurantDetailsSchema.parse(data);
    await db.user.update({
      where: { id: restaurantId },
      data: {
        ...validatedData,
        seatingCapacity: Number(validatedData.seatingCapacity),
        subdomain: validatedData.name.toLowerCase().replace(/\s/g, "-"),
        hasCompletedOnboarding: true,
      },
    });

    return {
      success: true,
    };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to create restaurant",
    };
  }
}
