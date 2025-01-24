import OrderPageClient from "@/components/orders/order-page";
import getServerSession from "@/lib/auth/server";
import db from "@platter/db";



export default async function OrderPage() {
  const session = await getServerSession();
  const userId = session?.session?.userId;

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600">
            Please log in to view and manage orders.
          </p>
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
  console.log(initialOrders)
  const tableMap = new Map(tables.map((table) => [table.id, table.number]));
  
  const ordersWithTableNumber = initialOrders.map((order) => ({
    ...order,
    tableNumber: tableMap.get(order.tableId) || "Unknown",
  }));

  return (
    <OrderPageClient
      initialOrders={ordersWithTableNumber}
      tables={tables}
      userId={userId}
    />
  );
}

