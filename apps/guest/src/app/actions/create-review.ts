"use server"

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ReviewResponse = {
  success: boolean;
  data?: any;
  error?: string;
}

export async function createReview(
  userId: string, 
  qrId: string, 
  tableId: string, 
  rating: number, 
  comment: string
): Promise<ReviewResponse> {
  try {
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        user: { connect: { id: userId } },
        qrCode: { connect: { id: qrId } },
        table: { connect: { id: tableId } },
      },
    });

    return {
      success: true,
      data: review
    };
    
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      error: "Failed to create review"
    };
  }
}