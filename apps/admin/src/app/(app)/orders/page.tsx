import OrderPageClient from "@/components/orders/order-page";
import getServerSession from "@/lib/auth/server";
import db from "@platter/db";

export default async function OrderPage() {
  const session = await getServerSession();
  const userId = session?.session?.userId;

  const [initialOrders, tables] = await Promise.all([
    db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.table.findMany(),
  ]);
  // console.log(initialOrders);
  const tableMap = new Map(tables.map((table) => [table.id, table.number]));

  const ordersWithTableNumber = initialOrders.map((order) => ({
    ...order,
    tableNumber: order.tableId
      ? tables.find((t) => t.id === order.tableId)?.number || "Unknown"
      : "N/A",
  }));
  // console.log(tables)
  return (
    <OrderPageClient
      initialOrders={ordersWithTableNumber}
      tables={tables}
      userId={userId as string}
    />
  );
}
