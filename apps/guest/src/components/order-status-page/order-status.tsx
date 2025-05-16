// components/order/OrderStatusDisplay.tsx
import { OrderStatus } from "@prisma/client";
import { getStatusMessage, statusConfigs } from "./status-config";
import { Clock } from "@platter/ui/lib/icons";

interface OrderStatusDisplayProps {
  status: OrderStatus;
}

export function OrderStatusDisplay({ status }: OrderStatusDisplayProps) {
  // Default config to use as fallback if status is not found in statusConfigs
  const defaultConfig = {
    icon: <Clock className="h-8 w-8" />,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    text: "Order Status",
  };

  // Use the config for the current status or fall back to default if not found
  const statusConfig = statusConfigs[status] || defaultConfig;

  return (
    <div
      className={`p-6 rounded-lg ${statusConfig.bgColor} ${statusConfig.color}`}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        {statusConfig.icon}
        <h3 className="text-xl font-semibold">{statusConfig.text}</h3>
        <p className="text-sm">{getStatusMessage(status)}</p>
      </div>
    </div>
  );
}