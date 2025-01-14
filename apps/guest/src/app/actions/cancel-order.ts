"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function cancelOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CONFIRMED
    ) {
      return {
        success: false,
        error: "Order cannot be cancelled at this stage",
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        cancelledAt: new Date(),
        // Reset other status timestamps
        confirmedAt: null,
        preparingAt: null,
        readyAt: null,
        deliveredAt: null,
        // Reset time metrics
        confirmationTime: null,
        preparationTime: null,
        deliveryTime: null,
        totalTime: null,
      },
    });

    revalidatePath(`/order-status/${orderId}`);
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { success: false, error: "Failed to cancel order" };
  }
}

