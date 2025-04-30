"use server"

import db from "@platter/db"
import { revalidatePath } from "next/cache"

interface CreateOrderParams {
  tableId: string
  qrId: string
  items: {
    id: string
    quantity: number
    price: number
    name: string
  }[]
  totalAmount: number
}

export async function createOrder({ tableId, qrId, items, totalAmount }: CreateOrderParams) {
  try {
    // Get restaurant ID from QR code
    const qrCode = await db.qRCode.findUnique({
      where: { id: qrId },
      select: { userId: true },
    })

    // Check if QR code exists and has a valid userId
    if (!qrCode?.userId) {
      throw new Error("QR code not found or not associated with a user")
    }

    // Get the start of the current day (12 AM)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch the latest orderNumber for today
    const lastOrder = await db.order.findFirst({
      where: {
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        orderNumber: "desc",
      },
    })

    // Determine the next orderNumber
    const orderNumber = lastOrder?.orderNumber ? lastOrder.orderNumber + 1 : 1

    // Create the order with validated userId
    const order = await db.order.create({
      data: {
        status: "PENDING",
        orderNumber,
        totalAmount,
        userId: qrCode.userId, // Now guaranteed to be a string
        tableId,
        items: {
          create: items.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        table: true,
      },
    })

    console.log("Order created:", order)
    revalidatePath(`/${qrId}/order-status`)

    // Notify socket server about the new order
    try {
      const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || process.env.SOCKET_SERVER_URL
      if (socketServerUrl) {
        console.log("Notifying socket server about new order:", {
          orderId: order.id,
          userId: qrCode.userId,
          socketUrl: socketServerUrl,
        })

        // Format the order items correctly for the socket server
        const formattedItems = order.items.map((item: any) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        }))

        // Use fetch with improved error handling and timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        try {
          const response = await fetch(`${socketServerUrl}/api/orders/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: qrCode.userId,
              items: formattedItems, // Include properly formatted items array
              order: {
                ...order,
                // Transform items to be more client-friendly
                items: order.items.map((item: any) => ({
                  id: item.id,
                  quantity: item.quantity,
                  price: item.price,
                  menuItem: {
                    id: item.menuItem.id,
                    name: item.menuItem.name,
                    price: item.menuItem.price,
                  },
                })),
                tableNumber: order.table?.number || "Unknown",
              },
            }),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            console.error("Failed to notify socket server:", errorText)
          } else {
            console.log("Socket server notified successfully")
          }
        } catch (fetchError: any) {
          clearTimeout(timeoutId)
          if (fetchError.name === "AbortError") {
            console.error("Socket server notification timed out")
          } else {
            console.error("Error notifying socket server:", fetchError)
          }
          // Continue even if socket notification fails
        }
      }
    } catch (error) {
      console.error("Error in socket notification block:", error)
      // Continue even if socket notification fails
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Failed to create order" }
  }
}
