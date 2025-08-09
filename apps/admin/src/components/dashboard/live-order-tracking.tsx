"use client";

import { Badge } from "@platter/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import type { Order } from "@prisma/client";
import React from "react";

interface LiveOrderTrackingProps extends React.ComponentProps<typeof Card> {
  orders: Order[];
}

export function LiveOrderTracking({
  orders,
  className,
}: LiveOrderTrackingProps) {
  const [liveOrders, _setLiveOrders] = React.useState<Order[]>([]);

  // React.useEffect(() => {
  //   setLiveOrders(orders.slice(-5));

  //   // Simulating live updates
  //   const interval = setInterval(() => {
  //     setLiveOrders((prev) => {
  //       const newOrder = {
  //         ...orders[Math.floor(Math.random() * orders.length)],
  //         id: Math.random().toString(36).substr(2, 9),
  //         createdAt: new Date(),
  //       };
  //       return [...prev.slice(-4), newOrder];
  //     });
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [orders]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Live Order Tracking</CardTitle>
        <CardDescription>Real-time updates on order statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {liveOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Order #{order.orderNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  Table {order.tableId}
                </p>
              </div>
              <Badge
                variant={
                  order.status === "CONFIRMED"
                    ? "default"
                    : order.status === "PREPARING"
                      ? "secondary"
                      : "default"
                }
              >
                {order.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
