import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";
import type { Order } from "@prisma/client";

interface OverviewProps {
  orders: Order[];
}

export function Overview({ orders }: OverviewProps) {
    const deliveredOrders = orders.filter((order) => order.status === "DELIVERED");

  const totalRevenue = deliveredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );
  const totalOrders = orders.length;
  // const uniqueCustomers = new Set(orders.map((order) => order.userId)).size;
  // DISPLAY TOTAL NUMBER OF SCANS
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const items = [
    {
      title: "Total Revenue",
      icon: DollarSign,
      content: `₦${totalRevenue.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      description: "Total revenue from all orders",
    },
    // DISPLAY NUMBER OF TOTAL SCANS HERE
    // {
    //   title: "Unique Customers",
    //   icon: Users,
    //   content: uniqueCustomers.toString(),
    //   description: "Number of unique customers",
    // },
    {
      title: "Total Orders",
      icon: ShoppingCart,
      content: totalOrders.toString(),
      description: "Total number of orders",
    },
    {
      title: "Average Order Value",
      icon: TrendingUp,
      content: `₦${averageOrderValue.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      description: "Average value per order",
    },
  ];

  return (
    <>
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.content}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
