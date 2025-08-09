"use server";

import db from "@platter/db/index";
import type { OrderStatus } from "@prisma/client";
import type { OrderWithDetails } from "@/types/orders";
import { requireAuth } from "@/utils/auth";

export async function getStaffOrders() {
  const staff = await requireAuth();

  // Base query for orders
  const baseWhere = {
    userId: staff.restaurantId,
  };

  // Get all orders with all items
  const orders = await db.order.findMany({
    where: baseWhere,
    include: {
      items: {
        include: {
          menuItem: {
            include: {
              varieties: true,
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
      table: true,
      staff: true,
    },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  // For operators, add metadata to distinguish their items
  if (
    staff.staffRole === "OPERATOR" &&
    staff.assignedServicePoints &&
    staff.assignedServicePoints.length > 0
  ) {
    const assignedServicePointIds = staff.assignedServicePoints.map(
      (sp) => sp.servicePointId,
    );

    return orders
      .map((order: OrderWithDetails) => {
        const myItems = order.items.filter(
          (item: OrderWithDetails["items"][0]) =>
            item.menuItem.servicePointId &&
            assignedServicePointIds.includes(item.menuItem.servicePointId),
        );

        const otherItems = order.items.filter(
          (item: OrderWithDetails["items"][0]) =>
            !item.menuItem.servicePointId ||
            !assignedServicePointIds.includes(item.menuItem.servicePointId),
        );

        const myItemsTotal = myItems.reduce(
          (sum: number, item: OrderWithDetails["items"][0]) =>
            sum + item.price * item.quantity,
          0,
        );
        const otherItemsTotal = otherItems.reduce(
          (sum: number, item: OrderWithDetails["items"][0]) =>
            sum + item.price * item.quantity,
          0,
        );

        return {
          ...order,
          items: order.items.map((item: OrderWithDetails["items"][0]) => ({
            ...item,
            isMyItem:
              item.menuItem.servicePointId &&
              assignedServicePointIds.includes(item.menuItem.servicePointId),
          })),
          _metadata: {
            myItemsCount: myItems.length,
            otherItemsCount: otherItems.length,
            myItemsTotal,
            otherItemsTotal,
            hasMyItems: myItems.length > 0,
            hasOtherItems: otherItems.length > 0,
          },
        };
      })
      .filter((order: OrderWithDetails) => order._metadata?.hasMyItems);
  }

  // For other roles, return orders as-is
  return orders;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const staff = await requireAuth();

  // Verify the order belongs to the staff's restaurant
  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId: staff.restaurantId,
    },
  });

  if (!order) {
    throw new Error("Order not found or access denied");
  }

  // Update the order status
  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data: {
      status,
      // Add timestamps based on status
      ...(status === "CONFIRMED" && { confirmedAt: new Date() }),
      ...(status === "PREPARING" && { preparingAt: new Date() }),
      ...(status === "DELIVERED" && { deliveredAt: new Date() }),
      ...(status === "CANCELLED" && { cancelledAt: new Date() }),
    },
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
      table: true,
    },
  });

  return updatedOrder;
}

export async function assignOrderToStaff(orderId: string) {
  const staff = await requireAuth();

  // Verify the order belongs to the staff's restaurant
  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId: staff.restaurantId,
    },
  });

  if (!order) {
    throw new Error("Order not found or access denied");
  }

  // Assign the order to the current staff member
  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data: {
      staffId: staff.id,
    },
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
      table: true,
      staff: true,
    },
  });

  return updatedOrder;
}

export async function getOrderStats() {
  const staff = await requireAuth();

  const [totalOrders, confirmedOrders, preparingOrders, deliveredOrders] =
    await Promise.all([
      db.order.count({ where: { userId: staff.restaurantId } }),
      db.order.count({
        where: { userId: staff.restaurantId, status: "CONFIRMED" },
      }),
      db.order.count({
        where: { userId: staff.restaurantId, status: "PREPARING" },
      }),
      db.order.count({
        where: { userId: staff.restaurantId, status: "DELIVERED" },
      }),
    ]);

  return {
    total: totalOrders,
    confirmed: confirmedOrders,
    preparing: preparingOrders,
    delivered: deliveredOrders,
  };
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
) {
  const staff = await requireAuth();

  // Verify the order item belongs to the staff's restaurant
  const orderItem = await db.orderItem.findFirst({
    where: {
      id: orderItemId,
      order: {
        userId: staff.restaurantId,
      },
    },
    include: {
      order: true,
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

  return updatedOrderItem;
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
) {
  const staff = await requireAuth();

  try {
    // Verify the order belongs to the staff's restaurant
    const order = await db.order.findFirst({
      where: {
        id: orderId,
        userId: staff.restaurantId,
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

    // Update all order items in the order (synchronous execution)
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

    return {
      success: true,
      updatedCount: updatedOrderItems.count,
      order: updatedOrder,
    };
  } catch (error) {
    console.error("Error updating all order items status:", error);
    throw error;
  }
}

export async function updateManageableOrderItemsStatus(
  orderId: string,
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "DELIVERED"
    | "CANCELLED",
) {
  const staff = await requireAuth();

  try {
    // Verify the order belongs to the staff's restaurant
    const order = await db.order.findFirst({
      where: {
        id: orderId,
        userId: staff.restaurantId,
      },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                servicePoint: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found or access denied");
    }

    // For operators, only update items assigned to their service points
    if (staff.staffRole === "OPERATOR" && staff.assignedServicePoints) {
      const assignedServicePointIds = staff.assignedServicePoints.map(
        (sp) => sp.servicePointId,
      );

      // Filter items that the operator can manage
      const manageableItemIds = order.items
        .filter(
          (item: OrderWithDetails["items"][0]) =>
            item.menuItem.servicePointId &&
            assignedServicePointIds.includes(item.menuItem.servicePointId),
        )
        .map((item: OrderWithDetails["items"][0]) => item.id);

      if (manageableItemIds.length === 0) {
        throw new Error("No manageable items found for this operator");
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

      // Update only manageable items
      const updatedOrderItems = await db.orderItem.updateMany({
        where: {
          id: {
            in: manageableItemIds,
          },
        },
        data: updateData,
      });

      // Get the updated order with all items
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

      // Notify socket server about the update
      try {
        const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
        if (socketServerUrl) {
          await fetch(`${socketServerUrl}/api/orders/${orderId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "manageableItemsStatusUpdate",
              order: updatedOrder,
              status,
              updatedCount: updatedOrderItems.count,
            }),
          });
        }
      } catch (error) {
        console.error("Error notifying socket server:", error);
      }

      return {
        success: true,
        updatedCount: updatedOrderItems.count,
        order: updatedOrder,
      };
    }

    // For non-operators, use the regular bulk update
    return updateAllOrderItemsStatus(orderId, status);
  } catch (error) {
    console.error("Error updating manageable order items status:", error);
    throw error;
  }
}

export async function assignOrderItemToServicePoint(
  orderItemId: string,
  servicePointId: string,
) {
  const staff = await requireAuth();

  // Verify the order item belongs to the staff's restaurant
  const orderItem = await db.orderItem.findFirst({
    where: {
      id: orderItemId,
      order: {
        userId: staff.restaurantId,
      },
    },
  });

  if (!orderItem) {
    throw new Error("Order item not found or access denied");
  }

  // Verify the service point belongs to the same restaurant
  const servicePoint = await db.servicePoint.findFirst({
    where: {
      id: servicePointId,
      userId: staff.restaurantId,
      isActive: true,
    },
  });

  if (!servicePoint) {
    throw new Error("Service point not found or access denied");
  }

  // Assign the order item to the service point by updating the menu item
  const updatedOrderItem = await db.orderItem.update({
    where: { id: orderItemId },
    data: {
      menuItem: {
        update: {
          servicePointId,
        },
      },
    },
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

  return updatedOrderItem;
}

export async function getServicePoints() {
  const staff = await requireAuth();

  const servicePoints = await db.servicePoint.findMany({
    where: {
      userId: staff.restaurantId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return servicePoints;
}

export async function getAssignedTables() {
  const staff = await requireAuth();

  const assignedTables = await db.staffTable.findMany({
    where: {
      staffId: staff.id,
      isActive: true,
    },
    include: {
      table: {
        select: {
          id: true,
          number: true,
          capacity: true,
          isAvailable: true,
        },
      },
    },
  });

  interface TableData {
    id: string;
    number: string;
    capacity: number;
    isAvailable: boolean;
  }

  interface StaffTableAssignment {
    table: TableData;
  }

  return assignedTables.map(
    (assignment: StaffTableAssignment) => assignment.table,
  );
}

interface DashboardData {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    preparingOrders: number;
    deliveredOrders: number;
    totalTables: number;
    activeTables: number;
    menuItems: number;
    todaySales: number;
  };
  restaurant: {
    name: string;
  };
}

export async function getDashboardStats(): Promise<DashboardData> {
  const staff = await requireAuth();

  const restaurant = await db.user.findFirst({
    where: {
      id: staff.restaurantId,
      userType: "RESTAURANT",
    },
    select: { name: true },
  });

  const [
    totalOrders,
    pendingOrders,
    preparingOrders,
    deliveredOrders,
    totalTables,
    activeTables,
    menuItems,
    todaySales,
  ] = await Promise.all([
    db.order.count({ where: { userId: staff.restaurantId } }),
    db.order.count({
      where: { userId: staff.restaurantId, status: "PENDING" },
    }),
    db.order.count({
      where: { userId: staff.restaurantId, status: "PREPARING" },
    }),
    db.order.count({
      where: { userId: staff.restaurantId, status: "DELIVERED" },
    }),
    db.table.count({ where: { userId: staff.restaurantId } }),
    db.table.count({
      where: {
        userId: staff.restaurantId,
        isAvailable: true,
      },
    }),
    db.menuItem.count({
      where: {
        userId: staff.restaurantId,
        isAvailable: true,
        deletedAt: null,
      },
    }),
    db.order.aggregate({
      where: {
        userId: staff.restaurantId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        status: "DELIVERED",
      },
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  return {
    stats: {
      totalOrders,
      pendingOrders,
      preparingOrders,
      deliveredOrders,
      totalTables,
      activeTables,
      menuItems,
      todaySales: todaySales._sum.totalAmount || 0,
    },
    restaurant: {
      name: restaurant?.name || "Restaurant",
    },
  };
}
