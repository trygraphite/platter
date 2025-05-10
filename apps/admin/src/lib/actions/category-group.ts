"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

export async function createCategoryGroup(userId: string, data: any) {
  try {
    const categoryGroup = await db.categoryGroup.create({
      data: {
        ...data,
        userId,
      },
    });
    revalidatePath("/categories");
    return { success: true, categoryGroup };
  } catch (error) {
    console.error("Failed to create category group:", error);
    return { success: false, error: "Failed to create category group" };
  }
}

export async function updateCategoryGroup(userId: string, groupId: string, data: any) {
  try {
    const categoryGroup = await db.categoryGroup.update({
      where: {
        id: groupId,
        userId, // Security check
      },
      data,
    });
    revalidatePath("/categories");
    return { success: true, categoryGroup };
  } catch (error) {
    console.error("Failed to update category group:", error);
    return { success: false, error: "Failed to update category group" };
  }
}

export async function deleteCategoryGroup(userId: string, groupId: string) {
  try {
    // Remove the group association from all categories
    await db.category.updateMany({
      where: {
        groupId,
        userId, // Security check
      },
      data: {
        groupId: null,
      },
    });

    // Delete the group
    const categoryGroup = await db.categoryGroup.delete({
      where: {
        id: groupId,
        userId, // Security check
      },
    });
    
    revalidatePath("/categories");
    return { success: true, categoryGroup };
  } catch (error) {
    console.error("Failed to delete category group:", error);
    return { success: false, error: "Failed to delete category group" };
  }
}

export async function assignCategoryToGroup(userId: string, categoryId: string, groupId: string | null) {
  try {
    const category = await db.category.update({
      where: {
        id: categoryId,
        userId, // Security check
      },
      data: {
        groupId,
      },
    });
    
    revalidatePath("/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Failed to assign category to group:", error);
    return { success: false, error: "Failed to assign category to group" };
  }
}