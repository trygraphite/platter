"use client";

import { deleteOrder, updateOrder } from "@/lib/actions/order-actions";
import type { Order, OrderStatus, Table } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CreateOrder from "./create-order";
import EditOrderModal from "./edit-order";
import OrdersTable from "./order-table";
import useAdminOrdersSocket from "@/hooks/useAdminSocket";
import { Pagination } from "../../custom/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";

interface OrderPageClientProps {
  initialOrders: (Order & {
    tableNumber: string;
    items: {
      quantity: number;
      menuItem: {
        name: string;
        price: number;
      };
    }[];
  })[];
  tables: Table[];
  userId: string;
  totalOrders: number;
}

export default function OrderPageClient({ 
  initialOrders, 
  tables, 
  userId, 
  totalOrders 
}: OrderPageClientProps) {
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState(initialOrders);
  const itemsPerPage = 10;

  const ordersRef = useRef(orders);

  // Socket handling
  const { orders: socketOrders, isConnected } = useAdminOrdersSocket({
    serverUrl: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3002",
    initialOrders,
    userId,
  }) as { 
    orders: (Order & { 
      items?: { quantity: number; menuItem: { name: string; price: number } }[] 
    })[], 
    isConnected: boolean 
  };

  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  useEffect(() => {
    if (isConnected) {
      console.log(`Admin connected and joined restaurant room for user: ${userId}`);
    }
  }, [isConnected, userId]);

  useEffect(() => {
    if (socketOrders && socketOrders.length > 0) {
      const processedOrders = socketOrders.map((order) => {
        const tableNumber = tables.find((t) => t.id === order.tableId)?.number || "Unknown";
        const existingOrder = ordersRef.current.find((o) => o.id === order.id);
        const orderItems =
          Array.isArray(order.items) && order.items.length > 0 ? order.items : existingOrder?.items || [];

        return {
          ...order,
          tableNumber,
          items: orderItems,
        };
      });

      setOrders(processedOrders);
    }
  }, [socketOrders, tables]);

  const handleEditOrder = async (updatedOrder: Order) => {
    try {
      const result = await updateOrder(updatedOrder);
      const tableNumber = tables.find((t) => t.id === result.tableId)?.number || "Unknown";
      setOrders(orders.map((o) => (o.id === result.id ? { ...result, tableNumber } : o)));
      setEditingOrder(null);
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    return statusFilter === "all" || order.status === statusFilter;
  });

  // Calculate paginated data
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginationMeta = {
    currentPage,
    totalPages: Math.ceil(filteredOrders.length / itemsPerPage),
    totalItems: filteredOrders.length,
    itemsPerPage
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
              {isConnected && (
                <div className="flex items-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-green-600">Live updates enabled</span>
                </div>
              )}
              {!isConnected && (
                <div className="flex items-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-red-600">Disconnected - refresh to reconnect</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* Replace standard select with shadcn/ui Select component */}
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as OrderStatus | "all");
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  {/* <SelectItem value="CONFIRMED">Confirmed</SelectItem> */}
                  <SelectItem value="PREPARING">Preparing</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => setShowCreateOrder(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusCircle size={20} className="mr-2" />
                New Order
              </button>
            </div>
          </div>

          {showCreateOrder ? (
            <CreateOrder onCancel={() => setShowCreateOrder(false)} tables={tables} userId={userId} />
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-2 border">
                {filteredOrders.length > 0 ? (
                  <>
                    <OrdersTable
                      orders={paginatedOrders}
                      onEditOrder={setEditingOrder}
                      onDeleteOrder={handleDeleteOrder}
                    />
                    <Pagination
                      pagination={paginationMeta}
                      onPageChange={setCurrentPage}
                    />
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xl text-gray-600">
                      {statusFilter === "all" 
                        ? "No orders yet. Create your first order!" 
                        : `No orders with status ${statusFilter.toLowerCase()}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleEditOrder}
          tables={tables}
          open={true}
        />
      )}
    </div>
  );
}