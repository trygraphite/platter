import { getAssignedTables, getDashboardStats } from "@/actions/order-actions";
import { CurrentStaffInfo } from "@/components/CurrentStaffInfo";
import { StaffNavigation } from "@/components/navigation/StaffNavigation";
import { requireAuth } from "@/utils/auth";
import { Badge } from "@platter/ui/components/badge";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Menu,
  Package,
  Settings,
  User,
  Users,
} from "lucide-react";

export default async function DashboardPage(): Promise<JSX.Element> {
  const user = await requireAuth();
  const [dashboardData, assignedTables] = await Promise.all([
    getDashboardStats(),
    getAssignedTables(),
  ]);
  const { stats, restaurant } = dashboardData;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get role-specific information
  const getRoleInfo = () => {
    switch (user.staffRole) {
      case "ADMIN":
        return {
          title: "Administrator",
          description: "Full access to all restaurant operations",
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
      case "MANAGER":
        return {
          title: "Manager",
          description: "Manage restaurant operations and staff",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "OPERATOR":
        return {
          title: "Service Point Operator",
          description: "Handle orders for assigned service points",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      default:
        return {
          title: "Staff Member",
          description: "Assist with restaurant operations",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <StaffNavigation user={user} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.name}! 👋
                </h2>
                <h3 className="text-xl text-gray-700 mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 mb-3">{roleInfo.description}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={roleInfo.color}>
                    {roleInfo.title}
                  </Badge>
                  {user.position && (
                    <Badge variant="secondary">{user.position}</Badge>
                  )}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${roleInfo.bgColor}`}>
                <User className={`h-8 w-8 ${roleInfo.color}`} />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {/* Commented out stats grid as requested
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Orders
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.pendingOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Tables
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.activeTables}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Menu className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Menu Items
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.menuItems}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Today's Sales
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(stats.todaySales)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          */}

          {/* Staff Assignments */}
          {(user.assignedTables && user.assignedTables.length > 0) ||
          (user.assignedServicePoints &&
            user.assignedServicePoints.length > 0) ? (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Your Assignments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.assignedTables && user.assignedTables.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Assigned Tables
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.assignedTables.map((assignment) => (
                        <Badge
                          key={assignment.id}
                          variant="outline"
                          className="text-blue-600 border-blue-600"
                        >
                          Table {assignment.table.number} (
                          {assignment.table.capacity} seats)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {user.assignedServicePoints &&
                  user.assignedServicePoints.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Service Points
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.assignedServicePoints.map((assignment) => (
                          <Badge
                            key={assignment.id}
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            {assignment.servicePoint.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ) : null}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.canManageOrders && (
                <a
                  href="/orders"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Package className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">Manage Orders</span>
                </a>
              )}

              {user.canManageMenu && (
                <a
                  href="/menu"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Menu className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium">Update Menu</span>
                </a>
              )}

              {user.canManageTables && (
                <a
                  href="/tables"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-sm font-medium">Manage Tables</span>
                </a>
              )}

              {user.canViewReports && (
                <a
                  href="/reports"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium">View Reports</span>
                </a>
              )}

              <a
                href="/settings"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-sm font-medium">Settings</span>
              </a>
            </div>
          </div>

          {/* Order Status Summary */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Status Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.pendingOrders}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Preparing</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.preparingOrders}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.deliveredOrders}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Package className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Info */}
          <div className="mt-6">
            <CurrentStaffInfo />
          </div>
        </div>
      </main>
    </div>
  );
}
