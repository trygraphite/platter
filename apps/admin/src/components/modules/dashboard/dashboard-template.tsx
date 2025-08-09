import db from "@platter/db";
import type { Metadata } from "next";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OrdersByTimeChart } from "@/components/dashboard/orders-by-time";
import DashboardOrdersTable from "@/components/modules/dashboard/components/dashboard-order-table";
import { Overview } from "@/components/modules/dashboard/components/dashboard-overview";
import { RevenueChart } from "@/components/modules/dashboard/components/revenue-chart";
import getServerSession from "@/lib/auth/server";
import { MostOrderedItems } from "./components/most-ordered-items-chart";

export const metadata: Metadata = {
  title: "Admin Dashboard | Platter",
  description: "Admin dashboard for Platter",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  const userId = session?.session?.userId;

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600">
            Please log in to view the admin dashboard.
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

  const [initialOrders, tables] = await Promise.all([
    db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.table.findMany(),
  ]);

  const tableMap = new Map(
    tables.map((table: { id: any; number: any }) => [table.id, table.number]),
  );

  const ordersWithTableNumber = initialOrders.map(
    (order: { tableId: unknown }) => ({
      ...order,
      tableNumber: order.tableId
        ? tableMap.get(order.tableId) || "Unknown"
        : "N/A", // Handle null tableId explicitly
    }),
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to your Platter admin dashboard."
      />
      <div className="grid  gap-4 ">
        <Overview orders={ordersWithTableNumber} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart className="col-span-4" orders={ordersWithTableNumber} />
        <OrdersByTimeChart
          className="col-span-3"
          orders={ordersWithTableNumber}
        />
      </div>
      <div className="grid  grid-rows-1 grid-cols-1">
        <MostOrderedItems className="w-full" orders={ordersWithTableNumber} />
        <div className="col-span-4 mt-4">
          <DashboardOrdersTable orders={ordersWithTableNumber} />
        </div>
      </div>
    </DashboardShell>
  );
}
