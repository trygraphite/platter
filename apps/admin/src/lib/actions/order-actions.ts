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
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrder),
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

export async function updateOrderItemStatus(
  orderItemId: string,
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "DELIVERED"
    | "CANCELLED",
  userId: string,
) {
  try {
    // Verify the order item belongs to the user's restaurant
    const orderItem = await db.orderItem.findFirst({
      where: {
        id: orderItemId,
        order: {
          userId: userId,
        },
      },
      include: {
        order: true,
        menuItem: {
          include: {
            servicePoint: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        variety: true,
      },
    });

    if (!orderItem) {
      throw new Error("Order item not found or access denied");
    }

    // Update the order item status with timestamps
    const updateData: {
      status: typeof status;
      confirmedAt?: Date;
      preparingAt?: Date;
      readyAt?: Date;
      deliveredAt?: Date;
      cancelledAt?: Date;
    } = {
      status,
    };

    // Add timestamps based on status
    if (status === "CONFIRMED") {
      updateData.confirmedAt = new Date();
    } else if (status === "PREPARING") {
      updateData.preparingAt = new Date();
    } else if (status === "READY") {
      updateData.readyAt = new Date();
    } else if (status === "DELIVERED") {
      updateData.deliveredAt = new Date();
    } else if (status === "CANCELLED") {
      updateData.cancelledAt = new Date();
    }

    const updatedOrderItem = await db.orderItem.update({
      where: { id: orderItemId },
      data: updateData,
      include: {
        menuItem: {
          include: {
            servicePoint: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        variety: true,
      },
    });

    // Notify socket server about the update
    try {
      const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
      if (socketServerUrl) {
        await fetch(`${socketServerUrl}/api/orders/${orderItem.orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "itemStatusUpdate",
            orderItem: updatedOrderItem,
          }),
        });
      }
    } catch (error) {
      console.error("Error notifying socket server:", error);
      // Continue even if socket notification fails
    }

    return updatedOrderItem;
  } catch (error) {
    console.error("Error updating order item status:", error);
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
          method: "DELETE",
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

export async function updateAllOrderItemsStatus(
  orderId: string,
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "DELIVERED"
    | "CANCELLED",
  userId: string,
) {
  try {
    // Verify the order belongs to the user's restaurant
    const order = await db.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error("Order not found or access denied");
    }

    // Prepare update data with timestamps
    const updateData: {
      status: typeof status;
      confirmedAt?: Date;
      preparingAt?: Date;
      readyAt?: Date;
      deliveredAt?: Date;
      cancelledAt?: Date;
    } = {
      status,
    };

    // Add timestamps based on status
    if (status === "CONFIRMED") {
      updateData.confirmedAt = new Date();
    } else if (status === "PREPARING") {
      updateData.preparingAt = new Date();
    } else if (status === "READY") {
      updateData.readyAt = new Date();
    } else if (status === "DELIVERED") {
      updateData.deliveredAt = new Date();
    } else if (status === "CANCELLED") {
      updateData.cancelledAt = new Date();
    }

    // Update all order items in the order
    const updatedOrderItems = await db.orderItem.updateMany({
      where: {
        orderId: orderId,
      },
      data: updateData,
    });

    // Also update the main order status
    await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Get the updated order with all items for socket notification
    const updatedOrder = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                servicePoint: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                  },
                },
              },
            },
            variety: true,
          },
        },
      },
    });

    // Notify socket server about the bulk update
    try {
      const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
      if (socketServerUrl) {
        await fetch(`${socketServerUrl}/api/orders/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "bulkItemStatusUpdate",
            order: updatedOrder,
            status,
          }),
        });
      }
    } catch (error) {
      console.error("Error notifying socket server:", error);
      // Continue even if socket notification fails
    }

    return { success: true, updatedCount: updatedOrderItems.count };
  } catch (error) {
    console.error("Error updating all order items status:", error);
    throw error;
  }
}
