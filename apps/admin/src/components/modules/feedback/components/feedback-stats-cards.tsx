"use client";
import AnimatedStatsCard from "@/components/custom/animated-stats-card";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  [key: string]: any; // For other properties
}

interface Complaint {
  id: string;
  createdAt: string | Date;
  [key: string]: any; // For other properties
}

interface FeedbackStatsCardsProps {
  reviews: Review[] | undefined;
  complaints: Complaint[] | undefined;
}

const FeedbackStatsCards = ({
  reviews = [],
  complaints = [],
}: FeedbackStatsCardsProps) => {
  // Calculate stats - with default empty arrays if undefined
  const totalReviews = reviews?.length || 0;
  const totalComplaints = complaints?.length || 0;

  // Calculate average rating from reviews
  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        reviews.length
      : 0;

  // Calculate complaint rate as percentage
  const totalFeedback = totalReviews + totalComplaints;
  const complaintRate =
    totalFeedback > 0 ? (totalComplaints / totalFeedback) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <AnimatedStatsCard
        title="Total Reviews"
        value={totalReviews}
        iconName="Star"
        description="All customer reviews received"
      />

      <AnimatedStatsCard
        title="Total Complaints"
        value={totalComplaints}
        iconName="AlertCircle"
        description="All customer complaints logged"
      />

      <AnimatedStatsCard
        title="Average Rating"
        value={averageRating}
        iconName="BarChart"
        formatType="plain"
        description={`${averageRating.toFixed(1)} out of 5 stars`}
      />

      <AnimatedStatsCard
        title="Complaint Rate"
        value={complaintRate}
        iconName="PieChart"
        formatType="plain"
        suffix="%"
        description={`${complaintRate.toFixed(1)}% of total feedback`}
      />
    </div>
  );
};

export default FeedbackStatsCards;
