// components/order/OrderItemSummary.tsx

import {
  CheckCircle,
  ChefHat,
  Clock,
  Package,
  Truck,
  XCircle,
} from "@platter/ui/lib/icons";

interface OrderItem {
  id: string;
  status: string;
}

interface OrderItemSummaryProps {
  items: OrderItem[];
}

// Status configuration for individual items
const ITEM_STATUS_CONFIG = {
  PENDING: {
    icon: Clock,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    text: "Pending",
  },
  CONFIRMED: {
    icon: CheckCircle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    text: "Confirmed",
  },
  PREPARING: {
    icon: ChefHat,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    text: "Preparing",
  },
  READY: {
    icon: Package,
    color: "text-green-600",
    bgColor: "bg-green-100",
    text: "Ready",
  },
  DELIVERED: {
    icon: Truck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    text: "Delivered",
  },
  CANCELLED: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    text: "Cancelled",
  },
};

export function OrderItemSummary({ items }: OrderItemSummaryProps) {
  // Count items by status
  const statusCounts = items.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Get unique statuses that have items
  const activeStatuses = Object.keys(statusCounts).filter(
    (status) => statusCounts[status] > 0,
  );

  if (activeStatuses.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="font-semibold mb-3">Order Progress</h4>
      <div className="flex flex-wrap gap-2">
        {activeStatuses.map((status) => {
          const config =
            ITEM_STATUS_CONFIG[status as keyof typeof ITEM_STATUS_CONFIG];
          if (!config) return null;

          const IconComponent = config.icon;
          const count = statusCounts[status];

          return (
            <div
              key={status}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${config.bgColor} ${config.color}`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{config.text}</span>
              <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
