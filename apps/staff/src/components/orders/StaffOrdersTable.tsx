"use client";

import {
  updateAllOrderItemsStatus,
  updateManageableOrderItemsStatus,
  updateOrderItemStatus,
  updateOrderStatus,
} from "@/actions/order-actions";
import type { OrderWithDetails, StaffOrdersTableProps } from "@/types/orders";
import { formatCurrency } from "@/utils/format";
import {
  type ORDER_ITEM_STATUSES,
  getStatusIcon,
  getStatusStyle,
} from "@/utils/order-utils";
import type { OrderStatus } from "@prisma/client";
import { ChevronDown, ChevronUp, Package, Printer, User } from "lucide-react";
import React, { useState } from "react";
import { OrderItemCard } from "./OrderItemCard";
import { OrderStatusSelector } from "./OrderStatusSelector";
import { PrintSelectionModal } from "./PrintSelectionModal";
import { StaffOrderModal } from "./StaffOrderModal";
import { printFullOrder, printServicePointItems } from "./print/PrintUtils";

export function StaffOrdersTable({
  orders,
  staff,
  onOrderUpdate,
  getOrderById,
  renderOrderModal,
  enqueueUiUpdate,
}: StaffOrdersTableProps) {
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [updatingItemIds, setUpdatingItemIds] = useState<Set<string>>(
    new Set(),
  );
  const [showPrintSelection, setShowPrintSelection] = useState(false);
  const [selectedOrderForPrint, setSelectedOrderForPrint] =
    useState<OrderWithDetails | null>(null);

  const toggleOrderExpansion = (orderId: string) => {
    const newExpandedOrders = new Set(expandedOrderIds);
    if (newExpandedOrders.has(orderId)) {
      newExpandedOrders.delete(orderId);
    } else {
      newExpandedOrders.add(orderId);
    }
    setExpandedOrderIds(newExpandedOrders);
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    setIsUpdating(orderId);
    try {
      const run = async () => {
        const updatedOrder = await updateOrderStatus(orderId, newStatus);
        onOrderUpdate(updatedOrder as OrderWithDetails);
      };
      if (enqueueUiUpdate) {
        await enqueueUiUpdate(run);
      } else {
        await run();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleOrderItemStatusUpdate = async (
    orderItemId: string,
    newStatus: (typeof ORDER_ITEM_STATUSES)[number],
    orderId: string,
  ) => {
    setUpdatingItemIds((prev) => new Set(prev).add(orderItemId));
    try {
      const run = async () => {
        await updateOrderItemStatus(orderItemId, newStatus);

        const currentOrder =
          (typeof getOrderById === "function" && getOrderById(orderId)) ||
          orders.find((order) => order.id === orderId);
        if (!currentOrder) {
          console.error("Order not found:", orderId);
          return;
        }

        const updatedOrder = {
          ...currentOrder,
          items: currentOrder.items.map((item) =>
            item.id === orderItemId ? { ...item, status: newStatus } : item,
          ),
        } as OrderWithDetails;

        onOrderUpdate(updatedOrder);
      };
      if (enqueueUiUpdate) {
        await enqueueUiUpdate(run);
      } else {
        await run();
      }
    } catch (error) {
      console.error("Error updating order item status:", error);
    } finally {
      setUpdatingItemIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderItemId);
        return newSet;
      });
    }
  };

  const handleBulkOrderItemStatusUpdate = async (
    orderId: string,
    newStatus: (typeof ORDER_ITEM_STATUSES)[number],
  ) => {
    setIsUpdating(orderId);
    try {
      const run = async () => {
        const result =
          staff.staffRole === "OPERATOR"
            ? await updateManageableOrderItemsStatus(orderId, newStatus)
            : await updateAllOrderItemsStatus(orderId, newStatus);

        if (result.success && result.order) {
          onOrderUpdate(result.order as OrderWithDetails);
        }
      };
      if (enqueueUiUpdate) {
        await enqueueUiUpdate(run);
      } else {
        await run();
      }
    } catch (error) {
      console.error("Error updating order items status:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handlePrint = (order: OrderWithDetails) => {
    if (staff.staffRole === "OPERATOR") {
      setSelectedOrderForPrint(order);
      setShowPrintSelection(true);
      return;
    }
    printFullOrder(order);
  };

  return (
    <div className="overflow-x-auto">
      {/* Role Indicator */}
      <div className=" px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Current Role:</span>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              staff.staffRole === "OPERATOR"
                ? "bg-blue-100 text-blue-800"
                : staff.staffRole === "MANAGER"
                  ? "bg-purple-100 text-purple-800"
                  : staff.staffRole === "ADMIN"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {staff.staffRole}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {staff.staffRole === "OPERATOR" && (
            <div className="text-sm text-blue-600">
              You can only manage items for your assigned service point
            </div>
          )}
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);

            return (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {order.items.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="mr-2 p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedOrderIds.has(order.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Order #{order.orderNumber || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.table
                            ? `Table ${order.table.number}`
                            : "Pickup Order"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StatusIcon className="h-4 w-4 mr-2" />
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {staff.staffRole === "OPERATOR" && order._metadata ? (
                      <div className="space-y-1">
                        <div className="text-green-600 font-semibold">
                          My Items:{" "}
                          {formatCurrency(order._metadata.myItemsTotal)}
                        </div>
                        {order._metadata.hasOtherItems && (
                          <div className="text-gray-500 text-xs">
                            Total: {formatCurrency(order.totalAmount)}
                          </div>
                        )}
                      </div>
                    ) : (
                      formatCurrency(order.totalAmount)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePrint(order)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedOrderIds.has(order.id) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">
                              Order Items
                            </h4>
                          </div>

                          {/* For operators, show section headers */}
                          {staff.staffRole === "OPERATOR" && order._metadata ? (
                            <div className="space-y-4">
                              {order._metadata.hasMyItems && (
                                <div>
                                  <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                    My Items ({order._metadata.myItemsCount}{" "}
                                    items)
                                  </h5>
                                  <div className="space-y-2">
                                    {order.items
                                      .filter((item) => item.isMyItem)
                                      .map((item) => (
                                        <OrderItemCard
                                          key={item.id}
                                          item={item}
                                          orderId={order.id}
                                          index={0}
                                          isMyItem={true}
                                          staffRole={staff.staffRole}
                                          isUpdating={updatingItemIds.has(
                                            item.id,
                                          )}
                                          onStatusUpdate={
                                            handleOrderItemStatusUpdate
                                          }
                                          variant="table"
                                        />
                                      ))}
                                  </div>
                                </div>
                              )}

                              {order._metadata.hasOtherItems && (
                                <div>
                                  <h5 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                                    Other Items (
                                    {order._metadata.otherItemsCount} items)
                                  </h5>
                                  <div className="space-y-2">
                                    {order.items
                                      .filter((item) => !item.isMyItem)
                                      .map((item) => (
                                        <OrderItemCard
                                          key={item.id}
                                          item={item}
                                          orderId={order.id}
                                          index={0}
                                          isMyItem={false}
                                          staffRole={staff.staffRole}
                                          isUpdating={updatingItemIds.has(
                                            item.id,
                                          )}
                                          onStatusUpdate={
                                            handleOrderItemStatusUpdate
                                          }
                                          variant="table"
                                        />
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* For non-operators, show all items normally */
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <OrderItemCard
                                  key={item.id}
                                  item={item}
                                  orderId={order.id}
                                  index={0}
                                  isMyItem={item.isMyItem}
                                  staffRole={staff.staffRole}
                                  isUpdating={updatingItemIds.has(item.id)}
                                  onStatusUpdate={handleOrderItemStatusUpdate}
                                  variant="table"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Special Notes */}
                        {order.specialNotes && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Special Notes
                            </h4>
                            <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                              {order.specialNotes}
                            </p>
                          </div>
                        )}

                        {/* Status Information */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Current Status: {order.status}
                          </h4>
                        </div>

                        {/* Quick Actions - Hidden for Operators */}
                        {staff.staffRole !== "OPERATOR" && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Update Order Status
                            </h4>
                            <OrderStatusSelector
                              currentStatus={order.status}
                              onStatusChange={(status) =>
                                handleStatusUpdate(order.id, status)
                              }
                              disabled={isUpdating === order.id}
                            />
                          </div>
                        )}

                        {/* Operator Notice */}
                        {staff.staffRole === "OPERATOR" && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">
                              Operator Permissions
                            </h4>
                            <p className="text-sm text-blue-700">
                              As an operator, you can only update the status of
                              items assigned to your service point. Overall
                              order status changes must be handled by managers
                              or administrators.
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Order Details Modal */}
      {selectedOrder &&
        (renderOrderModal ? (
          renderOrderModal(
            selectedOrder,
            () => setSelectedOrder(null),
            (updatedOrder: OrderWithDetails) => {
              onOrderUpdate(updatedOrder);
              setSelectedOrder(updatedOrder);
            },
          )
        ) : (
          <StaffOrderModal
            order={selectedOrder}
            staff={staff}
            onClose={() => setSelectedOrder(null)}
            onUpdate={(updatedOrder: OrderWithDetails) => {
              onOrderUpdate(updatedOrder);
              setSelectedOrder(updatedOrder);
            }}
          />
        ))}

      {/* Print Selection Modal for Operators */}
      {selectedOrderForPrint && (
        <PrintSelectionModal
          isOpen={showPrintSelection}
          onClose={() => {
            setShowPrintSelection(false);
            setSelectedOrderForPrint(null);
          }}
          onPrintServicePoint={() =>
            printServicePointItems(selectedOrderForPrint, staff, () => {
              setShowPrintSelection(false);
              setSelectedOrderForPrint(null);
            })
          }
          onPrintFullOrder={() => {
            printFullOrder(selectedOrderForPrint);
            setShowPrintSelection(false);
            setSelectedOrderForPrint(null);
          }}
          orderNumber={String(selectedOrderForPrint.orderNumber || "N/A")}
        />
      )}
    </div>
  );
}
