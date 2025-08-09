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
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "@platter/ui/lib/charts";
import React from "react";

interface RatingsDistributionProps extends React.ComponentProps<typeof Card> {
  reviews: Array<{ rating: number }>;
}

export function RatingsDistribution({
  reviews,
  className,
}: RatingsDistributionProps) {
  const data = React.useMemo(() => {
    const distribution = [0, 0, 0, 0, 0];

    for (const review of reviews) {
      if (review.rating && review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1] =
          (distribution[review.rating - 1] || 0) + 1;
      }
    }

    return [1, 2, 3, 4, 5].map((rating) => ({
      rating: rating.toString(),
      count: distribution[rating - 1],
    }));
  }, [reviews]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ratings Distribution</CardTitle>
        <CardDescription>Distribution of customer ratings</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            count: {
              label: "Count",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="rating"
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
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
