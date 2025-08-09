"use server";

import db from "@platter/db/index";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import getServerSession from "../auth/server";

// Define schema for validation
const DeleteQRCodeSchema = z.object({
  id: z.string().uuid(),
});

export async function deleteQRCode(formData: FormData | { id: string }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Extract and validate the ID
    const id =
      formData instanceof FormData
        ? formData.get("id")?.toString()
        : formData.id;

    const validatedFields = DeleteQRCodeSchema.safeParse({ id });

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid QR code ID",
      };
    }

    // Delete the QR code
    await db.qRCode.delete({
      where: {
        id: validatedFields.data.id,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/qr-codes");

    return {
      success: true,
      message: "QR code deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting QR code:", error);
    return {
      success: false,
      error: "Failed to delete QR code",
    };
  }
}
