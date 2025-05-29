"use server";

import { MenuItemVarietyInput } from "@/types";
import db from "@platter/db";
import type { MenuItem } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateMenuItem(
  userId: string,
  menuItemId: string,
  data: Partial<MenuItem>,
  varieties: MenuItemVarietyInput[] = [],
) {
  try {
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

    // Start a transaction to handle menu item and varieties update
    const result = await db.$transaction(async (tx: { menuItem: { update: (arg0: { where: { id: string; userId: string; }; data: { name?: string | undefined; id?: string | undefined; description?: string | undefined; price?: number | undefined; image?: string | null | undefined; position?: number | undefined; isAvailable?: boolean | undefined; hasVarieties?: boolean | undefined; createdAt?: Date | undefined; updatedAt?: Date | undefined; userId?: string | undefined; categoryId?: string | undefined; }; }) => any; }; menuItemVariety: { findMany: (arg0: { where: { menuItemId: string; userId: string; }; }) => any; deleteMany: (arg0: { where: { id: { in: any; }; userId: string; }; }) => any; update: (arg0: { where: { id: string | undefined; userId: string; }; data: { name: string; description: string | null | undefined; price: number; position: number; isAvailable: boolean; isDefault: boolean; }; }) => any; createMany: (arg0: { data: { name: string; description: string | null | undefined; price: number; position: number; isAvailable: boolean; isDefault: boolean; menuItemId: string; userId: string; }[]; }) => any; }; }) => {
      // Update the menu item
      const menuItem = await tx.menuItem.update({
        where: { id: menuItemId, userId },
        data: {
          ...data,
        },
      });

      // Handle varieties if provided
      if (varieties.length > 0) {
        // Get existing varieties
        const existingVarieties = await tx.menuItemVariety.findMany({
          where: { menuItemId, userId },
        });

        // Separate new and existing varieties
        const newVarieties = varieties.filter(v => !v.id);
        const updatingVarieties = varieties.filter(v => v.id);
        const updatingVarietyIds = updatingVarieties.map(v => v.id);

        // Delete varieties that are no longer in the list
        const varietiesToDelete = existingVarieties.filter(
          (          existing: { id: string | undefined; }) => !updatingVarietyIds.includes(existing.id)
        );

        if (varietiesToDelete.length > 0) {
          await tx.menuItemVariety.deleteMany({
            where: {
              id: { in: varietiesToDelete.map((v: { id: any; }) => v.id) },
              userId,
            },
          });
        }

        // Update existing varieties
        for (const variety of updatingVarieties) {
          await tx.menuItemVariety.update({
            where: {
              id: variety.id,
              userId,
            },
            data: {
              name: variety.name,
              description: variety.description,
              price: variety.price,
              position: variety.position,
              isAvailable: variety.isAvailable,
              isDefault: variety.isDefault,
            },
          });
        }

        // Create new varieties
        if (newVarieties.length > 0) {
          await tx.menuItemVariety.createMany({
            data: newVarieties.map(variety => ({
              name: variety.name,
              description: variety.description,
              price: variety.price,
              position: variety.position,
              isAvailable: variety.isAvailable,
              isDefault: variety.isDefault,
              menuItemId,
              userId,
            })),
          });
        }
      }

      return menuItem;
    });

    revalidatePath("/menu-items");
    return { success: true, menuItem: result };
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update menu item" 
    };
  }
}