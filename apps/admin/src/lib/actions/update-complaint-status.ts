"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import getServerSession from "@/lib/auth/server";

// Define the ComplaintStatus enum to match your schema
enum ComplaintStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CANCELLED = "CANCELLED",
}

// Create a validation schema for the input
const UpdateComplaintSchema = z.object({
  complaintId: z.string().uuid(),
  status: z.nativeEnum(ComplaintStatus),
});

type UpdateComplaintInput = z.infer<typeof UpdateComplaintSchema>;

export async function updateComplaintStatus(input: UpdateComplaintInput) {
  try {
    // Validate input data
    const validatedData = UpdateComplaintSchema.parse(input);

    // Get current session to verify user
    const session = await getServerSession();
    if (!session?.session?.userId) {
      return {
        success: false,
        error: "Unauthorized. You must be logged in to update complaints.",
      };
    }

    const userId = session.session.userId;

    // Verify the complaint belongs to the user
    const complaint = await db.complaint.findFirst({
      where: {
        id: validatedData.complaintId,
        userId: userId,
      },
    });

    if (!complaint) {
      return {
        success: false,
        error:
          "Complaint not found or you do not have permission to update it.",
      };
    }

    // Update the complaint status
    const updatedComplaint = await db.complaint.update({
      where: {
        id: validatedData.complaintId,
      },
      data: {
        status: validatedData.status,
        updatedAt: new Date(),
      },
    });

    // Revalidate the complaints page to reflect changes
    revalidatePath("/dashboard/feedback/complaints");

    return {
      success: true,
      message: `Complaint status updated to ${validatedData.status.toLowerCase().replace("_", " ")}.`,
      data: updatedComplaint,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input data.",
        details: error.errors,
      };
    }

    console.error("Error updating complaint status:", error);
    return {
      success: false,
      error: "Failed to update complaint status. Please try again.",
    };
  }
}
