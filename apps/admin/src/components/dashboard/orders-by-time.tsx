"use client";

import React from "react";
import {
  Bar,
  BarChart,
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

interface OrdersByTimeChartProps extends React.ComponentProps<typeof Card> {
  orders: Order[];
}

export function OrdersByTimeChart({
  orders,
  className,
}: OrdersByTimeChartProps) {
  const data = React.useMemo(() => {
    const ordersByHour: { [key: string]: number } = {};
    for (const order of orders) {
      const hour = new Date(order.createdAt).getHours();
      const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
      ordersByHour[timeSlot] = (ordersByHour[timeSlot] || 0) + 1;
    }
    return Object.entries(ordersByHour).map(([name, total]) => ({
      name,
      total,
    }));
  }, [orders]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Orders by Time of Day</CardTitle>
        <CardDescription>
          Number of orders placed during each time period
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            total: {
              label: "Orders",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
