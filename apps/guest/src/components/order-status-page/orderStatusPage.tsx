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

export default function OrderStatusPage({
  initialOrder,
  qrId,
  table,
  user,
}: OrderStatusPageProps) {
  const [order, setOrder] = useState<Order | any>(initialOrder);
  const [error, setError] = useState<string | null>(null);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const router = useRouter();

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
    console.log("Setting up SSE connection");
    console.log(qrId);
    console.log("Initial Order ID:", initialOrder.id);

    let eventSource: EventSource | null = null;
    let retryCount = 0;
    const maxRetries = 3;

    const connectSSE = () => {
      if (retryCount >= maxRetries) {
        setError("Failed to connect after multiple attempts");
        return;
      }

      try {
        // Close existing connection if any
        if (eventSource) {
          eventSource.close();
        }

        const url = `/api/orders/${initialOrder.id}`;
        console.log("Connecting to SSE at:", url);

        eventSource = new EventSource(url);

        eventSource.onopen = () => {
          console.log("SSE connection opened successfully");
          retryCount = 0; // Reset retry count on successful connection
        };

        eventSource.onmessage = (event) => {
          console.log("Received SSE message:", event.data);
          try {
            const data = JSON.parse(event.data);
            if (data.error) {
              console.error("SSE data error:", data.error);
              setError(data.error);
              eventSource?.close();
            } else {
              setOrder(data);
              setError(null); // Clear any previous errors
            }
          } catch (error) {
            console.error("Error parsing SSE message:", error);
          }
        };

        eventSource.onerror = (error) => {
          console.error("SSE connection error:", error);
          eventSource?.close();

          // Attempt to reconnect
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
            setTimeout(connectSSE, 3000 * retryCount); // Exponential backoff
          } else {
            setError("Unable to maintain connection to status updates");
          }
        };
      } catch (error) {
        console.error("Error setting up SSE:", error);
        setError("Failed to connect to status updates");
      }
    };

    // Initial connection
    connectSSE();

    // Cleanup function
    return () => {
      console.log("Cleaning up SSE connection");
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [initialOrder.id]); //

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <ErrorCard error={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push(`/${qrId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Order Status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Order #{order.orderNumber}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <OrderStatusDisplay status={order.status} />
            <OrderDetails table={table} order={order} />
          </CardContent>
          <CardFooter>
            <OrderActions
              orderId={order.id}
              status={order.status}
              qrId={qrId}
              onStatusChange={(newStatus) =>
                setOrder({ ...order, status: newStatus })
              }
              onNavigate={(path) => router.push(path)}
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
