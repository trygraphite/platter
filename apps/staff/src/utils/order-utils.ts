import type { OrderStatus } from "@prisma/client";
import {
  CheckCircle,
  CheckSquare,
  Clock,
  Package,
  XCircle,
} from "lucide-react";

// Define all possible order statuses
export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "DELIVERED",
  "CANCELLED",
];

// Define all possible order item statuses
export const ORDER_ITEM_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
] as const;

export const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "text-yellow-600 bg-yellow-100";
    case "CONFIRMED":
      return "text-blue-600 bg-blue-100";
    case "PREPARING":
      return "text-purple-600 bg-purple-100";
    case "DELIVERED":
      return "text-green-600 bg-green-100";
    case "CANCELLED":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getOrderItemStatusStyle = (status: string) => {
  switch (status) {
    case "PENDING":
      return "text-yellow-600 bg-yellow-100";
    case "CONFIRMED":
      return "text-blue-600 bg-blue-100";
    case "PREPARING":
      return "text-purple-600 bg-purple-100";
    case "READY":
      return "text-green-600 bg-green-100";
    case "DELIVERED":
      return "text-green-600 bg-green-100";
    case "CANCELLED":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return Clock;
    case "CONFIRMED":
      return CheckSquare;
    case "PREPARING":
      return Package;
    case "DELIVERED":
      return CheckCircle;
    case "CANCELLED":
      return XCircle;
    default:
      return Clock;
  }
};

export const getOrderItemStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return Clock;
    case "CONFIRMED":
      return CheckSquare;
    case "PREPARING":
      return Package;
    case "READY":
      return CheckCircle;
    case "DELIVERED":
      return CheckCircle;
    case "CANCELLED":
      return XCircle;
    default:
      return Clock;
  }
};

export const getStatusButtonStyle = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-600 hover:bg-yellow-700";
    case "CONFIRMED":
      return "bg-blue-600 hover:bg-blue-700";
    case "PREPARING":
      return "bg-purple-600 hover:bg-purple-700";
    case "DELIVERED":
      return "bg-green-600 hover:bg-green-700";
    case "CANCELLED":
      return "bg-red-600 hover:bg-red-700";
    default:
      return "bg-gray-600 hover:bg-gray-700";
  }
};

export const getStatusButtonText = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "Mark Pending";
    case "CONFIRMED":
      return "Confirm Order";
    case "PREPARING":
      return "Start Preparing";
    case "DELIVERED":
      return "Mark Delivered";
    case "CANCELLED":
      return "Cancel Order";
    default:
      return status;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500";
    case "CONFIRMED":
      return "bg-blue-500";
    case "PREPARING":
      return "bg-purple-500";
    case "READY":
      return "bg-green-500";
    case "DELIVERED":
      return "bg-green-500";
    case "CANCELLED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
