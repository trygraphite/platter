import type { Server, DefaultEventsMap, Socket } from "socket.io"
import { socketManager } from "../utils/socketManager"

// Configure socket.io
const configureSocket = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id)

    // Join order room when client requests
    socket.on("joinOrderRoom", (orderId: string) => {
      const roomName = `order:${orderId}`
      socket.join(roomName)
      console.log(`Client ${socket.id} joined room for order: ${orderId} (${roomName})`)
    })

    // Leave order room
    socket.on("leaveOrderRoom", (orderId: string) => {
      const roomName = `order:${orderId}`
      socket.leave(roomName)
      console.log(`Client ${socket.id} left room for order: ${orderId} (${roomName})`)
    })

    // Join restaurant room for receiving new orders
    socket.on("joinRestaurantRoom", (userId: string) => {
      const roomName = `restaurant:${userId}`
      socket.join(roomName)
      console.log(`Client ${socket.id} joined restaurant room: ${roomName} for user: ${userId}`)

      // Send confirmation back to client
      socket.emit("roomJoined", { room: roomName, userId })
    })

    // Leave restaurant room
    socket.on("leaveRestaurantRoom", (userId: string) => {
      const roomName = `restaurant:${userId}`
      socket.leave(roomName)
      console.log(`Client ${socket.id} left restaurant room: ${roomName} for user: ${userId}`)
    })

    // Handle client disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  socketManager.setIO(io)
}

export default configureSocket
