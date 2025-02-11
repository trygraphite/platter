import type { Metadata } from "next";

import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ReviewsTable } from "@/components/feedback/reviews-table";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reviews | Platter Admin",
  description: "View customer reviews and ratings",
};

export default async function ReviewsPage() {
  const session = await getServerSession();
  const userId = session?.session?.userId;

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600">
            Please log in to view the reviews page.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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

  const formattedReviews = reviews.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    order: review.order ? { orderNumber: String(review.order.orderNumber) } : null,
    qrCode: review.qrCode ? { code: review.qrCode.target } : null,
    table: review.table ? { number: review.table.number } : null
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

