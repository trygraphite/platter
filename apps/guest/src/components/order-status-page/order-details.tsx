// components/order/OrderDetails.tsx

import type { Order, Table } from "@platter/db/client";
import {
  CheckCircle,
  ChefHat,
  Clock,
  Package,
  Truck,
  XCircle,
} from "@platter/ui/lib/icons";
import Image from "next/image";
import { formatNairaWithDecimals } from "@/utils";
import { OrderItemSummary } from "./order-item-summary";

interface OrderItem {
  id: string;
  price: string;
  quantity: number;
  status: string;
  specialNotes?: string;
  menuItem: {
    id: string;
    name: string;
    price: string;
    image?: string | null;
  };
  variety?: {
    id: string;
    name: string;
    price: string;
  };
}

interface OrderDetailsProps {
  order: Order & { items?: OrderItem[] }; // Make items optional
  table: Table;
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

function OrderItemStatus({ status }: { status: string }) {
  const config =
    ITEM_STATUS_CONFIG[status as keyof typeof ITEM_STATUS_CONFIG] ||
    ITEM_STATUS_CONFIG.PENDING;
  const IconComponent = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
    >
      <IconComponent className="w-3 h-3" />
      <span>{config.text}</span>
    </div>
  );
}

export function OrderDetails({ order, table }: OrderDetailsProps) {
  // Check if order is cancelled
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order Details</h3>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Table:</span> {table.number}
        </p>

        {order.specialNotes && (
          <p>
            <span className="font-medium">Special Notes:</span>{" "}
            {order.specialNotes}
          </p>
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold mb-4">Items Ordered</h4>

        {isCancelled ? (
          <div className="text-center py-4 text-gray-500 italic">
            This order has been cancelled.
          </div>
        ) : order.items && order.items.length > 0 ? (
          <>
            <div className="space-y-4">
              {order.items.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex gap-3">
                    {/* Item Image */}
                    <div className="flex-shrink-0">
                      {item.menuItem.image ? (
                        <Image
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden",
                            );
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs text-center px-2">
                            No Image
                          </span>
                        </div>
                      )}
                      {/* Fallback placeholder for failed images */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center hidden">
                        <span className="text-gray-500 text-xs text-center px-2">
                          No Image
                        </span>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{item.menuItem.name}</p>

                          {/* Display variety if it exists */}
                          {item.variety && (
                            <p className="text-sm text-blue-600 font-medium">
                              {item.variety.name}
                            </p>
                          )}
                        </div>
                        <OrderItemStatus status={item.status} />
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {formatNairaWithDecimals(item.price)} ×{" "}
                          {item.quantity}
                        </div>
                        <div className="font-semibold">
                          {formatNairaWithDecimals(
                            Number(item.price) * item.quantity,
                          )}
                        </div>
                      </div>

                      {/* Display item-specific special notes if they exist */}
                      {item.specialNotes && (
                        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                          <span className="font-medium">Note:</span>{" "}
                          {item.specialNotes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>{formatNairaWithDecimals(order.totalAmount)}</span>
              </div>
            </div>

            {/* Order Progress Summary */}
            <OrderItemSummary items={order.items} />
          </>
        ) : (
          <div className="text-center py-4 text-gray-500 italic">
            No items found.
          </div>
        )}
      </div>
    </div>
  );
}
