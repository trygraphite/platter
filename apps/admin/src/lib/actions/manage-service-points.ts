"use server";

import db from "@platter/db/index";
import { revalidatePath } from "next/cache";

export interface ServicePointData {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    menuItems: number;
    staff: number;
  };
}

// Get all service points for a restaurant
export async function getServicePoints(
  userId: string,
): Promise<ServicePointData[]> {
  try {
    const servicePoints = await db.servicePoint.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            menuItems: true,
            staff: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return servicePoints;
  } catch (error) {
    console.error("Error fetching service points:", error);
    return [];
  }
}

// Update service point
export async function updateServicePoint(
  servicePointId: string,
  data: {
    name: string;
    description?: string;
    isActive: boolean;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if service point exists
    const existingServicePoint = await db.servicePoint.findUnique({
      where: { id: servicePointId },
    });

    if (!existingServicePoint) {
      return { success: false, error: "Service point not found" };
    }

    // Check if name already exists (excluding current service point)
    const duplicateName = await db.servicePoint.findFirst({
      where: {
        userId: existingServicePoint.userId,
        name: data.name,
        id: { not: servicePointId },
      },
    });

    if (duplicateName) {
      return {
        success: false,
        error: "Service point with this name already exists",
      };
    }

    // Update service point
    await db.servicePoint.update({
      where: { id: servicePointId },
      data: {
        name: data.name,
        description: data.description || null,
        isActive: data.isActive,
      },
    });

    revalidatePath("/manage-service-point");
    return { success: true };
  } catch (error) {
    console.error("Error updating service point:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update service point",
    };
  }
}

// Delete service point
export async function deleteServicePoint(
  servicePointId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if service point exists and has no associated menu items or staff
    const servicePoint = await db.servicePoint.findUnique({
      where: { id: servicePointId },
      include: {
        _count: {
          select: {
            menuItems: true,
            staff: true,
          },
        },
      },
    });

    if (!servicePoint) {
      return { success: false, error: "Service point not found" };
    }

    if (servicePoint._count.menuItems > 0) {
      return {
        success: false,
        error: "Cannot delete service point with assigned menu items",
      };
    }

    if (servicePoint._count.staff > 0) {
      return {
        success: false,
        error: "Cannot delete service point with assigned staff",
      };
    }

    // Delete service point
    await db.servicePoint.delete({
      where: { id: servicePointId },
    });

    revalidatePath("/manage-service-point");
    return { success: true };
  } catch (error) {
    console.error("Error deleting service point:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete service point",
    };
  }
}
