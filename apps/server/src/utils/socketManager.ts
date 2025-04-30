import type { Server, DefaultEventsMap } from "socket.io"
import { EventEmitter } from "events"

// Socket manager singleton to handle socket events
class SocketManager {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null
  events: EventEmitter

  constructor() {
    this.io = null
    this.events = new EventEmitter()
    this.events.setMaxListeners(100)
  }

  // Set the io instance
  setIO(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null) {
    this.io = io
  }

  // Emit an event to a specific room
  emitToRoom(room: string, event: string, data: any) {
    if (!this.io) {
      console.error("Socket.io instance not set")
      return
    }

    console.log(`Emitting ${event} to room ${room}`, {
      dataId: data.id,
      dataType: typeof data,
      roomName: room,
    })

    // Emit to the specific room
    this.io.to(room).emit(event, data)

    // Also emit globally for debugging
    this.io.emit(event, data)
  }

  // Emit a new order event
  emitNewOrder(orderData: any) {
    // Make sure we have a userId
    if (!orderData.userId) {
      console.error("Cannot emit newOrder: missing userId", orderData)
      return
    }

    const roomName = `restaurant:${orderData.userId}`
    console.log(`Emitting newOrder event to room: ${roomName}`, {
      orderId: orderData.id,
      userId: orderData.userId,
    })

    // Emit to restaurant-specific room
    this.emitToRoom(roomName, "newOrder", orderData)

    // Also emit to internal event system for SSE
    this.events.emit("newOrder", orderData)
  }

  // Emit an order update event
  emitOrderUpdate(orderId: string, orderData: any) {
    this.emitToRoom(`order:${orderId}`, "orderUpdate", orderData)
    // Also emit to our internal event system for SSE to pick up
    this.events.emit("orderUpdate", orderData)
  }

  // Emit an order deleted event
  emitOrderDeleted(orderId: string) {
    this.emitToRoom(`order:${orderId}`, "orderDeleted", { id: orderId })
    this.events.emit("orderDeleted", orderId)
  }
}

// Create a singleton instance
export const socketManager = new SocketManager()
