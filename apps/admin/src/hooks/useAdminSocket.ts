"use client";

import { toast } from "@platter/ui/components/sonner";
import useSocketIO from "@platter/ui/hooks/useSocketIO";
import { OrderStatus, type Order as PrismaOrder } from "@prisma/client";
// hooks/useAdminOrdersSocket.ts
import { useCallback, useEffect, useState } from "react";

type Order = PrismaOrder & {
  items?: {
    id: string;
    quantity: number;
    status:
      | "PENDING"
      | "CONFIRMED"
      | "PREPARING"
      | "READY"
      | "DELIVERED"
      | "CANCELLED";
    menuItem: {
      name: string;
      price: number;
    };
    variety?: {
      id: string;
      name: string;
      price: number;
    } | null;
  }[];
};

interface UseAdminOrdersSocketOptions {
  serverUrl: string;
  initialOrders: Order[];
  userId?: string;
}

interface UseAdminOrdersSocketResult {
  orders: Order[];
  isConnected: boolean;
  error: string | null;
}

export default function useAdminOrdersSocket({
  serverUrl,
  initialOrders,
  userId,
}: UseAdminOrdersSocketOptions): UseAdminOrdersSocketResult {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { socket, isConnected, error } = useSocketIO({
    serverUrl,
    path: "/socket.io",
  });

  // Handle new order event
  const handleNewOrder = useCallback((newOrder: Order) => {
    // Check if this order already exists in our state
    setOrders((currentOrders) => {
      const exists = currentOrders.some((order) => order.id === newOrder.id);
      if (exists) {
        return currentOrders.map((order) =>
          order.id === newOrder.id ? { ...order, ...newOrder } : order,
        );
      }
      // Show notification for new orders
      toast.success(`New order #${newOrder.orderNumber || "Unknown"} received`);
      return [newOrder, ...currentOrders];
    });
  }, []);

  // Handle order update event
  const handleOrderUpdate = useCallback((updatedOrder: Order) => {
    // Get the current order to compare with updated order
    setOrders((currentOrders) => {
      const currentOrder = currentOrders.find(
        (order) => order.id === updatedOrder.id,
      );

      // Show notification for status changes, especially cancellations
      if (currentOrder && currentOrder.status !== updatedOrder.status) {
        if (updatedOrder.status === OrderStatus.CANCELLED) {
          toast.warning(
            `Order #${currentOrder.orderNumber || "Unknown"} has been cancelled by the customer`,
          );
        } else {
          toast.info(
            `Order #${currentOrder.orderNumber || "Unknown"} status changed to ${updatedOrder.status.toLowerCase()}`,
          );
        }
      }

      return currentOrders.map((order) =>
        order.id === updatedOrder.id
          ? {
              ...order,
              ...updatedOrder,
              // Preserve items if they're not included in the update
              items: updatedOrder.items || order.items,
            }
          : order,
      );
    });
  }, []);

  // Handle order deletion event
  const handleOrderDeleted = useCallback((deletedId: string) => {
    setOrders((currentOrders) => {
      // Find the order before removing it to show notification
      const orderToDelete = currentOrders.find(
        (order) => order.id === deletedId,
      );
      if (orderToDelete) {
        toast.error(
          `Order #${orderToDelete.orderNumber || "Unknown"} has been deleted`,
        );
      }

      return currentOrders.filter((order) => order.id !== deletedId);
    });
  }, []);

  // Handle order item status update event
  const handleOrderItemStatusUpdate = useCallback(
    (data: { orderId: string; orderItem: NonNullable<Order["items"]>[0] }) => {
      setOrders((currentOrders) => {
        return currentOrders.map((order) =>
          order.id === data.orderId
            ? {
                ...order,
                items:
                  order.items?.map((item) =>
                    item.id === data.orderItem.id
                      ? { ...item, ...data.orderItem }
                      : item,
                  ) || [],
              }
            : order,
        );
      });
    },
    [],
  );

  useEffect(() => {
    if (!socket || !isConnected) return;
    // Join restaurant-specific room if userId is provided
    if (userId) {
      const _roomName = `restaurant:${userId}`;
      socket.emit("joinRestaurantRoom", userId);
    }

    // Set up event listeners
    socket.on("newOrder", handleNewOrder);
    socket.on("orderUpdate", handleOrderUpdate);
    socket.on("orderDeleted", handleOrderDeleted);
    socket.on("orderItemStatusUpdate", handleOrderItemStatusUpdate);

    // Clean up event listeners
    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("orderUpdate", handleOrderUpdate);
      socket.off("orderDeleted", handleOrderDeleted);
      socket.off("orderItemStatusUpdate", handleOrderItemStatusUpdate);

      if (userId) {
        socket.emit("leaveRestaurantRoom", userId);
      }
    };
  }, [
    socket,
    isConnected,
    userId,
    handleNewOrder,
    handleOrderUpdate,
    handleOrderDeleted,
    handleOrderItemStatusUpdate,
  ]);

  return {
    orders,
    isConnected,
    error,
  };
}
