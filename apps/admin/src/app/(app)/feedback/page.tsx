import type { Metadata } from "next";

import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RatingsDistribution } from "@/components/feedback/ratings-distribution";
import { ComplaintsTrend } from "@/components/feedback/complaints-trend";
import { CustomerReviewsTable } from "@/components/feedback/customer-review-table";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customer Feedback | Platter Admin",
  description: "Customer reviews and complaints for Platter",
};

export default async function FeedbackPage() {
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

  const formattedReviews = reviews.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment ?? '',
    createdAt: review.createdAt,
    order: review.order ? {
      orderNumber: String(review.order.orderNumber)
    } : null
  }));

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Customer Feedback"
        text="View and analyze customer reviews and complaints."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RatingsDistribution className="col-span-2" reviews={reviews} />
        <ComplaintsTrend className="row-span-2" complaints={complaints} />
      </div>
      <CustomerReviewsTable reviews={formattedReviews} />
    </DashboardShell>
  );
}

