// components/order/OrderActions.tsx
import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { Button } from "@platter/ui/components/button";
import { XCircle, RefreshCcw } from "@platter/ui/lib/icons";
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
import { toast } from "@platter/ui/components/sonner";
import { cancelOrder } from "@/app/actions/cancel-order";
// import { cancelOrder } from "@/actions/cancel-order";

interface OrderActionsProps {
  orderId: string;
  status: OrderStatus;
  qrId: string;
  onStatusChange: (newStatus: OrderStatus) => void;
  onNavigate: (path: string) => void;
}

export function OrderActions({
  orderId,
  status,
  qrId,
  onStatusChange,
  onNavigate,
}: OrderActionsProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelOrder(orderId);
      if (result.success) {
        onStatusChange(OrderStatus.CANCELLED);
        toast.success("Order cancelled successfully");
      } else {
        toast.error(result.error || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("An error occurred while cancelling the order");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex justify-between p-6">
      {(status === OrderStatus.PENDING || status === OrderStatus.CONFIRMED) && (
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
      <Button variant="outline" onClick={() => onNavigate(`/${qrId}/menu`)}>
        Place Another Order
      </Button>
    </div>
  );
}
