import type { DefaultEventsMap, Server, Socket } from "socket.io";
import { socketManager } from "../utils/socketManager";

// Configure socket.io
const configureSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    // Join order room when client requests
    socket.on("joinOrderRoom", (orderId: string) => {
      const roomName = `order:${orderId}`;
      socket.join(roomName);
      console.log(
        `Client ${socket.id} joined room for order: ${orderId} (${roomName})`,
      );
    });

    // Leave order room
    socket.on("leaveOrderRoom", (orderId: string) => {
      const roomName = `order:${orderId}`;
      socket.leave(roomName);
      console.log(
        `Client ${socket.id} left room for order: ${orderId} (${roomName})`,
      );
    });

    // Join restaurant room for receiving new orders
    socket.on("joinRestaurantRoom", (userId: string) => {
      const roomName = `restaurant:${userId}`;
      socket.join(roomName);
      console.log(
        `Client ${socket.id} joined restaurant room: ${roomName} for user: ${userId}`,
      );

      // Send confirmation back to client
      socket.emit("roomJoined", { room: roomName, userId });
    });

    // Leave restaurant room
    socket.on("leaveRestaurantRoom", (userId: string) => {
      const roomName = `restaurant:${userId}`;
      socket.leave(roomName);
      console.log(
        `Client ${socket.id} left restaurant room: ${roomName} for user: ${userId}`,
      );
    });

    // Handle order updates from clients
    socket.on("updateOrder", async (orderData: any) => {
      try {
        console.log("Received order update from client:", orderData);

        // Emit order update to relevant rooms
        // This will broadcast to all clients viewing this order
        socketManager.emitOrderUpdate(orderData.id, orderData);

        console.log(
          `Order update processed for order: ${orderData.id}, status: ${orderData.status}`,
        );
      } catch (error) {
        console.error("Error processing order update:", error);
      }
    });

    // Handle waiter alert from clients
    socket.on("waiterAlert", async (alertData: any) => {
      try {
        console.log("Received waiter alert from client:", alertData);

        if (!alertData.userId) {
          console.error(
            "Cannot process waiter alert: missing userId",
            alertData,
          );
          return;
        }

        // Emit waiter alert to restaurant room
        socketManager.emitWaiterAlert(alertData.userId, alertData);

        console.log(
          `Waiter alert processed for table: ${alertData.tableId || "Unknown"}, restaurant: ${alertData.userId}`,
        );
      } catch (error) {
        console.error("Error processing waiter alert:", error);
      }
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  socketManager.setIO(io);
};

export default configureSocket;
