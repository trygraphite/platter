import db from "@platter/db/index";
import type { MenuItemVariety } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { MenuItemVarietyInput } from "@/types";

export async function createMenuItemVariety(
  userId: string,
  menuItemId: string,
  varietyData: Partial<MenuItemVariety>,
) {
  try {
    // Verify the menu item belongs to the user
    const menuItem = await db.menuItem.findFirst({
      where: {
        id: menuItemId,
        userId: userId,
      },
    });

    if (!menuItem) {
      throw new Error("Menu item not found or unauthorized");
    }

    // Get the next position
    const lastVariety = await db.menuItemVariety.findFirst({
      where: { menuItemId },
      orderBy: { position: "desc" },
    });

    const variety = await db.menuItemVariety.create({
      data: {
        name: varietyData.name!,
        description: varietyData.description,
        price: varietyData.price!,
        position: (lastVariety?.position ?? -1) + 1,
        isAvailable: varietyData.isAvailable ?? true,
        isDefault: varietyData.isDefault ?? false,
        menuItemId,
        userId,
      },
    });

    // Update the menu item to indicate it has varieties
    await db.menuItem.update({
      where: { id: menuItemId },
      data: { hasVarieties: true },
    });

    // If this is marked as default, unmark others
    if (varietyData.isDefault) {
      await db.menuItemVariety.updateMany({
        where: {
          menuItemId,
          id: { not: variety.id },
        },
        data: { isDefault: false },
      });
    }

    return variety;
  } catch (error) {
    console.error("Error creating menu item variety:", error);
    throw error;
  }
}

export async function updateMenuItemVariety(
  userId: string,
  varietyId: string,
  varietyData: Partial<MenuItemVarietyInput>,
) {
  try {
    // If setting as default, unset other defaults for the same menu item
    if (varietyData.isDefault) {
      const variety = await db.menuItemVariety.findFirst({
        where: { id: varietyId, userId },
      });

      if (variety) {
        await db.menuItemVariety.updateMany({
          where: { menuItemId: variety.menuItemId, userId },
          data: { isDefault: false },
        });
      }
    }

    const updatedVariety = await db.menuItemVariety.update({
      where: { id: varietyId, userId },
      data: varietyData,
    });

    revalidatePath("/menu-items");
    return { success: true, variety: updatedVariety };
  } catch (error) {
    console.error("Failed to update variety:", error);
    return { success: false, error: "Failed to update variety" };
  }
}

export async function deleteMenuItemVariety(userId: string, varietyId: string) {
  try {
    // Check if there are any order items using this variety
    const orderItemsCount = await db.orderItem.count({
      where: { varietyId },
    });

    if (orderItemsCount > 0) {
      // Soft delete: set deletedAt timestamp and mark as unavailable
      await db.menuItemVariety.update({
        where: { id: varietyId, userId },
        data: {
          deletedAt: new Date(),
          isAvailable: false,
        },
      });

      revalidatePath("/menu-items");
      return {
        success: true,
        message:
          "Variety has been archived because it has existing orders. It will no longer appear for new orders.",
      };
    }

    // If no order items exist, proceed with soft deletion anyway for consistency
    await db.menuItemVariety.update({
      where: { id: varietyId, userId },
      data: {
        deletedAt: new Date(),
        isAvailable: false,
      },
    });

    revalidatePath("/menu-items");
    return { success: true, message: "Variety deleted successfully." };
  } catch (error) {
    console.error("Failed to delete variety:", error);
    return { success: false, error: "Failed to delete variety" };
  }
}

export async function getMenuItemVarieties(userId: string, menuItemId: string) {
  try {
    const varieties = await db.menuItemVariety.findMany({
      where: {
        menuItemId,
        userId,
        deletedAt: null, // Only get non-deleted varieties
      },
      orderBy: { position: "asc" },
    });

    return varieties;
  } catch (error) {
    console.error("Error fetching menu item varieties:", error);
    throw error;
  }
}

export async function updateMenuItemVarietyPosition(
  userId: string,
  varietyId: string,
  direction: "up" | "down",
) {
  try {
    const variety = await db.menuItemVariety.findFirst({
      where: {
        id: varietyId,
        userId: userId,
      },
    });

    if (!variety) {
      throw new Error("Variety not found or unauthorized");
    }

    const currentPosition = variety.position;
    const newPosition =
      direction === "up" ? currentPosition - 1 : currentPosition + 1;

    // Find the variety to swap with
    const targetVariety = await db.menuItemVariety.findFirst({
      where: {
        menuItemId: variety.menuItemId,
        position: newPosition,
      },
    });

    if (!targetVariety) {
      return; // Can't move further in that direction
    }

    // Swap positions
    await db.$transaction([
      db.menuItemVariety.update({
        where: { id: varietyId },
        data: { position: newPosition },
      }),
      db.menuItemVariety.update({
        where: { id: targetVariety.id },
        data: { position: currentPosition },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error updating variety position:", error);
    throw error;
  }
}

// Helper function to get all varieties including deleted ones (for admin purposes)
export async function getAllMenuItemVarieties(
  userId: string,
  menuItemId: string,
) {
  try {
    const varieties = await db.menuItemVariety.findMany({
      where: {
        menuItemId,
        userId,
      },
      orderBy: { position: "asc" },
    });

    return varieties;
  } catch (error) {
    console.error("Error fetching all menu item varieties:", error);
    throw error;
  }
}
