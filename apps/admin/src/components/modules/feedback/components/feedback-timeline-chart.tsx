"use client";
import React, { useState } from 'react';
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "@platter/ui/lib/charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@platter/ui/components/chart";
import { processFeedbackData } from './feedback-utils';
interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

interface Complaint {
  id: string;
  createdAt: string | Date;
}

interface FeedbackLineChartProps {
  reviews: Review[] | undefined;
  complaints: Complaint[] | undefined;
}

const FeedbackLineChart = ({ reviews = [], complaints = [] }: FeedbackLineChartProps) => {
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const chartConfig = {
    reviews: {
      label: "Reviews",
      color: "hsl(var(--chart-1))",
    },
    complaints: {
      label: "Complaints",
      color: "hsl(var(--chart-2))",
    }
  } satisfies ChartConfig;
  
  // Process data using utility function
  const { 
    filteredData, 
    totalReviews, 
    totalComplaints, 
    reviewsPercentage, 
    timeframeText 
  } = processFeedbackData(reviews, complaints, timeFilter);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Feedback Timeline</CardTitle>
            <CardDescription>Showing feedback over time</CardDescription>
          </div>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 text-xs rounded-md ${timeFilter === 'daily' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setTimeFilter('daily')}
            >
              Daily
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded-md ${timeFilter === 'weekly' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setTimeFilter('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded-md ${timeFilter === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setTimeFilter('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={filteredData}
            width={800}
            height={300}
            margin={{ left: 12, right: 12, top: 5, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Simplify x-axis labels
                if (timeFilter === 'daily') {
                  return value.slice(0, 3); // First 3 letters of day
                } else if (timeFilter === 'weekly') {
                  return value.slice(0, 6); // First part of week range
                }
                return value; // Month abbreviations
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="reviews"
              type="monotone"
              fill="var(--color-reviews)"
              fillOpacity={0.4}
              stroke="var(--color-reviews)"
              stackId="a"
            />
            <Area
              dataKey="complaints"
              type="monotone"
              fill="var(--color-complaints)"
              fillOpacity={0.4}
              stroke="var(--color-complaints)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {totalReviews > totalComplaints ? (
                <>
                  Positive trend: {reviewsPercentage}% reviews <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              ) : (
                <>
                  {totalComplaints > 0 ? `${100 - reviewsPercentage}% complaints` : 'No feedback data'}
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {timeframeText} • Reviews: {totalReviews} • Complaints: {totalComplaints}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FeedbackLineChart;