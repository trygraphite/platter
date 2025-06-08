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
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function updateOrder(order: any) {
  try {
    // Update in database
    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        status: order.status,
        tableId: order.tableId,
        specialNotes: order.specialNotes,
        // Add timestamp based on status
        // ...(order.status === 'CONFIRMED' ? { confirmedAt: new Date() } : {}),
        // ...(order.status === 'PREPARING' ? { preparingAt: new Date() } : {}),
        // ...(order.status === 'READY' ? { readyAt: new Date() } : {}),
        // ...(order.status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
        // ...(order.status === 'CANCELLED' ? { cancelledAt: new Date() } : {})
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        table: true,
        user: true,
      },
    });

    // Calculate metrics if status is DELIVERED
    // if (order.status === 'DELIVERED') {
    //   await db.order.update({
    //     where: { id: order.id },
    //     data: {
    //       confirmationTime: updatedOrder.confirmedAt
    //         ? Math.floor(
    //             (updatedOrder.confirmedAt.getTime() - updatedOrder.createdAt.getTime()) /
    //               60000,
    //           )
    //         : null,
    //       preparationTime:
    //         updatedOrder.readyAt && updatedOrder.confirmedAt
    //           ? Math.floor(
    //               (updatedOrder.readyAt.getTime() - updatedOrder.confirmedAt.getTime()) /
    //                 60000,
    //             )
    //           : null,
    //       deliveryTime:
    //         updatedOrder.deliveredAt && updatedOrder.readyAt
    //           ? Math.floor(
    //               (updatedOrder.deliveredAt.getTime() - updatedOrder.readyAt.getTime()) /
    //                 60000,
    //             )
    //           : null,
    //       totalTime: updatedOrder.deliveredAt
    //         ? Math.floor(
    //             (updatedOrder.deliveredAt.getTime() - updatedOrder.createdAt.getTime()) /
    //               60000,
    //           )
    //         : null,
    //     },
    //   });
    // }

    // Notify socket server about the update
    try {
      const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
      if (socketServerUrl) {
        await fetch(`${socketServerUrl}/api/orders/${order.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedOrder)
        });
      }
    } catch (error) {
      console.error("Error notifying socket server:", error);
      // Continue even if socket notification fails
    }

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

export async function deleteOrder(orderId: string) {
  try {
    // Delete from database
    await db.order.delete({
      where: { id: orderId },
    });

    // Notify socket server about the deletion
    try {
      const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
      if (socketServerUrl) {
        await fetch(`${socketServerUrl}/api/orders/${orderId}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.error("Error notifying socket server:", error);
      // Continue even if socket notification fails
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}