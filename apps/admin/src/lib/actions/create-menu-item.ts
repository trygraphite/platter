"use server";
import { Decimal } from "@prisma/client/runtime/library";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

interface CreateMenuItemData {
  name: string;
  description: string;
  price: number | string | Decimal;
  image: string | null;
  categoryId: string;
  isAvailable?: boolean;
}

export async function createMenuItem(data: CreateMenuItemData, userId: string) {
  if (!data.categoryId || !userId) {
    throw new Error("Category ID and User ID are required");
  }

  try {
    // Validate data
    if (!data.name || !data.price) {
      throw new Error("Name and price are required");
    }
    // Convert price to Decimal
    const price = new Decimal(data.price.toString());

    const menuItem = await db.menuItem.create({
      data: {
        name: data.name,
        description: data.description || "",
        price,
        image: data.image,
        isAvailable: data.isAvailable ?? true,
        category: {
          connect: { id: data.categoryId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    // Convert Decimal to number before returning
    const safeMenuItem = {
      ...menuItem,
      price: menuItem.price.toNumber(),
    };
    console.log("Created menu item:", safeMenuItem);
    revalidatePath("/menu-items");
    return { success: true, safeMenuItem };
  } catch (error) {
    console.error("Failed to create menu item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create menu item",
    };
  }
}
