"use server";
import db from "@platter/db";
import { revalidatePath } from "next/cache";

interface CreateMenuItemData {
  name: string;
  description: string;
  price: number;
  image: string | null;
  categoryId: string;
  isAvailable?: boolean;
}

export async function createMenuItem(
  data: CreateMenuItemData, 
  varieties: { 
    name: string;
    description: string | null | undefined;
    price: number;
    position: number;
    isAvailable: boolean;
    isDefault: boolean;
  }[] = [], 
  userId: string
) {
  if (!data.categoryId || !userId) {
    throw new Error("Category ID and User ID are required");
  }

  try {
    // Validate data
    if (!data.name || !data.price) {
      throw new Error("Name and price are required");
    }

    // Ensure only one variety is marked as default
    if (varieties.length > 0) {
      const defaultVarieties = varieties.filter(v => v.isDefault);
      if (defaultVarieties.length > 1) {
        throw new Error("Only one variety can be marked as default");
      }
      // If no default is set, make the first one default
      if (defaultVarieties.length === 0 && varieties.length > 0 && varieties[0]) {
        varieties[0].isDefault = true;
      }
    }

    const menuItem = await db.menuItem.create({
      data: {
        name: data.name,
        description: data.description || "",
        price: data.price,
        image: data.image,
        isAvailable: data.isAvailable ?? true,
        category: {
          connect: { id: data.categoryId },
        },
        user: {
          connect: { id: userId },
        },
        // Create varieties if provided
        varieties: varieties.length > 0 ? {
          create: varieties.map(variety => ({
            name: variety.name,
            description: variety.description || null,
            price: variety.price,
            position: variety.position,
            isAvailable: variety.isAvailable,
            isDefault: variety.isDefault,
            userId: userId,
          }))
        } : undefined,
      },
      include: {
        varieties: true,
      },
    });

    console.log("Created menu item:", menuItem);
    revalidatePath("/menu-items");
    return { success: true, menuItem };
  } catch (error) {
    console.error("Failed to create menu item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create menu item",
    };
  }
}
