import { EventEmitter } from "node:events";
import type { DefaultEventsMap, Server } from "socket.io";

// Socket manager singleton to handle socket events
class SocketManager {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
  events: EventEmitter;

  constructor() {
    this.io = null;
    this.events = new EventEmitter();
    this.events.setMaxListeners(100);
  }

  // Set the io instance
  setIO(
    io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    > | null,
  ) {
    this.io = io;
  }

  // Emit an event to a specific room
  emitToRoom(room: string, event: string, data: any) {
    if (!this.io) {
      console.error("Socket.io instance not set");
      return;
    }

    console.log(`Emitting ${event} to room ${room}`, {
      dataId: data.id,
      dataType: typeof data,
      roomName: room,
    });

    // Emit to the specific room
    this.io.to(room).emit(event, data);
  }

  // Emit a new order event
  emitNewOrder(orderData: any) {
    // Make sure we have a userId
    if (!orderData.userId) {
      console.error("Cannot emit newOrder: missing userId", orderData);
      return;
    }

    const roomName = `restaurant:${orderData.userId}`;
    console.log(`Emitting newOrder event to room: ${roomName}`, {
      orderId: orderData.id,
      userId: orderData.userId,
    });

    // Emit to restaurant-specific room
    this.emitToRoom(roomName, "newOrder", orderData);

    // Also emit to internal event system for SSE
    this.events.emit("newOrder", orderData);
  }

  // Emit an order update event
  emitOrderUpdate(orderId: string, orderData: any) {
    this.emitToRoom(`order:${orderId}`, "orderUpdate", orderData);

    // If we have userId, also emit to restaurant room
    if (orderData.userId) {
      this.emitToRoom(
        `restaurant:${orderData.userId}`,
        "orderUpdate",
        orderData,
      );
    }

    // Also emit to our internal event system for SSE to pick up
    this.events.emit("orderUpdate", orderData);
  }

  // Emit an order deleted event
  emitOrderDeleted(orderId: string, orderData: any = {}) {
    this.emitToRoom(`order:${orderId}`, "orderDeleted", {
      id: orderId,
      ...orderData,
    });

    // If we have userId, also emit to restaurant room
    if (orderData?.userId) {
      this.emitToRoom(`restaurant:${orderData.userId}`, "orderDeleted", {
        id: orderId,
        ...orderData,
      });
    }

    this.events.emit("orderDeleted", { id: orderId, ...orderData });
  }

  // Emit a waiter alert event
  emitWaiterAlert(userId: string, alertData: any) {
    const roomName = `restaurant:${userId}`;
    console.log("ALERT DATA HERE", alertData);
    console.log(`Emitting waiterAlert event to room: ${roomName}`, {
      tableId: alertData.tableId,
      userId: userId,
    });

    // Emit to restaurant-specific room
    this.emitToRoom(roomName, "waiterAlert", alertData);

    // Also emit to internal event system for SSE
    this.events.emit("waiterAlert", alertData);
  }
}

// Create a singleton instance
export const socketManager = new SocketManager();
