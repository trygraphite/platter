// components/order/OrderStatusPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@prisma/client";
import { ArrowLeft, AlertTriangle, RefreshCw } from "@platter/ui/lib/icons";
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
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const router = useRouter();
  
  // Extract restaurant userId from the order
  const restaurantUserId = initialOrder?.userId;
  
  const serverUrl = socketServerUrl || 
    (typeof window !== 'undefined' ? window.location.origin : '');
  
  // Use the socket hook
  const { socket, isConnected, error, connect } = useSocketIO({
    serverUrl,
    autoConnect: !!serverUrl,
  });

  // Handle connection failure after multiple attempts
  useEffect(() => {
    if (error && connectionAttempts >= 3) {
      setConnectionFailed(true);
    }
  }, [error, connectionAttempts]);

  // Retry connection
  const handleRetryConnection = () => {
    if (socket && !isConnected) {
      setConnectionAttempts(prev => prev + 1);
      setConnectionFailed(false);
      connect();
    }
  };

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
    
    socket.emit('joinOrderRoom', initialOrder.id);
    
    // Order-specific events
    const handleOrderUpdate = (updatedOrder: Order) => {
      // Only update if this is our order
      if (updatedOrder.id === initialOrder.id) {
        setOrder(updatedOrder);
      }
    };
    
    const handleOrderDeleted = (deletedId: string) => {
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

  const renderConnectionStatus = () => {
    if (connectionFailed) {
      return (
        <div className="flex items-center gap-1 text-xs text-red-600 absolute top-2 right-2">
          <AlertTriangle className="h-3 w-3" />
          <span>Offline</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0 ml-1" 
            onClick={handleRetryConnection}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      );
    } else if (isConnected) {
      return (
        <div className="text-xs text-green-600 absolute top-2 right-2">
          ● Live
        </div>
      );
    } else {
      return (
        <div className="text-xs text-amber-600 absolute top-2 right-2">
          ○ Connecting...
        </div>
      );
    }
  };

  // Instead of returning an error screen, we'll show the page but with a notification
  if (error && !connectionFailed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-2 pb-4">
        <div className="container mx-auto px-2 max-w-lg">
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => router.push(`/${qrId}`)}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            <span className="text-xs">Back to Menu</span>
          </Button>
          
          <Card className="mb-3">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Connection Error</p>
                  <p className="text-sm text-muted-foreground">Unable to connect to real-time updates.</p>
                </div>
              </div>
              <Button 
                className="w-full mt-3" 
                size="sm" 
                onClick={handleRetryConnection}
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Retry Connection
              </Button>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-2 pb-6">
      <div className="container mx-auto px-2 max-w-lg">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => router.push(`/${qrId}`)}
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          <span className="text-xs">Back to Menu</span>
        </Button>

        {connectionFailed && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md shadow-sm">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Connection Failed</p>
                <p className="text-sm text-muted-foreground">
                  Unable to establish a connection for real-time updates. 
                  Your order is still valid, but status updates may be delayed.
                </p>
              </div>
            </div>
            <Button 
              className="w-full mt-3" 
              size="sm" 
              onClick={handleRetryConnection}
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Retry Connection
            </Button>
          </div>
        )}

        <Card className="relative overflow-hidden">
          {renderConnectionStatus()}
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