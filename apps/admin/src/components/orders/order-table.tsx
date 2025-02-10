import type { Order, OrderStatus } from "@prisma/client";
import { ChevronDown, ChevronUp, Edit2, Trash2 } from "lucide-react";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@platter/ui/components/table";
import { Button } from "@platter/ui/components/button";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@platter/ui/components/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@platter/ui/components/dialog";

interface OrdersTableProps {
  orders: (Order & {
    tableNumber: string;
    items: {
      quantity: number;
      menuItem: {
        name: string;
        price: number;
      };
    }[];
  })[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

export default function OrdersTable({
  orders,
  onEditOrder,
  onDeleteOrder,
}: OrdersTableProps) {
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(
    new Set(),
  );
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  const toggleOrderExpansion = (orderId: string) => {
    const newExpandedOrders = new Set(expandedOrderIds);
    if (newExpandedOrders.has(orderId)) {
      newExpandedOrders.delete(orderId);
    } else {
      newExpandedOrders.add(orderId);
    }
    setExpandedOrderIds(newExpandedOrders);
  };

  const handleDeleteOrder = () => {
    if (deleteOrderId) {
      onDeleteOrder(deleteOrderId);
      setDeleteOrderId(null);
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "text-yellow-600 bg-yellow-100";
      case "PREPARING":
        return "text-blue-600 bg-blue-100";
      case "DELIVERED":
        return "text-green-600 bg-green-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <TableRow>
                <TableCell>
                  <div className="flex items-center">
                    {order.items.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        {expandedOrderIds.has(order.id) ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </Button>
                    )}
                    <div>
                      <div className="font-medium">
                        Order #{order.orderNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Table: {order.tableNumber}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">
                  {formatNaira(order.totalAmount)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditOrder(order)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteOrderId(order.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {expandedOrderIds.has(order.id) && (
                <TableRow>
                  <TableCell colSpan={5} className="bg-secondary/10 p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Order Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.quantity}x {item.menuItem.name}
                            </span>
                            <span>
                              {formatNaira(item.menuItem.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {order.specialNotes && (
                        <div className="mt-2">
                          <h4 className="font-medium">Special Notes:</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.specialNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteOrderId}
        onOpenChange={() => setDeleteOrderId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOrderId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrder}>
              Delete Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
