"use server";

import db from "@platter/db/index";

export interface ServicePoint {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

// Get all service points for a restaurant
export async function getServicePoints(
  restaurantId: string,
): Promise<ServicePoint[]> {
  try {
    const servicePoints = await db.servicePoint.findMany({
      where: {
        userId: restaurantId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return servicePoints;
  } catch (error) {
    console.error("Error fetching service points:", error);
    return [];
  }
}
