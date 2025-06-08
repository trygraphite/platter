"use client"

// hooks/useAdminOrdersSocket.ts
import { useState, useEffect, useCallback } from "react"
import { Order as PrismaOrder, OrderStatus } from "@prisma/client"
import useSocketIO from "@platter/ui/hooks/useSocketIO"
import { toast } from "@platter/ui/components/sonner"

type Order = PrismaOrder & {
  items?: any[] 
}

interface UseAdminOrdersSocketOptions {
  serverUrl: string
  initialOrders: Order[]
  userId?: string 
}

interface UseAdminOrdersSocketResult {
  orders: Order[]
  isConnected: boolean
  error: string | null
}

export default function useAdminOrdersSocket({
  serverUrl,
  initialOrders,
  userId,
}: UseAdminOrdersSocketOptions): UseAdminOrdersSocketResult {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const { socket, isConnected, error } = useSocketIO({
    serverUrl,
    path: "/socket.io",
  })

  // Handle new order event
  const handleNewOrder = useCallback((newOrder: Order) => { 
    // Check if this order already exists in our state
    setOrders((currentOrders) => {
      const exists = currentOrders.some((order) => order.id === newOrder.id)
      if (exists) {
        return currentOrders.map((order) => (order.id === newOrder.id ? { ...order, ...newOrder } : order))
      } else {
        // Show notification for new orders
        toast.success(`New order #${newOrder.orderNumber || 'Unknown'} received`)
        return [newOrder, ...currentOrders]
      }
    })
  }, [])

  // Handle order update event
  const handleOrderUpdate = useCallback((updatedOrder: Order) => {    
    // Get the current order to compare with updated order
    setOrders((currentOrders) => {
      const currentOrder = currentOrders.find(order => order.id === updatedOrder.id)
      
      // Show notification for status changes, especially cancellations
      if (currentOrder && currentOrder.status !== updatedOrder.status) {
        if (updatedOrder.status === OrderStatus.CANCELLED) {
          toast.warning(`Order #${currentOrder.orderNumber || 'Unknown'} has been cancelled by the customer`)
        } else {
          toast.info(`Order #${currentOrder.orderNumber || 'Unknown'} status changed to ${updatedOrder.status.toLowerCase()}`)
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
          : order
      )
    })
  }, [])

  // Handle order deletion event
  const handleOrderDeleted = useCallback((deletedId: string) => {    
    setOrders((currentOrders) => {
      // Find the order before removing it to show notification
      const orderToDelete = currentOrders.find(order => order.id === deletedId)
      if (orderToDelete) {
        toast.error(`Order #${orderToDelete.orderNumber || 'Unknown'} has been deleted`)
      }
      
      return currentOrders.filter((order) => order.id !== deletedId)
    })
  }, [])

  useEffect(() => {
    if (!socket || !isConnected) return
    // Join restaurant-specific room if userId is provided
    if (userId) {
      const roomName = `restaurant:${userId}`
      socket.emit("joinRestaurantRoom", userId)
    }

    // Set up event listeners
    socket.on("newOrder", handleNewOrder)
    socket.on("orderUpdate", handleOrderUpdate)
    socket.on("orderDeleted", handleOrderDeleted)

    // Clean up event listeners
    return () => {
      socket.off("newOrder", handleNewOrder)
      socket.off("orderUpdate", handleOrderUpdate)
      socket.off("orderDeleted", handleOrderDeleted)

      if (userId) {
        socket.emit("leaveRestaurantRoom", userId)
      }
    }
  }, [socket, isConnected, userId, handleNewOrder, handleOrderUpdate, handleOrderDeleted])

  return {
    orders,
    isConnected,
    error,
  }
}