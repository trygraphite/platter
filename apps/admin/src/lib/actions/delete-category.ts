"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

export async function deleteCategory(userId: string, categoryId: string) {
  try {
    await db.category.delete({
      where: { id: categoryId, userId },
    });
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
