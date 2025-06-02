"use server";

import { MenuItemVarietyInput } from "@/types";
import db from "@platter/db";
import { revalidatePath } from "next/cache";

export async function deleteMenuItem(userId: string, menuItemId: string) {
  try {
    // Check if there are any order items using this menu item
    const orderItemsCount = await db.orderItem.count({
      where: { menuItemId }
    });

    if (orderItemsCount > 0) {
      // Soft delete: set deletedAt timestamp and mark as unavailable
      await db.menuItem.update({
        where: { id: menuItemId, userId },
        data: { 
          deletedAt: new Date(),
          isAvailable: false 
        }
      });
      
      // Also soft delete all varieties of this menu item
      await db.menuItemVariety.updateMany({
        where: { 
          menuItemId,
          userId,
          deletedAt: null // Only update varieties that aren't already deleted
        },
        data: { 
          deletedAt: new Date(),
          isAvailable: false 
        }
      });
      
      revalidatePath("/menu-items");
      return { 
        success: true, 
        message: "Menu item has been archived because it has existing orders. It will no longer appear for customers." 
      };
    }

    // If no order items exist, proceed with soft deletion
    await db.menuItem.update({
      where: { id: menuItemId, userId },
      data: { 
        deletedAt: new Date(),
        isAvailable: false 
      }
    });
    
    // Also soft delete all varieties of this menu item
    await db.menuItemVariety.updateMany({
      where: { 
        menuItemId,
        userId,
        deletedAt: null // Only update varieties that aren't already deleted
      },
      data: { 
        deletedAt: new Date(),
        isAvailable: false 
      }
    });
    
    revalidatePath("/menu-items");
    return { success: true, message: "Menu item deleted successfully." };
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

