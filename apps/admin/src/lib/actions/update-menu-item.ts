"use server";

import db from "@platter/db";
import type { MenuItem } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateMenuItem(
  userId: string,
  menuItemId: string,
  data: Partial<MenuItem>,
) {
  try {
    const menuItem = await db.menuItem.update({
      where: { id: menuItemId, userId },
      data: {
        ...data,
      },
    });
    revalidatePath("/menu-items");
    return { success: true, menuItem };
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return { success: false, error: "Failed to update menu item" };
  }
}
