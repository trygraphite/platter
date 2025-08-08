"use server";

import db from "@platter/db";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface ModifyOrderParams {
  orderId: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    name: string;
    selectedVarietyId?: string;
  }[];
  totalAmount: number;
  specialNotes?: string;
}

export async function modifyOrder({
  orderId,
  items,
  totalAmount,
  specialNotes,
}: ModifyOrderParams) {
  try {
    // Check if order exists and can be modified
    const existingOrder = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: true,
            variety: true,
          },
        },
        table: true,
      },
    });

    if (!existingOrder) {
      return { success: false, error: "Order not found" };
    }

    // Only allow modification if order is still pending or confirmed
    if (
      existingOrder.status !== OrderStatus.PENDING &&
      existingOrder.status !== OrderStatus.CONFIRMED
    ) {
      return {
        success: false,
        error:
          "Order cannot be modified at this stage. It has already been prepared or delivered.",
      };
    }

    // Delete existing order items
    await db.orderItem.deleteMany({
      where: { orderId },
    });

    // Create new order items
    const newItems = await db.orderItem.createMany({
      data: items.map((item) => ({
        orderId,
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price,
        varietyId: item.selectedVarietyId || null,
        status: "PENDING", // Reset status for new items
      })),
    });

    // Update the order with new total and special notes
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        totalAmount,
        specialNotes: specialNotes || null,
        // Reset status to PENDING since items have changed
        status: OrderStatus.PENDING,
        // Reset timestamps since order is being modified
        confirmedAt: null,
        preparingAt: null,
        readyAt: null,
        deliveredAt: null,
        cancelledAt: null,
        // Reset time metrics
        confirmationTime: null,
        preparationTime: null,
        deliveryTime: null,
        totalTime: null,
      },
      include: {
        items: {
          include: {
            menuItem: true,
            variety: true,
          },
        },
        table: true,
        user: true,
      },
    });

    revalidatePath(`/order-status/${orderId}`);

    // Notify socket server about the order modification
    try {
      const socketServerUrl =
        process.env.NEXT_PUBLIC_SOCKET_SERVER_URL ||
        process.env.SOCKET_SERVER_URL;
      if (socketServerUrl) {
        // Format the order items correctly for the socket server
        const formattedItems = updatedOrder.items.map((item: any) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          selectedVarietyId: item.varietyId,
        }));

        // Use fetch with improved error handling and timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch(
            `${socketServerUrl}/api/orders/${orderId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: updatedOrder.userId,
                items: formattedItems,
                order: {
                  ...updatedOrder,
                  // Transform items to be more client-friendly
                  items: updatedOrder.items.map((item: any) => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    menuItem: {
                      id: item.menuItem.id,
                      name: item.menuItem.name,
                      price: item.menuItem.price,
                    },
                    variety: item.variety
                      ? {
                          id: item.variety.id,
                          name: item.variety.name,
                          price: item.variety.price,
                        }
                      : null,
                  })),
                  tableNumber: updatedOrder.table?.number || "Unknown",
                  specialNotes: updatedOrder.specialNotes,
                  status: updatedOrder.status,
                },
              }),
              signal: controller.signal,
            },
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            console.warn(
              "Socket server notification failed:",
              response.statusText,
            );
          }
        } catch (socketError) {
          console.warn("Socket server notification error:", socketError);
        }
      }
    } catch (error) {
      console.warn("Socket server notification failed:", error);
    }

    return {
      success: true,
      orderId: updatedOrder.id,
      order: updatedOrder,
    };
  } catch (error) {
    console.error("Error modifying order:", error);
    return { success: false, error: "Failed to modify order" };
  }
}
