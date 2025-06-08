// components/order/OrderDetails.tsx

import { formatNairaWithDecimals } from "@/utils";
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
                  <div className="flex-1">
                    <p className="font-medium">{item.menuItem.name}</p>
                    
                    {/* Display variety if it exists */}
                    {item.variety && (
                      <p className="text-sm text-blue-600 font-medium">
                        {item.variety.name}
                      </p>
                    )}
                    
                    <p className="text-sm text-muted-foreground">
                      {formatNairaWithDecimals(item.price)} × {item.quantity}
                    </p>
                    
                    {/* Display item-specific special notes if they exist */}
                    {item.specialNotes && (
                      <p className="text-sm text-orange-600 italic mt-1">
                        Note: {item.specialNotes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatNairaWithDecimals(Number(item.price) * item.quantity)}
                    </p>
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