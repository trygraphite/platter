import { getOrderStats, getStaffOrders } from "@/actions/order-actions";
import { StaffNavigation } from "@/components/navigation/StaffNavigation";
import { StaffOrdersClient } from "@/components/orders/StaffOrdersClient";
import { requireAuth } from "@/utils/auth";

export default async function OrdersPage() {
  const user = await requireAuth();

  // Only allow staff with order management permissions
  if (!user.canManageOrders) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StaffNavigation user={user} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You don't have permission to manage orders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch initial data
  const [orders, stats] = await Promise.all([
    getStaffOrders(),
    getOrderStats(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffNavigation user={user} />
      <StaffOrdersClient
        initialOrders={orders}
        initialStats={stats}
        staff={user}
      />
    </div>
  );
}
