"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

interface CreateOrderParams {
  tableId: string;
  qrId: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  totalAmount: number;
}

export async function createOrder({
  tableId,
  qrId,
  items,
  totalAmount,
}: CreateOrderParams) {
  try {
    // Get restaurant ID from QR code
    const qrCode = await db.qRCode.findUnique({
      where: { id: qrId },
      select: { userId: true },
    });

    // Check if QR code exists and has a valid userId
    if (!qrCode?.userId) {
      throw new Error("QR code not found or not associated with a user");
    }

    // Get the start of the current day (12 AM)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch the latest orderNumber for today
    const lastOrder = await db.order.findFirst({
      where: {
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        orderNumber: "desc",
      },
    });

    // Determine the next orderNumber
    const orderNumber = lastOrder?.orderNumber ? lastOrder.orderNumber + 1 : 1;

    // Create the order with validated userId
    const order = await db.order.create({
      data: {
        status: "PENDING",
        orderNumber,
        totalAmount,
        userId: qrCode.userId, // Now guaranteed to be a string
        tableId,
        items: {
          create: items.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log(order);
    revalidatePath(`/${qrId}/order-status`);
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}