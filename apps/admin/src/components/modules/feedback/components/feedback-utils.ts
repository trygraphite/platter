import { format, subDays, isAfter, startOfDay, parseISO, addWeeks, addMonths, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from 'date-fns';

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

export function processFeedbackData(
  reviews: Review[] = [], 
  complaints: Complaint[] = [], 
  timeFilter: 'daily' | 'weekly' | 'monthly'
) {
  const today = new Date();
  let cutoffDate;
  let dateFormat;
  
  // Determine date parameters based on timeFilter
  if (timeFilter === 'daily') {
    cutoffDate = subDays(today, 7); // Last 7 days
    dateFormat = 'EEEE'; // Full weekday name
  } else if (timeFilter === 'weekly') {
    cutoffDate = subDays(today, 30); // Last 30 days
    dateFormat = 'MMM dd'; // Month abbreviation + day
  } else {
    cutoffDate = subDays(today, 90); // Last 3 months
    dateFormat = 'MMM'; // Month abbreviation
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
  
  // Generate data points with date bins
  const dateMap = new Map();
  
  // Initialize date bins
  if (timeFilter === 'daily') {
    // Daily view - days of the week
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
    let currentWeekStart = startOfWeek(startDate);
    
    while (isAfter(today, currentWeekStart)) {
      const weekLabel = `${format(currentWeekStart, 'MMM dd')} - ${format(endOfWeek(currentWeekStart), 'MMM dd')}`;
      dateMap.set(weekLabel, { date: weekLabel, reviews: 0, complaints: 0, weekStart: new Date(currentWeekStart) });
      currentWeekStart = addWeeks(currentWeekStart, 1);
    }
  } else {
    // Monthly view
    let currentMonth = startOfMonth(startDate);
    while (isAfter(today, currentMonth)) {
      const monthStr = format(currentMonth, dateFormat);
      dateMap.set(monthStr, { date: monthStr, reviews: 0, complaints: 0, monthStart: new Date(currentMonth) });
      currentMonth = addMonths(currentMonth, 1);
    }
  }
  
  // Count reviews by date bin
  countItemsByDate(filteredReviews, dateMap, 'reviews', timeFilter);
  
  // Count complaints by date bin
  countItemsByDate(filteredComplaints, dateMap, 'complaints', timeFilter);
  
  // Convert map to array and sort
  let result = Array.from(dateMap.values());
  
  // Sort by date
  if (timeFilter === 'daily') {
    result.sort((a, b) => a.originalDate - b.originalDate);
  } else if (timeFilter === 'weekly') {
    result.sort((a, b) => a.weekStart - b.weekStart);
  } else {
    // For monthly, sort by month order
    const monthOrder: Record<string, number> = { 
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 
    };
    result.sort((a, b) => {
      // Use type assertion or ensure safe access with default value
      const aMonth = a.date as string;
      const bMonth = b.date as string;
      return (monthOrder[aMonth] || 0) - (monthOrder[bMonth] || 0);
    });
  }
  
  // Calculate totals and percentages
  const totalReviews = result.reduce((sum, item) => sum + item.reviews, 0);
  const totalComplaints = result.reduce((sum, item) => sum + item.complaints, 0);
  
  const reviewsPercentage = (totalReviews === 0 && totalComplaints === 0) 
    ? 0 
    : Math.round((totalReviews / (totalReviews + totalComplaints)) * 100);
  
  // Get timeframe text
  const timeframeText = 
    timeFilter === 'daily' ? 'Last 7 days' : 
    timeFilter === 'weekly' ? 'Last 30 days' : 
    'Last 90 days';
  
  return {
    filteredData: result,
    totalReviews,
    totalComplaints,
    reviewsPercentage,
    timeframeText
  };
}

// Helper function to count items by date bin
function countItemsByDate(
  items: Array<Review | Complaint>, 
  dateMap: Map<string, { date: string; reviews: number; complaints: number; [key: string]: any }>, 
  itemType: 'reviews' | 'complaints', 
  timeFilter: string
) {
  items.forEach(item => {
    if (!item?.createdAt) return;
    const itemDate = typeof item.createdAt === 'string' ? parseISO(item.createdAt) : item.createdAt;
    
    if (timeFilter === 'daily') {
      const dateStr = format(itemDate, 'EEEE');
      if (dateMap.has(dateStr)) {
        const entry = dateMap.get(dateStr);
        if (entry) {
          entry[itemType] += 1;
          dateMap.set(dateStr, entry);
        }
      }
    } else if (timeFilter === 'weekly') {
      // Find the week this item belongs to
      for (const [key, value] of dateMap.entries()) {
        const weekStart = value.weekStart;
        const weekEnd = endOfWeek(weekStart);
        if (itemDate >= weekStart && itemDate <= weekEnd) {
          value[itemType] += 1;
          break;
        }
      }
    } else {
      // Monthly view
      const monthStr = format(itemDate, 'MMM');
      if (dateMap.has(monthStr)) {
        const entry = dateMap.get(monthStr);
        if (entry) {
          entry[itemType] += 1;
          dateMap.set(monthStr, entry);
        }
      }
    }
  });
}

// Helper function for date comparison
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}