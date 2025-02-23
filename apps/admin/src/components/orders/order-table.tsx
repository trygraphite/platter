import type { Order, OrderStatus } from "@prisma/client";
import { ChevronDown, ChevronUp, ClipboardIcon, Edit2, PackageIcon, Trash2 } from "lucide-react";
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
                      <div className=" text-muted-foreground">
                        {order.orderType === "TABLE"
                          ? `Table: ${order.tableNumber || "N/A"}`
                          : "Pickup Order"}
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
                  <TableCell colSpan={5} className="p-0">
                    <div className="bg-secondary/10 border-t-2 border-primary/20 p-4">
                      <div className="space-y-4">
                        {/* Order Items Section */}
                        <div className="rounded-lg bg-background p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <PackageIcon className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold text-base">
                              Order Details
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-sm">
                                    {item.quantity}x
                                  </span>
                                  <span className="text-sm">
                                    {item.menuItem.name}
                                  </span>
                                </div>
                                <span className="font-medium text-sm">
                                  {formatNaira(
                                    item.menuItem.price * item.quantity,
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Special Notes Section */}
                        {order.specialNotes && (
                          <div className="rounded-lg bg-background p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <ClipboardIcon className="h-5 w-5 text-primary" />
                              <h4 className="font-semibold text-base">
                                Special Instructions
                              </h4>
                            </div>
                            <div className="p-3 bg-blue-50/30 rounded-md border border-blue-100">
                              <p className="text-sm text-foreground/80 leading-relaxed">
                                {order.specialNotes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
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
