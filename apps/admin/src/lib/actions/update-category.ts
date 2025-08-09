"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

export async function updateCategory(
  userId: string,
  categoryId: string,
  data: any,
) {
  try {
    const category = await db.category.update({
      where: { id: categoryId, userId },
      data: {
        ...data,
      },
    });
    revalidatePath("/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Failed to update category" };
  }
}
