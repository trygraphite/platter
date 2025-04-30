import type { Metadata } from "next";

import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ReviewsTable } from "./components/review-table";

export const metadata: Metadata = {
  title: "Reviews | Platter Admin",
  description: "View customer reviews and ratings",
};

export default async function ReviewsPage() {
  const session = await getServerSession();
  const userId = session?.session?.userId;

  const reviews = await db.review.findMany({
    where: { userId },
    include: {
      order: true,
      qrCode: true,
      table: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedReviews = reviews.map((review: typeof reviews[number]) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    order: review.order
      ? { orderNumber: String(review.order.orderNumber) }
      : null,
    qrCode: review.qrCode ? { code: review.qrCode.target } : null,
    table: review.table ? { number: review.table.number } : null,
  }));

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Customer Reviews"
        text="View customer reviews and ratings."
      />
      <ReviewsTable reviews={formattedReviews} />
    </DashboardShell>
  );
}
