"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@platter/ui/components/chart";
import { LabelList, Pie, PieChart } from "@platter/ui/lib/charts";
import { TrendingUp } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  [key: string]: any;
}

interface Complaint {
  id: string;
  createdAt: string | Date;
  [key: string]: any;
}

interface FeedbackPieChartProps {
  reviews: Review[] | undefined;
  complaints: Complaint[] | undefined;
}

const FeedbackPieChart = ({
  reviews = [],
  complaints = [],
}: FeedbackPieChartProps) => {
  const totalReviews = reviews?.length || 0;
  const totalComplaints = complaints?.length || 0;

  const chartData = [
    { name: "Reviews", value: totalReviews, fill: "hsl(var(--chart-1))" },
    { name: "Complaints", value: totalComplaints, fill: "hsl(var(--chart-2))" },
  ];

  const chartConfig = {
    value: {
      label: "Count",
    },
    Reviews: {
      label: "Reviews",
      color: "hsl(var(--chart-1))",
    },
    Complaints: {
      label: "Complaints",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Feedback Distribution</CardTitle>
        <CardDescription>Reviews vs Complaints</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="value" />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              <LabelList
                dataKey="name"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Feedback: {totalReviews + totalComplaints}
          {totalReviews > totalComplaints && (
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 ml-2" />
              More positive feedback
            </div>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing distribution between reviews and complaints
        </div>
      </CardFooter>
    </Card>
  );
};

export default FeedbackPieChart;
