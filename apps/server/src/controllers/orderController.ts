// orderController.ts

import type { Order } from "@prisma/client";
import type { Request, Response } from "express";
import orderService from "../services/orderService";
import { socketManager } from "../utils/socketManager";

// Controller methods for handling order operations
const orderController = {
  createOrder: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(
        "Received order creation request body:",
        JSON.stringify(req.body, null, 2),
      );

      const { userId, items, order } = req.body;

      // If the request contains a pre-created order (from guest app)
      if (order) {
        console.log("Using pre-created order from request:", {
          orderId: order.id,
          userId: order.userId || userId,
          itemsCount: order.items?.length || 0,
        });

        // Make sure the order has a userId
        if (!order.userId && userId) {
          order.userId = userId;
        }

        // Make sure items are properly formatted
        if (order.items && Array.isArray(order.items)) {
          console.log(`Order has ${order.items.length} items`);
        } else {
          console.warn(
            "Order is missing items array or it's not properly formatted",
          );
        }

        // Emit socket event for real-time update
        socketManager.emitNewOrder(order);

        res
          .status(200)
          .json({ success: true, message: "Order notification processed" });
        return;
      }

      // Validate required fields for new order creation
      if (!userId || !items || items.length === 0) {
        console.error("Missing required order data for new order creation");
        res.status(400).json({ error: "Missing required order data" });
        return;
      }

      // Create the order if not already created
      console.log("Creating new order in database");
      const newOrder = await orderService.createOrder({
        userId,
        items,
        tableId: req.body.tableId,
        specialNotes: req.body.specialNotes,
        order,
      });

      // Emit socket event for real-time update
      console.log("Emitting new order event:", newOrder.id);
      socketManager.emitNewOrder(newOrder);

      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Rest of the controller methods remain the same
  getOrder: async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const order: Order | null = await orderService.getOrderById(id);

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      res.json(order);
    } catch (error) {
      console.error("Error getting order:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update an order
  updateOrder: async (
    req: Request<{ id: string }, any, Partial<Order>>,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const orderData = {
        status: req.body.status ?? "PENDING",
        tableId: req.body.tableId ?? undefined,
      };

      const updatedOrder: Order = await orderService.updateOrder(id, orderData);

      // Emit socket event for real-time update
      socketManager.emitOrderUpdate(id, updatedOrder);

      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Delete an order
  deleteOrder: async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;

      await orderService.deleteOrder(id);

      // Emit socket event for real-time update
      socketManager.emitOrderDeleted(id);

      res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Get all new/incoming orders
  getNewOrders: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const orders: Order[] = await orderService.getNewOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error getting new orders:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
};

export default orderController;
