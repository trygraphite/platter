// components/order/OrderDetails.tsx

import { Order, Table } from "@platter/db/client";

interface OrderDetailsProps {
  order: Order & { items?: any[] };  // Make items optional
  table: Table;
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
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.menuItem.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ₦{Number(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₦{(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>₦{Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
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