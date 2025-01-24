"use server";

import db from "@platter/db";
import { revalidatePath } from "next/cache";

export async function createOrder(orderData: {
  userId: string;
  tableId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  specialNotes?: string;
}) {
  const { userId, tableId, items, specialNotes } = orderData;

  // Determine the start of the current day (12 AM)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch the latest orderNumber for today
  const lastOrder = await db.order.findFirst({
    where: {
      createdAt: {
        gte: today, // Only consider orders created after 12 AM today
      },
    },
    orderBy: {
      orderNumber: "desc", // Get the highest order number
    },
  });

  // Determine the next orderNumber
  const orderNumber = lastOrder ? (lastOrder.orderNumber ?? 0) + 1 : 1;

  // Fetch the menu items to get their current prices
  const menuItems = await db.menuItem.findMany({
    where: {
      id: {
        in: items.map((item) => item.menuItemId),
      },
    },
    select: {
      id: true,
      price: true,
    },
  });

  // Create a map of menuItemId to price for easy lookup
  const priceMap = menuItems.reduce(
    (acc, item) => {
      acc[item.id] = item.price;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate total amount before creating the order
  const totalAmount = items.reduce(
    (total, item) => total + (priceMap[item.menuItemId] ?? 0) * item.quantity,
    0,
  );

  // Create the order with the calculated orderNumber
  const order = await db.order.create({
    data: {
      userId,
      tableId,
      specialNotes,
      orderNumber, // Assign the calculated orderNumber
      status: "PENDING",
      totalAmount, // Set the total amount directly
      items: {
        create: items.map((item) => ({
          quantity: item.quantity,
          price: priceMap[item.menuItemId] ?? 0,
          menuItem: {
            connect: { id: item.menuItemId },
          },
        })),
      },
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  revalidatePath("/orders"); // Trigger revalidation for orders

  return order;
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

