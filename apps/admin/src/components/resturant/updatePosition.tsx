"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

// Updates the position of a category
export async function updateCategoryPosition(
  userId: string,
  categoryId: string,
  direction: "up" | "down",
) {
  try {
    // Get the current category
    const currentCategory = await db.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!currentCategory) {
      return { success: false, error: "Category not found" };
    }

    // Find the adjacent category (either above or below based on direction)
    const adjacentCategory = await db.category.findFirst({
      where: {
        userId,
        groupId: currentCategory.groupId, // Consider the group context
        position:
          direction === "up"
            ? { lt: currentCategory.position }
            : { gt: currentCategory.position },
      },
      orderBy: {
        position: direction === "up" ? "desc" : "asc",
      },
    });

    // If no adjacent category found, we can't move further
    if (!adjacentCategory) {
      return { success: false, error: `Cannot move ${direction}` };
    }

    // Swap positions
    await db.$transaction([
      db.category.update({
        where: { id: currentCategory.id },
        data: { position: adjacentCategory.position },
      }),
      db.category.update({
        where: { id: adjacentCategory.id },
        data: { position: currentCategory.position },
      }),
    ]);

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error(`Failed to update category position:`, error);
    return { success: false, error: "Failed to update category position" };
  }
}

// Updates the position of a menu item
export async function updateMenuItemPosition(
  userId: string,
  menuItemId: string,
  direction: "up" | "down",
) {
  try {
    // Get the current menu item
    const currentMenuItem = await db.menuItem.findFirst({
      where: { id: menuItemId },
      include: { category: true }, // Include category to verify user ownership
    });

    if (!currentMenuItem || currentMenuItem.category.userId !== userId) {
      return { success: false, error: "Menu item not found or access denied" };
    }

    // Find the adjacent menu item within the same category
    const adjacentMenuItem = await db.menuItem.findFirst({
      where: {
        categoryId: currentMenuItem.categoryId,
        position:
          direction === "up"
            ? { lt: currentMenuItem.position }
            : { gt: currentMenuItem.position },
      },
      orderBy: {
        position: direction === "up" ? "desc" : "asc",
      },
    });

    // If no adjacent menu item found, we can't move further
    if (!adjacentMenuItem) {
      return { success: false, error: `Cannot move ${direction}` };
    }

    // Swap positions
    await db.$transaction([
      db.menuItem.update({
        where: { id: currentMenuItem.id },
        data: { position: adjacentMenuItem.position },
      }),
      db.menuItem.update({
        where: { id: adjacentMenuItem.id },
        data: { position: currentMenuItem.position },
      }),
    ]);

    revalidatePath("/menu-items");
    return { success: true };
  } catch (error) {
    console.error(`Failed to update menu item position:`, error);
    return { success: false, error: "Failed to update menu item position" };
  }
}

// Updates the position of a category group
export async function updateCategoryGroupPosition(
  userId: string,
  groupId: string,
  direction: "up" | "down",
) {
  try {
    // Get the current group
    const currentGroup = await db.categoryGroup.findFirst({
      where: { id: groupId, userId },
    });

    if (!currentGroup) {
      return { success: false, error: "Category group not found" };
    }

    // Find the adjacent group
    const adjacentGroup = await db.categoryGroup.findFirst({
      where: {
        userId,
        position:
          direction === "up"
            ? { lt: currentGroup.position }
            : { gt: currentGroup.position },
      },
      orderBy: {
        position: direction === "up" ? "desc" : "asc",
      },
    });

    // If no adjacent group found, we can't move further
    if (!adjacentGroup) {
      return { success: false, error: `Cannot move ${direction}` };
    }

    // Swap positions
    await db.$transaction([
      db.categoryGroup.update({
        where: { id: currentGroup.id },
        data: { position: adjacentGroup.position },
      }),
      db.categoryGroup.update({
        where: { id: adjacentGroup.id },
        data: { position: currentGroup.position },
      }),
    ]);

    revalidatePath("/category-groups");
    return { success: true };
  } catch (error) {
    console.error(`Failed to update category group position:`, error);
    return {
      success: false,
      error: "Failed to update category group position",
    };
  }
}
