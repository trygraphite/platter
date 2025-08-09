// index.ts

import http from "node:http";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import configureSocket from "./config/socket";
import orderRoutes from "./routes/orderRoutes";

dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);

// Improved CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*", // In production, specify your actual domains
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  // Add reconnection settings
  pingTimeout: 60000, // Increase ping timeout to 60 seconds
  pingInterval: 25000, // Ping every 25 seconds
  transports: ["websocket", "polling"], // Try WebSocket first, then fall back to polling
  allowUpgrades: true,
});

// Configure socket connection
configureSocket(io);

// Middleware
app.use(
  cors({
    origin: "*", // Match the Socket.IO CORS config
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// Health check route
app.get("/", (_req, res) => {
  res.send("Socket server running");
});

// API routes
app.use("/api/orders", orderRoutes);

// Handle 404 routes
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  },
);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`🧠 Realtime API running on http://localhost:${PORT}`);
});

// Export io to be used in other files if needed
export { io };
