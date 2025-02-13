"use client";

import React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "@platter/ui/lib/charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@platter/ui/components/chart";
import type { Order } from "@prisma/client";

interface RevenueChartProps extends React.ComponentProps<typeof Card> {
  orders: Order[];
}

export function RevenueChart({ orders, className }: RevenueChartProps) {
  const data = React.useMemo(() => {
    const revenueByMonth: { [key: string]: number } = {};
    for (const order of orders) {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
      });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + order.totalAmount;
    }
    return Object.entries(revenueByMonth).map(([name, total]) => ({
      name,
      total,
    }));
  }, [orders]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
        <CardDescription>Monthly revenue based on orders</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            total: {
              label: "Revenue",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="total"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
