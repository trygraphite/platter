"use server";

import { MenuItemVarietyInput } from "@/types";
import db from "@platter/db";
import { revalidatePath } from "next/cache";

export async function deleteMenuItem(userId: string, menuItemId: string) {
  try {
    // Delete menu item (varieties will be cascade deleted due to onDelete: Cascade in schema)
    await db.menuItem.delete({
      where: { id: menuItemId, userId },
    });
    
    revalidatePath("/menu-items");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete menu item:", error);
    return { success: false, error: "Failed to delete menu item" };
  }
}

// Additional helper functions for variety management

export async function createMenuItemVariety(
  userId: string,
  menuItemId: string,
  varietyData: Omit<MenuItemVarietyInput, 'id'>
) {
  try {
    // Check if this would create a duplicate default
    if (varietyData.isDefault) {
      await db.menuItemVariety.updateMany({
        where: { menuItemId, userId },
        data: { isDefault: false },
      });
    }

    const variety = await db.menuItemVariety.create({
      data: {
        ...varietyData,
        menuItemId,
        userId,
      },
    });

    revalidatePath("/menu-items");
    return { success: true, variety };
  } catch (error) {
    console.error("Failed to create variety:", error);
    return { success: false, error: "Failed to create variety" };
  }
}

