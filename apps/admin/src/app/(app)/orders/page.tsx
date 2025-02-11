import OrderPageClient from "@/components/orders/order-page";
import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import Link from "next/link";

export default async function OrderPage() {
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
console.log(initialOrders);
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
