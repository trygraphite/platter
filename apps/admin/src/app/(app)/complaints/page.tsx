import type { Metadata } from "next";

import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ComplaintsTable } from "@/components/feedback/complaints-table";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Complaints | Platter Admin",
  description: "View and manage customer complaints",
};

export default async function ComplaintsPage() {
  const session = await getServerSession();
  const userId = session?.session?.userId;
   if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            Please log in to view the complaints page.
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

  const complaints = await db.complaint.findMany({
    where: { userId },
    select: {
      id: true,
      content: true,
      category: true,
      status: true,
      createdAt: true,
      qrCode: {
        select: {
          target: true,
        },
      },
      table: {
        select: {
          number: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  }).then(complaints => complaints.map(complaint => ({
    ...complaint,
    qrCode: { code: complaint.qrCode.target },
  })));

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Customer Complaints"
        text="View and manage customer complaints."
      />
      <ComplaintsTable complaints={complaints} />
    </DashboardShell>
  );
}

