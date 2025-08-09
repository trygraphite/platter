"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "@platter/ui/lib/charts";
import type { Order } from "@prisma/client";
import { TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

interface RevenueChartProps extends React.ComponentProps<typeof Card> {
  orders: Order[];
}

type TimeFrame = "last7days" | "monthly" | "yearly";

export function RevenueChart({ orders, className }: RevenueChartProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("monthly");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );

  const years = useMemo(() => {
    // Get unique years from orders
    const yearsSet = new Set(
      orders.map((order) => new Date(order.createdAt).getFullYear().toString()),
    );
    return Array.from(yearsSet).sort();
  }, [orders]);

  const data = useMemo(() => {
    const currentDate = new Date();
    const revenueByPeriod: { [key: string]: number } = {};

    // Filter orders based on selected year if in yearly view
    const filteredOrders =
      timeFrame === "yearly"
        ? orders.filter(
            (order) =>
              new Date(order.createdAt).getFullYear().toString() ===
              selectedYear,
          )
        : orders;

    for (const order of filteredOrders) {
      const orderDate = new Date(order.createdAt);
      let periodKey: string;

      if (timeFrame === "last7days") {
        // For last 7 days, use day of week names
        const daysAgo = Math.floor(
          (currentDate.getTime() - orderDate.getTime()) / (24 * 60 * 60 * 1000),
        );

        // Only process orders from the last 7 days
        if (daysAgo >= 0 && daysAgo < 7) {
          const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          periodKey = dayNames[orderDate.getDay()] as string;

          revenueByPeriod[periodKey] =
            (revenueByPeriod[periodKey] || 0) + order.totalAmount;
        }
        continue;
      } else if (timeFrame === "monthly") {
        periodKey = orderDate.toLocaleString("default", { month: "short" });
      } else {
        // Yearly view shows months within the selected year
        periodKey = orderDate.toLocaleString("default", { month: "short" });
      }

      revenueByPeriod[periodKey] =
        (revenueByPeriod[periodKey] || 0) + order.totalAmount;
    }

    // For last 7 days, ensure all days are represented in correct order
    if (timeFrame === "last7days") {
      const orderedData = [];
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const today = currentDate.getDay();

      // Start from 6 days ago to today
      for (let i = 6; i >= 0; i--) {
        const dayIndex = (today - i + 7) % 7; // Calculate the day of week
        const dayName = dayNames[dayIndex];
        orderedData.push({
          name: dayName,
          total: revenueByPeriod[dayName as keyof typeof revenueByPeriod] || 0,
        });
      }

      return orderedData;
    }

    return Object.entries(revenueByPeriod).map(([name, total]) => ({
      name,
      total,
    }));
  }, [orders, timeFrame, selectedYear]);

  // Calculate comparison with previous period
  const comparisonStat = useMemo(() => {
    if (orders.length === 0) return { percentage: 0, isIncrease: true };

    let currentPeriodTotal = 0;
    let previousPeriodTotal = 0;
    const now = new Date();

    if (timeFrame === "last7days") {
      // Last 7 days vs previous 7 days
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      const fourteenDaysAgo = new Date(now);
      fourteenDaysAgo.setDate(now.getDate() - 14);

      currentPeriodTotal = orders
        .filter((order) => {
          const date = new Date(order.createdAt);
          return date >= sevenDaysAgo && date <= now;
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);

      previousPeriodTotal = orders
        .filter((order) => {
          const date = new Date(order.createdAt);
          return date >= fourteenDaysAgo && date < sevenDaysAgo;
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);
    } else if (timeFrame === "monthly") {
      // Current month vs previous month
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      currentPeriodTotal = orders
        .filter((order) => {
          const date = new Date(order.createdAt);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);

      previousPeriodTotal = orders
        .filter((order) => {
          const date = new Date(order.createdAt);
          return (
            date.getMonth() === previousMonth &&
            date.getFullYear() === previousYear
          );
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);
    } else {
      // Current year vs previous year
      const currentYear = parseInt(selectedYear);

      currentPeriodTotal = orders
        .filter(
          (order) => new Date(order.createdAt).getFullYear() === currentYear,
        )
        .reduce((sum, order) => sum + order.totalAmount, 0);

      previousPeriodTotal = orders
        .filter(
          (order) =>
            new Date(order.createdAt).getFullYear() === currentYear - 1,
        )
        .reduce((sum, order) => sum + order.totalAmount, 0);
    }

    // Calculate percentage change
    const percentage =
      previousPeriodTotal === 0
        ? 100 // If previous period had 0 revenue, consider it 100% increase
        : ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) *
          100;

    return {
      percentage: Math.abs(Math.round(percentage * 10) / 10), // Round to 1 decimal place
      isIncrease: percentage >= 0,
    };
  }, [orders, timeFrame, selectedYear]);

  const getTimeFrameDescription = () => {
    switch (timeFrame) {
      case "last7days":
        return "Revenue for the last 7 days";
      case "monthly":
        return "Monthly revenue based on orders";
      case "yearly":
        return `Monthly revenue for ${selectedYear}`;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>{getTimeFrameDescription()}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={timeFrame}
            onValueChange={(value) => setTimeFrame(value as TimeFrame)}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Time Frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          {timeFrame === "yearly" && (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            total: {
              label: "Revenue",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-64 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} width={500} height={300}>
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
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="total"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                dot={{ strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={1500}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 flex items-center">
          {comparisonStat.isIncrease ? (
            <TrendingUp className="mr-1 text-green-500" size={18} />
          ) : (
            <TrendingDown className="mr-1 text-red-500" size={18} />
          )}
          <p
            className={
              comparisonStat.isIncrease ? "text-green-500" : "text-red-500"
            }
          >
            {comparisonStat.isIncrease ? "+" : "-"}
            {comparisonStat.percentage}%{" "}
            {timeFrame === "last7days"
              ? "compared to previous 7 days"
              : timeFrame === "monthly"
                ? "compared to previous month"
                : "compared to previous year"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
