"use server";

import db from "@platter/db/index";
import { revalidatePath } from "next/cache";

export interface CreateServicePointFormData {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateServicePointResult {
  success?: boolean;
  error?: string;
  servicePoint?: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
  };
}

export async function createServicePoint(
  userId: string,
  data: CreateServicePointFormData,
): Promise<CreateServicePointResult> {
  try {
    // Validate restaurant exists
    const restaurant = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!restaurant) {
      return { error: "Restaurant not found" };
    }

    // Check if service point name already exists for this restaurant
    const existingServicePoint = await db.servicePoint.findFirst({
      where: {
        userId,
        name: data.name,
      },
    });

    if (existingServicePoint) {
      return { error: "Service point with this name already exists" };
    }

    // Create service point
    const servicePoint = await db.servicePoint.create({
      data: {
        name: data.name,
        description: data.description || null,
        isActive: data.isActive,
        userId,
      },
    });

    // Revalidate the service point management pages
    revalidatePath("/manage-service-point");
    revalidatePath("/create-service-point");

    return {
      success: true,
      servicePoint: {
        id: servicePoint.id,
        name: servicePoint.name,
        description: servicePoint.description,
        isActive: servicePoint.isActive,
      },
    };
  } catch (error) {
    console.error("Failed to create service point:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create service point",
    };
  }
}
