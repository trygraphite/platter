"use client";

import type {
  OrderStats,
  OrderWithDetails,
  StaffOrdersClientProps,
} from "@/types/orders";
import type { OrderStatus } from "@prisma/client";
import { AlertCircle, CheckCircle, Clock, Filter, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { StaffOrderFilters } from "./StaffOrderFilters";
import { StaffOrderModal } from "./StaffOrderModal";
import { StaffOrderStats } from "./StaffOrderStats";
import { StaffOrdersTable } from "./StaffOrdersTable";

export function StaffOrdersClient({
  initialOrders,
  initialStats,
  staff,
}: StaffOrdersClientProps) {
  const [orders, setOrders] = useState<OrderWithDetails[]>(initialOrders);
  const [stats, setStats] = useState<OrderStats>(initialStats);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [assignedFilter, setAssignedFilter] = useState<
    "all" | "assigned" | "unassigned"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Global UI update queue: serialize all order/item updates to avoid races
  const [queueTail, setQueueTail] = useState<Promise<unknown>>(
    Promise.resolve(),
  );
  const enqueueUiUpdate = <T,>(task: () => Promise<T>): Promise<T> => {
    let localResolve: (value: T | PromiseLike<T>) => void = () => {};
    let localReject: (reason?: unknown) => void = () => {};
    const nextPromise = new Promise<T>((resolve, reject) => {
      localResolve = resolve;
      localReject = reject;
    });

    const run = async () => {
      try {
        const result = await task();
        localResolve(result);
      } catch (err) {
        localReject(err);
      }
    };

    setQueueTail((prev) => prev.then(run, run));
    return nextPromise;
  };

  // Filter orders based on current filters
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    // Assignment filter
    if (assignedFilter === "assigned" && !order.staff) {
      return false;
    }
    if (assignedFilter === "unassigned" && order.staff) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const orderNumber = order.orderNumber?.toString() || "";
      const tableNumber = order.table?.number || "";
      const staffName = order.staff?.name || "";

      return (
        orderNumber.includes(searchLower) ||
        tableNumber.includes(searchLower) ||
        staffName.includes(searchLower) ||
        order.items.some((item) =>
          item.menuItem.name.toLowerCase().includes(searchLower),
        )
      );
    }

    return true;
  });

  // Update stats when orders change
  useEffect(() => {
    const newStats = {
      total: orders.length,
      confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
      preparing: orders.filter((o) => o.status === "PREPARING").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
    };
    setStats(newStats);
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Order Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage and track restaurant orders
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Live updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <StaffOrderStats stats={stats} />

          {/* Filters */}
          <StaffOrderFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            assignedFilter={assignedFilter}
            setAssignedFilter={setAssignedFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* Orders Table */}
          <div className="mt-6 bg-white rounded-lg shadow">
            <StaffOrdersTable
              orders={filteredOrders}
              staff={staff}
              onOrderUpdate={(updatedOrder: OrderWithDetails) => {
                setOrders((currentOrders) => {
                  return currentOrders.map((order) => {
                    if (order.id !== updatedOrder.id) return order;
                    // Preserve any extra metadata present in current order but missing from payload
                    return {
                      ...order,
                      ...updatedOrder,
                      _metadata: updatedOrder._metadata ?? order._metadata,
                      table: updatedOrder.table ?? order.table,
                      staff: updatedOrder.staff ?? order.staff,
                      items: updatedOrder.items ?? order.items,
                    };
                  });
                });
              }}
              getOrderById={(orderId) => orders.find((o) => o.id === orderId)}
              renderOrderModal={(
                selectedOrder: OrderWithDetails,
                onClose: () => void,
                onUpdate: (order: OrderWithDetails) => void,
              ) => (
                <StaffOrderModal
                  order={selectedOrder}
                  staff={staff}
                  onClose={onClose}
                  onUpdate={(incoming: OrderWithDetails) => {
                    // Modal update uses same safe merge to avoid dropping fields
                    const merged = {
                      ...selectedOrder,
                      ...incoming,
                      _metadata: incoming._metadata ?? selectedOrder._metadata,
                      table: incoming.table ?? selectedOrder.table,
                      staff: incoming.staff ?? selectedOrder.staff,
                      items: incoming.items ?? selectedOrder.items,
                    } as OrderWithDetails;
                    onUpdate(merged);
                  }}
                  getOrderById={(id: string) => orders.find((o) => o.id === id)}
                  enqueueUiUpdate={enqueueUiUpdate}
                />
              )}
              enqueueUiUpdate={enqueueUiUpdate}
            />
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ||
                statusFilter !== "all" ||
                assignedFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Orders will appear here when customers place them"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
