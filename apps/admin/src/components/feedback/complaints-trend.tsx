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

interface ComplaintsTrendProps extends React.ComponentProps<typeof Card> {
  complaints: Array<{ createdAt: Date }>;
}

export function ComplaintsTrend({
  complaints,
  className,
}: ComplaintsTrendProps) {
  const data = React.useMemo(() => {
    const complaintsByMonth: { [key: string]: number } = {};
    for (const complaint of complaints) {
      const month = new Date(complaint.createdAt).toLocaleString("default", {
        month: "short",
      });
      complaintsByMonth[month] = (complaintsByMonth[month] || 0) + 1;
    }
    return Object.entries(complaintsByMonth).map(([name, count]) => ({
      name,
      count,
    }));
  }, [complaints]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Complaints Trend</CardTitle>
        <CardDescription>Monthly trend of customer complaints</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            count: {
              label: "Complaints",
              color: "hsl(var(--chart-2))",
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
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="count"
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

