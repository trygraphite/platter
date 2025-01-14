// components/order/OrderStatus.tsx
import { OrderStatus } from "@prisma/client";
import { getStatusMessage, statusConfigs } from "./status-config";

interface OrderStatusDisplayProps {
  status: OrderStatus;
}

export function OrderStatusDisplay({ status }: OrderStatusDisplayProps) {
  const statusConfig = statusConfigs[status];

  return (
    <div className={`p-6 rounded-lg ${statusConfig.bgColor} ${statusConfig.color}`}>
      <div className="flex flex-col items-center text-center space-y-2">
        {statusConfig.icon}
        <h3 className="text-xl font-semibold">{statusConfig.text}</h3>
        <p className="text-sm">{getStatusMessage(status)}</p>
      </div>
    </div>
  );
}