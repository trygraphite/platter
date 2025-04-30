// orderService.ts
import { CreateOrderInput, OrderUpdateData } from "@/types/order-types";
import db from "@platter/db";
import { Order, Prisma } from '@platter/db/client';


const orderService = {
  createOrder: async (orderData: CreateOrderInput): Promise<Order> => {
  const newOrder = await db.order.create({
    data: {
      userId: orderData.userId,
      tableId: orderData.tableId,
      specialNotes: orderData.specialNotes,
      status: 'PENDING',
      items: {
        create: orderData.items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      items: { include: { menuItem: true } },
      table: true,
      user: true,
    },
  });

  return newOrder;
},
  // Get order by ID
  getOrderById: async (id: string): Promise<Order | null> => {
    return db.order.findUnique({
      where: { id },
      include: {
        items: { include: { menuItem: true } },
        table: true,
        user: true,
      },
    });
  },
  
  // Get all new/incoming orders
  getNewOrders: async (userId: string): Promise<Order[]> => {
    return db.order.findMany({
      where: {
        userId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      include: {
        items: { include: { menuItem: true } },
        table: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },
  // Update order
  updateOrder: async (id: string, orderData: OrderUpdateData): Promise<Order> => {
    const data: Prisma.OrderUpdateInput = {
      status: orderData.status,
      ...(orderData.tableId && { table: { connect: { id: orderData.tableId } } }),
      specialNotes: orderData.specialNotes,
      // Add timestamps based on status
      ...(orderData.status === 'CONFIRMED' ? { confirmedAt: new Date() } : {}),
      ...(orderData.status === 'PREPARING' ? { preparingAt: new Date() } : {}),
      ...(orderData.status === 'DELIVERED' ? { readyAt: new Date() } : {}),
      ...(orderData.status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
      ...(orderData.status === 'CANCELLED' ? { cancelledAt: new Date() } : {})
    };
    
    return db.order.update({
      where: { id },
      data,
      include: {
        items: { include: { menuItem: true } },
        table: true,
        user: true,
      },
    });
  },
  
  // Delete order
  deleteOrder: async (id: string): Promise<Order> => {
    return db.order.delete({
      where: { id },
    });
  },

  // Calculate time metrics for delivered orders
  calculateTimeMetrics: async (id: string): Promise<Order | null> => {
    const order = await db.order.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        createdAt: true,
        confirmedAt: true,
        readyAt: true,
        deliveredAt: true,
        totalTime: true,
      },
    });

    if (order?.status === 'DELIVERED' && !order.totalTime) {
      return db.order.update({
        where: { id: order.id },
        data: {
          confirmationTime: order.confirmedAt && order.createdAt
            ? Math.floor(
                (order.confirmedAt.getTime() - order.createdAt.getTime()) /
                  60000,
              )
            : null,
          preparationTime:
            order.readyAt && order.confirmedAt
              ? Math.floor(
                  (order.readyAt.getTime() - order.confirmedAt.getTime()) /
                    60000,
                )
              : null,
          deliveryTime:
            order.deliveredAt && order.readyAt
              ? Math.floor(
                  (order.deliveredAt.getTime() - order.readyAt.getTime()) /
                    60000,
                )
              : null,
          totalTime: order.deliveredAt && order.createdAt
            ? Math.floor(
                (order.deliveredAt.getTime() - order.createdAt.getTime()) /
                  60000,
              )
            : null,
        },
      });
    }
    
    return order;
  }

  
};

export default orderService;