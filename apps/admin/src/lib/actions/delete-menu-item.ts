"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

export async function deleteMenuItem(userId: string, menuItemId: string) {
  try {
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
