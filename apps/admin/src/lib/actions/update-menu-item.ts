"use server";

import type { MenuItemVarietyInput } from "@/types";
import db from "@platter/db";
import type { MenuItem, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface UpdateMenuItemData extends Partial<MenuItem> {
  servicePointId?: string | null;
}

export async function updateMenuItem(
  userId: string,
  menuItemId: string,
  data: UpdateMenuItemData,
  varieties: MenuItemVarietyInput[] = [],
) {
  try {
    // Ensure only one variety is marked as default
    if (varieties.length > 0) {
      const defaultVarieties = varieties.filter((v) => v.isDefault);
      if (defaultVarieties.length > 1) {
        throw new Error("Only one variety can be marked as default");
      }
      // If no default is set, make the first one default
      if (
        defaultVarieties.length === 0 &&
        varieties.length > 0 &&
        varieties[0]
      ) {
        varieties[0].isDefault = true;
      }
    }

    // Extract relation scalar IDs and omit fields Prisma disallows in checked updates
    const {
      servicePointId,
      categoryId: _categoryId,
      userId: _omitUserId,
      id: _omitId,
      ...menuItemData
    } = data;

    // Start a transaction to handle menu item and varieties update
    const result = await db.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Update the menu item
        const menuItem = await tx.menuItem.update({
          where: { id: menuItemId, userId },
          data: {
            ...menuItemData,
            // Handle service point assignment
            ...(servicePointId !== undefined && {
              servicePoint: servicePointId
                ? { connect: { id: servicePointId } }
                : { disconnect: true },
            }),
            // Handle category reassignment if provided as an ID
            ...(_categoryId !== undefined && _categoryId
              ? { category: { connect: { id: _categoryId } } }
              : {}),
          },
        });

        // Handle varieties if provided
        if (varieties.length > 0) {
          // Get existing varieties
          const existingVarieties = await tx.menuItemVariety.findMany({
            where: { menuItemId, userId },
          });

          // Separate new and existing varieties
          const newVarieties = varieties.filter((v) => !v.id);
          const updatingVarieties = varieties.filter((v) => v.id);
          const updatingVarietyIds = updatingVarieties.map((v) => v.id);

          // Delete varieties that are no longer in the list
          const varietiesToDelete = existingVarieties.filter(
            (existing) => !updatingVarietyIds.includes(existing.id),
          );

          if (varietiesToDelete.length > 0) {
            await tx.menuItemVariety.deleteMany({
              where: {
                id: { in: varietiesToDelete.map((v) => v.id) },
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
              data: newVarieties.map((variety) => ({
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
      },
    );

    revalidatePath("/menu");
    return { success: true, menuItem: result };
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update menu item",
    };
  }
}
