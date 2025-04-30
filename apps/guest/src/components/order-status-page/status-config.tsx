// components/order/StatusConfig.tsx
import { StatusConfig } from "@/types/order-status";
import { Clock, CheckCircle2, XCircle } from "@platter/ui/lib/icons";
import { OrderStatus } from "@prisma/client";

export const statusConfigs: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    icon: <Clock className="h-8 w-8" />,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    text: "Order Pending",
  },
  CONFIRMED: {
    icon: <Clock className="h-8 w-8" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    text: "Order Confirmed",
  },
  PREPARING: {
    icon: <Clock className="h-8 w-8" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    text: "Order Processing",
  },

  DELIVERED: {
    icon: <CheckCircle2 className="h-8 w-8" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    text: "Order Delivered",
  },
  CANCELLED: {
    icon: <XCircle className="h-8 w-8" />,
    color: "text-red-600",
    bgColor: "bg-red-50",
    text: "Order Cancelled",
  },
};

export const getStatusMessage = (status: OrderStatus): string => {
  const messages = {
    PENDING: "Your order has been received and is awaiting confirmation.",
    CONFIRMED: "Your order has been confirmed and will be prepared soon.",
    PREPARING: "Your order is being prepared.",
    READY: "Your order is ready for pickup/delivery!",
    DELIVERED: "Your order has been delivered. Enjoy your meal!",
    CANCELLED: "Your order has been cancelled.",
  };
  return messages[status] || "Status unknown";
};
