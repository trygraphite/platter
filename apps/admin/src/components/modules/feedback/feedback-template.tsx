import db from "@platter/db";
import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import getServerSession from "@/lib/auth/server";
import FeedbackPieChart from "./components/feedback-pie-chart";
import { CustomerComplaintsTable } from "./components/feedback-recent-complaints";
import { FeedBackCustomerReviewsTable } from "./components/feedback-review-table";
import FeedbackStatsCards from "./components/feedback-stats-cards";
import FeedbackLineChart from "./components/feedback-timeline-chart";

export const metadata: Metadata = {
  title: "Customer Feedback | Platter Admin",
  description: "Customer reviews and complaints for Platter",
};

export default async function FeedbackTemplatePage() {
  const session = await getServerSession();
  const userId = session?.session?.userId;

  const [reviews, complaints] = await Promise.all([
    db.review.findMany({
      where: { userId },
      include: {
        order: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.complaint.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const formattedReviews = reviews.map(
    (review: {
      id: any;
      rating: any;
      comment: any;
      createdAt: any;
      order: { orderNumber: any };
    }) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment ?? "",
      createdAt: review.createdAt,
    }),
  );

  const formattedComplaints = complaints.map(
    (complaint: {
      id: any;
      title: any;
      content: any;
      status: any;
      createdAt: any;
    }) => ({
      id: complaint.id,
      title: complaint.title ?? "Customer Complaint",
      content: complaint.content ?? "",
      status: complaint.status ?? "New",
      createdAt: complaint.createdAt,
    }),
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Customer Feedback"
        text="View and analyze customer reviews and complaints."
      />
      <FeedbackStatsCards reviews={reviews} complaints={complaints} />
      <div className="grid gap-4 md:grid-cols-2">
        {/* Left side: Pie Chart */}
        <FeedbackPieChart reviews={reviews} complaints={complaints} />

        {/* Right side: Line Chart with filters */}
        <FeedbackLineChart reviews={reviews} complaints={complaints} />
      </div>

      {/* Customer Reviews Table */}
      <div className="mt-6">
        <FeedBackCustomerReviewsTable reviews={formattedReviews} limit={5} />
      </div>

      {/* Customer Complaints Table */}
      <div className="mt-6">
        <CustomerComplaintsTable complaints={formattedComplaints} limit={5} />
      </div>
    </DashboardShell>
  );
}
