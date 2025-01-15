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
    if (!qrCode) {
      throw new Error("QR code not found");
    }

    // Generate order number (you might want to customize this)
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

    // Create the order
    const order = await db.order.create({
      data: {
        status: "PENDING",
        orderNumber,
        totalAmount,
        userId: qrCode.userId,
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
