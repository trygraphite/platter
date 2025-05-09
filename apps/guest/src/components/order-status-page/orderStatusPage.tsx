// components/order/OrderStatusPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@prisma/client";
import { ArrowLeft } from "@platter/ui/lib/icons";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@platter/ui/components/card";
import type { OrderStatusPageProps } from "@/types/order-status";
import { OrderStatusDisplay } from "./order-status";
import { OrderDetails } from "./order-details";
import { OrderActions } from "./order-action";
import { ReviewModal } from "./review-modal";
import ErrorCard from "../shared/error-card";
import useSocketIO from "@platter/ui/hooks/useSocketIO";

export default function OrderStatusPage({
  initialOrder,
  qrId,
  table,
  user,
  socketServerUrl,
}: OrderStatusPageProps) {
  const [order, setOrder] = useState<Order | any>(initialOrder);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const router = useRouter();
  
  // Extract restaurant userId from the order
  const restaurantUserId = initialOrder?.userId;
  
  const serverUrl = socketServerUrl || 
    (typeof window !== 'undefined' ? window.location.origin : '');
  
  // Use the socket hook
  const { socket, isConnected, error } = useSocketIO({
    serverUrl,
    autoConnect: !!serverUrl,
  });

  useEffect(() => {
    // Show review modal only if:
    // 1. Order is delivered
    // 2. No review exists
    // 3. Order wasn't cancelled
    // 4. Modal hasn't been shown before for this order
    if (
      order.status === "DELIVERED" &&
      !order.review &&
      !order.cancelledAt &&
      !hasShownModal
    ) {
      setIsReviewModalOpen(true);
      setHasShownModal(true); // Mark that we've shown the modal
    }
  }, [order.status, order.review, order.cancelledAt, hasShownModal]);

  useEffect(() => {
    if (!socket || !isConnected) return;
    
    console.log(`Joining order room: ${initialOrder.id}`);
    socket.emit('joinOrderRoom', initialOrder.id);
    
    // Order-specific events
    const handleOrderUpdate = (updatedOrder: Order) => {
      console.log('Received order update:', updatedOrder);
      
      // Only update if this is our order
      if (updatedOrder.id === initialOrder.id) {
        setOrder(updatedOrder);
        console.log(`Order ${updatedOrder.id} updated to status: ${updatedOrder.status}`);
      }
    };
    
    const handleOrderDeleted = (deletedId: string) => {
      console.log('Received order deleted event:', deletedId);
      
      if (deletedId === initialOrder.id) {
        setTimeout(() => {
          router.push(`/${qrId}`); 
        }, 3000);
      }
    };
    
    socket.on('orderUpdate', handleOrderUpdate);
    socket.on('orderDeleted', handleOrderDeleted);
    
    return () => {
      socket.off('orderUpdate', handleOrderUpdate);
      socket.off('orderDeleted', handleOrderDeleted);
    };
  }, [socket, isConnected, initialOrder.id, qrId, router]);

  const connectionStatus = isConnected ? (
    <div className="text-xs text-green-600 absolute top-2 right-2">
      ● Live
    </div>
  ) : (
    <div className="text-xs text-amber-600 absolute top-2 right-2">
      ○ Connecting...
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-2 pb-4">
        <div className="container mx-auto px-2 max-w-lg">
          <ErrorCard error={error} />
          <div className="mt-3 text-center">
            <Button size="sm" onClick={() => router.push(`/${qrId}`)}>
              Return to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-2 pb-6">
      <div className="container mx-auto px-2  max-w-lg">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => router.push(`/${qrId}`)}
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          <span className="text-xs">Back to Menu</span>
        </Button>

        <Card className=" relative overflow-hidden">
          {connectionStatus}
          <CardHeader className="py-3 px-3">
            <CardTitle className="text-lg font-medium">Order Status</CardTitle>
            <p className="text-xs text-muted-foreground">
              Order #{order.orderNumber}
            </p>
          </CardHeader>
          <CardContent className="space-y-3 px-3 py-2">
            <OrderStatusDisplay status={order.status} />
            <OrderDetails table={table} order={order} />
          </CardContent>
          <CardFooter className="flex flex-wrap justify-center gap-2 px-3 py-3">
            <OrderActions
              orderId={order.id}
              status={order.status}
              qrId={qrId}
              onStatusChange={(newStatus) =>
                setOrder({ ...order, status: newStatus })
              }
              onNavigate={(path) => router.push(path)}
              socketServerUrl={socketServerUrl}
              restaurantUserId={restaurantUserId}
              order={order}
            />
          </CardFooter>
        </Card>
      </div>

      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          qrId={qrId}
          tableId={table.id}
          userId={user.id}
        />
      )}
    </div>
  );
}