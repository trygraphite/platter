"use client";

import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { ArrowLeft } from "@platter/ui/lib/icons";
import type { Order } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatNairaWithDecimals } from "@/utils";

const statusColors = {
  PENDING: "bg-gray-50 dark:bg-gray-900/30",
  CONFIRMED: "bg-yellow-50 dark:bg-yellow-900/30",
  PREPARING: "bg-blue-50 dark:bg-blue-900/30",
  DELIVERED: "bg-green-50 dark:bg-green-900/30",
  CANCELLED: "bg-red-50 dark:bg-red-900/30",
};

interface OrdersPageProps {
  qrId: string;
  initialOrders: Order[];
  tableId: string;
  tableNumber: string;
}

export function OrdersPage({
  qrId,
  initialOrders,
  tableId,
  tableNumber,
}: OrdersPageProps) {
  const [orders, _setOrders] = useState<Order[]>(initialOrders);
  const router = useRouter();

  //   useEffect(() => {
  //     const fetchOrders = async () => {
  //       try {
  //         const updatedOrders = await viewOrders(userId, tableId);
  //         setOrders(updatedOrders);
  //       } catch (error) {
  //         console.error("Error updating orders:", error);
  //       }
  //     };

  //     const interval = setInterval(fetchOrders, 300000); // Update every 5 minutes
  //     return () => clearInterval(interval);
  //   }, [userId, tableId]);

  const handleOrderClick = (orderId: string) => {
    router.push(`/${qrId}/order-status/${orderId}`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const handleBackToHome = () => {
    router.push(`/${qrId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-transparent"
          onClick={handleBackToHome}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                statusColors[order.status]
              }`}
              onClick={() => handleOrderClick(order.id)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl">Order #{order.orderNumber}</span>
                  <span className="text-sm font-normal">
                    {formatDate(order.createdAt)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-2">Status: {order.status}</p>
                <p className="mb-2">
                  Total: {formatNairaWithDecimals(Number(order.totalAmount))}
                </p>
                {order.specialNotes && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Special Notes: {order.specialNotes}
                  </p>
                )}
                {order.confirmationTime && (
                  <p className="text-sm text-muted-foreground">
                    Confirmation Time: {order.confirmationTime} minutes
                  </p>
                )}
                {order.preparationTime && (
                  <p className="text-sm text-muted-foreground">
                    Preparation Time: {order.preparationTime} minutes
                  </p>
                )}
                {order.deliveryTime && (
                  <p className="text-sm text-muted-foreground">
                    Delivery Time: {order.deliveryTime} minutes
                  </p>
                )}
                {order.totalTime && (
                  <p className="text-sm text-muted-foreground">
                    Total Time: {order.totalTime} minutes
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
          {orders.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">
              No orders found.
            </p>
          )}
        </div>
        <Button
          onClick={() => router.push(`/${qrId}/menu`)}
          className="w-full mt-6"
        >
          Place New Order
        </Button>
      </div>
    </div>
  );
}
