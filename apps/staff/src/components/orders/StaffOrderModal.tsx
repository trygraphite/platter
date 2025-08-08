"use client";

import {
  updateAllOrderItemsStatus,
  updateManageableOrderItemsStatus,
  updateOrderItemStatus,
  updateOrderStatus,
} from "@/actions/order-actions";
import type { OrderWithDetails, StaffOrderModalProps } from "@/types/orders";
import { formatCurrency } from "@/utils/format";
import {
  type ORDER_ITEM_STATUSES,
  getStatusIcon,
  getStatusStyle,
} from "@/utils/order-utils";
import type { OrderStatus } from "@prisma/client";
import { Calendar, DollarSign, Printer, User, X } from "lucide-react";
import { useState } from "react";
import type React from "react";
import { BulkUpdateSection } from "./BulkUpdateSection";
import { OrderItemCard } from "./OrderItemCard";
import { OrderStatusSelector } from "./OrderStatusSelector";
import { PrintSelectionModal } from "./PrintSelectionModal";
import { printFullOrder, printServicePointItems } from "./print/PrintUtils";

export function StaffOrderModal({
  order,
  staff,
  onClose,
  onUpdate,
  getOrderById,
  enqueueUiUpdate,
}: StaffOrderModalProps): React.JSX.Element {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingItemIds, setUpdatingItemIds] = useState<Set<string>>(
    new Set(),
  );
  const [showPrintSelection, setShowPrintSelection] = useState(false);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const run = async () => {
        const updatedOrder = await updateOrderStatus(order.id, newStatus);
        onUpdate(updatedOrder as OrderWithDetails);
      };
      if (enqueueUiUpdate) {
        await enqueueUiUpdate(run);
      } else {
        await run();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOrderItemStatusUpdate = async (
    orderItemId: string,
    newStatus: (typeof ORDER_ITEM_STATUSES)[number],
  ) => {
    setUpdatingItemIds((prev) => new Set(prev).add(orderItemId));
    try {
      const run = async () => {
        await updateOrderItemStatus(orderItemId, newStatus);

        const latest =
          (typeof getOrderById === "function" && getOrderById(order.id)) ||
          order;
        const updatedOrder = {
          ...latest,
          items: latest.items.map((item) =>
            item.id === orderItemId ? { ...item, status: newStatus } : item,
          ),
        } as OrderWithDetails;

        onUpdate(updatedOrder);
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
    newStatus: (typeof ORDER_ITEM_STATUSES)[number],
  ) => {
    setIsUpdating(true);
    try {
      const run = async () => {
        const result =
          staff.staffRole === "OPERATOR"
            ? await updateManageableOrderItemsStatus(order.id, newStatus)
            : await updateAllOrderItemsStatus(order.id, newStatus);

        if (result.success && result.order) {
          onUpdate(result.order as OrderWithDetails);
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
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    if (staff.staffRole === "OPERATOR") {
      setShowPrintSelection(true);
      return;
    }
    printFullOrder(order);
  };

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Order #{order.orderNumber || "N/A"}
            </h2>
            <div className="flex items-center space-x-3">
              <p className="text-sm text-gray-500">
                {order.table ? `Table ${order.table.number}` : "Pickup Order"}
              </p>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
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
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Printer className="h-4 w-4" />
              <span>Print Docket</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className="h-5 w-5" />
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(order.status)}`}
              >
                {order.status}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Order Status Information
            </h3>
            <div className="text-sm text-gray-600 mb-3">
              <p>
                Current status:{" "}
                <span className="font-medium">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <BulkUpdateSection
              order={order}
              staffRole={staff.staffRole}
              isUpdating={isUpdating}
              onBulkUpdate={handleBulkOrderItemStatusUpdate}
            />

            <div className="space-y-4">
              {order.items
                .sort((a, b) => {
                  if (staff.staffRole === "OPERATOR") {
                    const aIsManageable = a.isMyItem;
                    const bIsManageable = b.isMyItem;
                    if (aIsManageable && !bIsManageable) return -1;
                    if (!aIsManageable && bIsManageable) return 1;
                  }
                  return 0;
                })
                .map((item) => (
                  <OrderItemCard
                    key={item.id}
                    item={item}
                    orderId={order.id}
                    index={0}
                    isMyItem={item.isMyItem}
                    staffRole={staff.staffRole}
                    isUpdating={updatingItemIds.has(item.id)}
                    onStatusUpdate={handleOrderItemStatusUpdate}
                    variant="modal"
                  />
                ))}
            </div>
          </div>

          {/* Special Notes */}
          {order.specialNotes && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Special Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {order.specialNotes}
              </p>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-900">Total:</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>

          {/* Action Buttons - Hidden for Operators */}
          {staff.staffRole !== "OPERATOR" && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Update Order Status
              </h3>
              <OrderStatusSelector
                currentStatus={order.status}
                onStatusChange={handleStatusUpdate}
                disabled={isUpdating}
              />
            </div>
          )}

          {/* Operator Notice */}
          {staff.staffRole === "OPERATOR" && (
            <div className="border-t pt-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">
                  Operator Permissions
                </h3>
                <p className="text-sm text-blue-700">
                  As an operator, you can only update the status of items
                  assigned to your service point. Overall order status changes
                  must be handled by managers or administrators.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Selection Modal for Operators */}
      <PrintSelectionModal
        isOpen={showPrintSelection}
        onClose={() => setShowPrintSelection(false)}
        onPrintServicePoint={() =>
          printServicePointItems(order, staff, () =>
            setShowPrintSelection(false),
          )
        }
        onPrintFullOrder={() => {
          printFullOrder(order);
          setShowPrintSelection(false);
        }}
        orderNumber={String(order.orderNumber || "N/A")}
      />
    </div>
  );
}
