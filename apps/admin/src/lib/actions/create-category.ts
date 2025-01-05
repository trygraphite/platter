"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

export async function createCategory(userId: string, data: any) {
  try {
    const category = await db.category.create({
      data: {
        ...data,
        userId,
      },
    });
    revalidatePath("/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category" };
  }
}
