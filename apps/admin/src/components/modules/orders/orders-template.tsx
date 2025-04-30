import OrderPageClient from "@/components/modules/orders/order-page";
import getServerSession from "@/lib/auth/server";
import { PaginatedResponse } from "@/types/pagniation";
import db from "@platter/db";

export default async function OrdersTemplate() {
  const session = await getServerSession();
  const userId = session?.session?.userId;
  
  // Fetch all data needed for initial render
  const [totalOrders, tables, orders] = await Promise.all([
    db.order.count({ where: { userId } }),
    db.table.findMany({}),
    db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 1000, // Increase if needed, or implement server-side pagination later
    })
  ]);

  const ordersWithTableNumber = orders.map((order: { tableId: any; }) => ({
    ...order,
    tableNumber: order.tableId
      ? tables.find((t: { id: any; }) => t.id === order.tableId)?.number || "Unknown"
      : "N/A",
  }));

  const paginatedOrders: PaginatedResponse<typeof ordersWithTableNumber[0]> = {
    data: ordersWithTableNumber,
    meta: {
      currentPage: 1, // Default to first page
      totalPages: Math.ceil(totalOrders / 10), // Assuming 10 items per page
      totalItems: totalOrders,
      itemsPerPage: 10
    }
  };

  return (
    <OrderPageClient
      initialOrders={ordersWithTableNumber}
      tables={tables}
      userId={userId as string}
      totalOrders={totalOrders}
    />
  );
}