import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@platter/ui/components/alert-dialog";
import { Button } from "@platter/ui/components/button";
import { toast } from "@platter/ui/components/sonner";
import useSocketIO from "@platter/ui/hooks/useSocketIO";
import { Edit, RefreshCcw, XCircle } from "@platter/ui/lib/icons";
import { OrderStatus } from "@prisma/client";
// components/order/OrderActions.tsx
import { useState } from "react";
import { cancelOrder } from "@/app/actions/cancel-order";

interface OrderActionsProps {
  orderId: string;
  status: OrderStatus;
  qrId: string;
  onStatusChange: (newStatus: OrderStatus) => void;
  onNavigate: (path: string) => void;
  socketServerUrl?: string;
  restaurantUserId?: string; // Add userId for the restaurant owner
  order: any; // The full order object
  onOrderModified?: (updatedOrder: any) => void;
}

export function OrderActions({
  orderId,
  status,
  qrId,
  onStatusChange,
  onNavigate,
  socketServerUrl,
  restaurantUserId,
  order,
  onOrderModified,
}: OrderActionsProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  // Get server URL - same approach as in OrderStatusPage
  const serverUrl =
    socketServerUrl ||
    (typeof window !== "undefined" ? window.location.origin : "");

  // Use the socket hook
  const { socket, isConnected } = useSocketIO({
    serverUrl,
    autoConnect: !!serverUrl,
  });

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelOrder(orderId);
      if (result.success) {
        // Update local state
        onStatusChange(OrderStatus.CANCELLED);

        // Emit socket event for order cancellation with restaurant userId
        if (socket && isConnected) {
          socket.emit("updateOrder", {
            id: orderId,
            status: OrderStatus.CANCELLED,
            cancelledAt: new Date().toISOString(),
            userId: restaurantUserId,
            orderNumber: order.orderNumber,
          });
        }

        toast.success("Order cancelled successfully");
      } else {
        toast.error(result.error || "Failed to cancel order");
      }
    } catch (_error) {
      toast.error("An error occurred while cancelling the order");
    } finally {
      setIsCancelling(false);
    }
  };

  const _handleOrderModified = (updatedOrder: any) => {
    // Update local state with the modified order
    onStatusChange(updatedOrder.status);

    // Call parent handler if provided
    if (onOrderModified) {
      onOrderModified(updatedOrder);
    }

    // Emit socket event for order modification
    if (socket && isConnected) {
      socket.emit("updateOrder", {
        id: orderId,
        status: updatedOrder.status,
        userId: restaurantUserId,
        orderNumber: order.orderNumber,
        items: updatedOrder.items,
        totalAmount: updatedOrder.totalAmount,
        specialNotes: updatedOrder.specialNotes,
      });
    }
  };

  // Check if order can be modified (only PENDING or CONFIRMED orders)
  const canModify =
    status === OrderStatus.PENDING || status === OrderStatus.CONFIRMED;

  return (
    <div className="flex justify-between gap-2 p-6">
      {canModify && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isCancelling}>
              {isCancelling ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Order
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to cancel this order?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Your order will be cancelled and
                you will need to place a new order if you change your mind.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, keep my order</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelOrder}>
                Yes, cancel my order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {canModify ? (
        <Button
          variant="outline"
          onClick={() => {
            // Store the complete order data for modification
            const orderData = {
              orderId: order.id,
              order: order, // Store the complete order object
              specialNotes: order.specialNotes,
              totalAmount: order.totalAmount,
            };

            // Store order data in sessionStorage for menu page to access
            sessionStorage.setItem(
              "modifyOrderData",
              JSON.stringify(orderData),
            );
            onNavigate(`/${qrId}/menu`);
          }}
          className="flex-1"
        >
          <Edit className="mr-2 h-4 w-4" />
          Modify Order
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => onNavigate(`/${qrId}/menu`)}
          className="flex-1"
        >
          Place Another Order
        </Button>
      )}
    </div>
  );
}
