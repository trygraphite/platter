"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

interface CreateOrderParams {
  userId: string;
  orderType: "TABLE" | "PICKUP";
  tableId: string | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  totalAmount: number;
}

export async function createOrder({
  userId,
  orderType,
  tableId,
  items,
  totalAmount,
}: CreateOrderParams) {
  try {
    // Get the start of the current day (12 AM)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch the latest orderNumber for today
    const lastOrder = await db.order.findFirst({
      where: {
        createdAt: { gte: today },
        userId,
      },
      orderBy: { orderNumber: "desc" },
    });

    const orderNumber = lastOrder?.orderNumber ? lastOrder.orderNumber + 1 : 1;

    // Create the order with proper type
    const order = await db.order.create({
      data: {
        status: "PENDING",
        orderNumber,
        totalAmount,
        orderType,
        userId,
        tableId,
        items: {
          create: items.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    revalidatePath('/orders');
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function updateOrder(order: any) {
  const updatedOrder = await db.order.update({
    where: { id: order.id },
    data: {
      status: order.status,
      tableId: order.tableId,
      specialNotes: order.specialNotes,
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  return updatedOrder;
}

export async function deleteOrder(orderId: string) {
  await db.order.delete({
    where: { id: orderId },
  });
}
