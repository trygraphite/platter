"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

export async function deleteCategory(userId: string, categoryId: string) {
  try {
    // Check if there are menu items in this category that have orders
    const menuItemsWithOrders = await db.menuItem.findMany({
      where: {
        categoryId,
        userId,
        orderItems: {
          some: {}
        }
      },
      select: { id: true, name: true }
    });

    if (menuItemsWithOrders.length > 0) {
      // Soft delete: set deletedAt timestamp and mark as inactive
      await db.category.update({
        where: { id: categoryId, userId },
        data: { 
          deletedAt: new Date(),
          isActive: false 
        }
      });
      
      revalidatePath("/categories");
      return { 
        success: true, 
        message: `Category has been archived because it contains menu items with existing orders. It will no longer appear for customers.` 
      };
    }

    // If no orders exist, proceed with soft deletion
    await db.category.update({
      where: { id: categoryId, userId },
      data: { 
        deletedAt: new Date(),
        isActive: false 
      }
    });
    
    revalidatePath("/categories");
    return { success: true, message: "Category deleted successfully." };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}