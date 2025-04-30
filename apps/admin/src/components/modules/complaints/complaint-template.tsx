import type { Metadata } from "next";

import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {  ComplaintsTable } from "./components/complaint-table";
import { Complaint } from "@/types";

export const metadata: Metadata = {
  title: "Complaints | Platter Admin",
  description: "View and manage customer complaints",
};

export default async function ComplaintsPage() {
  const session = await getServerSession();
  const userId = session?.session?.userId;

  const complaints = await db.complaint
    .findMany({
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
    })
    .then((complaints: Complaint[]) =>
      complaints.map((complaint) => ({
        ...complaint,
        qrCode: { code: complaint.qrCode?.target ?? "N/A" },
      })),
    );

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
