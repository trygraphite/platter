// app/actions/reviews.ts
"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ReviewResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export async function orderReview(
  userId: string,
  qrId: string,
  tableId: string,
  rating: number,
  comment: string,
  orderId?: string, // Make orderId optional to keep backward compatibility
): Promise<ReviewResponse> {
  try {
    const reviewData: any = {
      rating,
      comment,
      user: { connect: { id: userId } },
      qrCode: { connect: { id: qrId } },
    };

    // Add tableId connection if provided
    if (tableId) {
      reviewData.table = { connect: { id: tableId } };
    }

    // Add orderId connection if provided
    if (orderId) {
      reviewData.order = { connect: { id: orderId } };

      // Also update the order to set shownReview to true
      await prisma.order.update({
        where: { id: orderId },
        data: { shownReview: true },
      });
    }

    const review = await prisma.review.create({
      data: reviewData,
    });

    return {
      success: true,
      data: review,
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      error: "Failed to create review",
    };
  }
}
