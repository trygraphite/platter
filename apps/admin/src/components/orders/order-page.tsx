"use client";

import {
  createOrder,
  deleteOrder,
  updateOrder,
} from "@/lib/actions/order-actions";
import type { Order, OrderStatus, Table } from "@prisma/client";
import { PlusCircle, Search } from "lucide-react";
import React, { useState } from "react";
import CreateOrder from "./create-order";
import EditOrderModal from "./edit-order";
import OrdersTable from "./order-table";

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
}

export default function OrderPageClient({
  initialOrders,
  tables,
  userId,
}: OrderPageClientProps) {
  const [orders, setOrders] =
    useState<
      (Order & {
        tableNumber: string;
        items: {
          quantity: number;
          menuItem: {
            name: string;
            price: number;
          };
        }[];
      })[]
    >(initialOrders);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const handleEditOrder = async (updatedOrder: Order) => {
    try {
      const result = await updateOrder(updatedOrder);
      const tableNumber =
        tables.find((t) => t.id === result.tableId)?.number || "Unknown";
      setOrders(
        orders.map((o) =>
          o.id === result.id ? { ...result, tableNumber } : o,
        ),
      );
      setEditingOrder(null);
    } catch (err) {
      console.error("Error updating order:", err);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      // Handle error (e.g., show error message to user)
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.includes(searchTerm) ||
      order.tableNumber.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Orders Management
            </h1>
            <button
              type="button"
              onClick={() => setShowCreateOrder(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusCircle size={20} className="mr-2" />
              New Order
            </button>
          </div>

          {showCreateOrder ? (
            <CreateOrder
              onCancel={() => setShowCreateOrder(false)}
              tables={tables}
              userId={userId}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as OrderStatus | "all")
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                {orders.length > 0 ? (
                  <OrdersTable
                    orders={filteredOrders}
                    onEditOrder={setEditingOrder}
                    onDeleteOrder={handleDeleteOrder}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xl text-gray-600">
                      No orders yet. Create your first order!
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
