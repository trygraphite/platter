"use client"

// hooks/useAdminOrdersSocket.ts
import { useState, useEffect, useCallback } from "react"
import type { Order as PrismaOrder } from "@prisma/client"
import useSocketIO from "@platter/ui/hooks/useSocketIO"

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
    console.log("New order received:", newOrder)
    console.log("Order items:", newOrder.items)

    // Check if this order already exists in our state
    setOrders((currentOrders) => {
      const exists = currentOrders.some((order) => order.id === newOrder.id)
      if (exists) {
        console.log("Order already exists in state, updating it")
        return currentOrders.map((order) => (order.id === newOrder.id ? { ...order, ...newOrder } : order))
      } else {
        console.log("Adding new order to state")
        return [newOrder, ...currentOrders]
      }
    })
  }, [])

  // Handle order update event
  const handleOrderUpdate = useCallback((updatedOrder: Order) => {
    console.log("Order update received:", updatedOrder)
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === updatedOrder.id
          ? {
              ...updatedOrder,
              // Preserve items if they're not included in the update
              items: updatedOrder.items || order.items,
            }
          : order,
      ),
    )
  }, [])

  // Handle order deletion event
  const handleOrderDeleted = useCallback((deletedId: string) => {
    console.log("Order deletion received:", deletedId)
    setOrders((currentOrders) => currentOrders.filter((order) => order.id !== deletedId))
  }, [])

  useEffect(() => {
    if (!socket || !isConnected) return

    console.log("Socket connected, setting up event listeners")

    // Join restaurant-specific room if userId is provided
    if (userId) {
      const roomName = `restaurant:${userId}`
      socket.emit("joinRestaurantRoom", userId)
      console.log(`Joined restaurant room: ${roomName} for user: ${userId}`)
    }

    // Set up event listeners
    socket.on("newOrder", handleNewOrder)
    socket.on("orderUpdate", handleOrderUpdate)
    socket.on("orderDeleted", handleOrderDeleted)

    // Clean up event listeners
    return () => {
      console.log("Cleaning up socket event listeners")
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
