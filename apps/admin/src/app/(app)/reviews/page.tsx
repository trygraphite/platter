import type { Metadata } from "next";

import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ReviewsTable } from "@/components/feedback/reviews-table";

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

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Customer Reviews"
        text="View customer reviews and ratings."
      />
      <ReviewsTable reviews={reviews} />
    </DashboardShell>
  );
}

