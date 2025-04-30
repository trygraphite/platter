"use client";
import React, { useState, useMemo } from 'react';
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "@platter/ui/lib/charts";
import { format, subDays, isAfter, startOfDay, parseISO, isSameDay, addWeeks, addMonths, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from 'date-fns';
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

interface FeedbackLineChartProps {
  reviews: Review[] | undefined;
  complaints: Complaint[] | undefined;
}

const FeedbackLineChart = ({ reviews = [], complaints = [] }: FeedbackLineChartProps) => {
  const [timeFilter, setTimeFilter] = useState('daily');
  
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
  
  const filteredData = useMemo(() => {
    const today = new Date();
    let cutoffDate;
    let dateFormat;
    
    if (timeFilter === 'daily') {
      cutoffDate = subDays(today, 7); // Last 7 days
      dateFormat = 'EEEE'; // Full weekday name (Monday, Tuesday, etc.)
    } else if (timeFilter === 'weekly') {
      cutoffDate = subDays(today, 30); // Last 30 days
      dateFormat = 'MMM dd'; // Month abbreviation + day number
    } else {
      cutoffDate = subDays(today, 90); // Last 3 months
      dateFormat = 'MMM'; // Month abbreviation only (Jan, Feb, etc.)
    }
    
    const startDate = startOfDay(cutoffDate);
    
    // Filter reviews and complaints by date
    const filteredReviews = reviews.filter(review => {
      if (!review?.createdAt) return false;
      const reviewDate = typeof review.createdAt === 'string' ? parseISO(review.createdAt) : review.createdAt;
      return isAfter(reviewDate, startDate);
    });
    
    const filteredComplaints = complaints.filter(complaint => {
      if (!complaint?.createdAt) return false;
      const complaintDate = typeof complaint.createdAt === 'string' ? parseISO(complaint.createdAt) : complaint.createdAt;
      return isAfter(complaintDate, startDate);
    });
    
    // Generate data points
    const dateMap = new Map();
    
    // Initialize the map with all dates based on the timeFilter
    if (timeFilter === 'daily') {
      // Daily view - show days of the week
      let currentDate = startDate;
      while (!isSameDay(currentDate, today)) {
        const dateStr = format(currentDate, dateFormat);
        dateMap.set(dateStr, { date: dateStr, reviews: 0, complaints: 0, originalDate: new Date(currentDate) });
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
      // Add today
      const todayStr = format(today, dateFormat);
      dateMap.set(todayStr, { date: todayStr, reviews: 0, complaints: 0, originalDate: new Date(today) });
    } else if (timeFilter === 'weekly') {
      // Weekly view - group by weeks
      const weekMap = new Map();
      let currentWeekStart = startOfWeek(startDate);
      
      while (isAfter(today, currentWeekStart)) {
        const weekLabel = `${format(currentWeekStart, 'MMM dd')} - ${format(endOfWeek(currentWeekStart), 'MMM dd')}`;
        weekMap.set(weekLabel, { date: weekLabel, reviews: 0, complaints: 0, weekStart: new Date(currentWeekStart) });
        currentWeekStart = addWeeks(currentWeekStart, 1);
      }
      
      // Now update the dateMap with week data
      for (const [key, value] of weekMap.entries()) {
        dateMap.set(key, value);
      }
    } else {
      // Monthly view - show month names (Jan, Feb, etc.)
      let currentMonth = startOfMonth(startDate);
      while (isAfter(today, currentMonth)) {
        const monthStr = format(currentMonth, dateFormat);
        dateMap.set(monthStr, { date: monthStr, reviews: 0, complaints: 0, monthStart: new Date(currentMonth) });
        currentMonth = addMonths(currentMonth, 1);
      }
    }
    
    // Count reviews by date
    filteredReviews.forEach(review => {
      if (!review?.createdAt) return;
      const reviewDate = typeof review.createdAt === 'string' ? parseISO(review.createdAt) : review.createdAt;
      
      if (timeFilter === 'daily') {
        const dateStr = format(reviewDate, dateFormat);
        if (dateMap.has(dateStr)) {
          const entry = dateMap.get(dateStr);
          entry.reviews += 1;
          dateMap.set(dateStr, entry);
        }
      } else if (timeFilter === 'weekly') {
        // Find the week this review belongs to
        for (const [key, value] of dateMap.entries()) {
          const weekStart = value.weekStart;
          const weekEnd = endOfWeek(weekStart);
          if (reviewDate >= weekStart && reviewDate <= weekEnd) {
            value.reviews += 1;
            break;
          }
        }
      } else {
        // Monthly view
        const monthStr = format(reviewDate, dateFormat);
        if (dateMap.has(monthStr)) {
          const entry = dateMap.get(monthStr);
          entry.reviews += 1;
          dateMap.set(monthStr, entry);
        }
      }
    });
    
    // Count complaints by date
    filteredComplaints.forEach(complaint => {
      if (!complaint?.createdAt) return;
      const complaintDate = typeof complaint.createdAt === 'string' ? parseISO(complaint.createdAt) : complaint.createdAt;
      
      if (timeFilter === 'daily') {
        const dateStr = format(complaintDate, dateFormat);
        if (dateMap.has(dateStr)) {
          const entry = dateMap.get(dateStr);
          entry.complaints += 1;
          dateMap.set(dateStr, entry);
        }
      } else if (timeFilter === 'weekly') {
        // Find the week this complaint belongs to
        for (const [key, value] of dateMap.entries()) {
          const weekStart = value.weekStart;
          const weekEnd = endOfWeek(weekStart);
          if (complaintDate >= weekStart && complaintDate <= weekEnd) {
            value.complaints += 1;
            break;
          }
        }
      } else {
        // Monthly view
        const monthStr = format(complaintDate, dateFormat);
        if (dateMap.has(monthStr)) {
          const entry = dateMap.get(monthStr);
          entry.complaints += 1;
          dateMap.set(monthStr, entry);
        }
      }
    });
    
    // Convert map to array and sort
    let result = Array.from(dateMap.values());
    
    // Sort by date if we have originalDate or other sort fields
    if (timeFilter === 'daily') {
      result.sort((a, b) => a.originalDate - b.originalDate);
    } else if (timeFilter === 'weekly') {
      result.sort((a, b) => a.weekStart - b.weekStart);
    } else {
      // For monthly, we can just sort alphabetically since months are Jan-Dec
      const monthOrder = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 
                          'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
      result.sort((a, b) => monthOrder[a.date] - monthOrder[b.date]);
    }
    
    return result;
  }, [reviews, complaints, timeFilter]);

  // Calculate totals for the footer
  const totalReviews = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.reviews, 0);
  }, [filteredData]);

  const totalComplaints = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.complaints, 0);
  }, [filteredData]);

  // Calculate percentage change for trend
  const reviewsPercentage = useMemo(() => {
    if (totalReviews === 0 && totalComplaints === 0) return 0;
    return Math.round((totalReviews / (totalReviews + totalComplaints)) * 100);
  }, [totalReviews, totalComplaints]);

  // Get timeframe text for the footer
  const timeframeText = useMemo(() => {
    switch (timeFilter) {
      case 'daily':
        return 'Last 7 days';
      case 'weekly':
        return 'Last 30 days';
      case 'monthly':
        return 'Last 90 days';
      default:
        return 'Last 7 days';
    }
  }, [timeFilter]);
  
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
            accessibilityLayer
            data={filteredData}
            width="100%"
            height={300}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Limit length for x-axis labels
                if (timeFilter === 'daily') {
                  return value.slice(0, 3); // First 3 letters of day (Mon, Tue, etc.)
                } else if (timeFilter === 'weekly') {
                  return value.slice(0, 6); // First part of week range
                }
                return value; // Month names are already short (Jan, Feb, etc.)
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