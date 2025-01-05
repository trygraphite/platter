import { Decimal } from "@prisma/client/runtime/library";
import db from "@platter/db";
import { revalidatePath } from "next/cache";

export async function updateMenuItem(
  userId: string,
  menuItemId: string,
  data: any,
) {
  try {
    const menuItem = await db.menuItem.update({
      where: { id: menuItemId, userId },
      data: {
        ...data,
        price: data.price ? data.price.toString() : undefined,
      },
    });
    revalidatePath("/menu-items");
    return { success: true, menuItem };
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return { success: false, error: "Failed to update menu item" };
  }
}
