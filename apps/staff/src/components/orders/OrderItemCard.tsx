import type { OrderWithDetails } from "@/types/orders";
import { formatCurrency } from "@/utils/format";
import {
  ORDER_ITEM_STATUSES,
  getOrderItemStatusIcon,
  getOrderItemStatusStyle,
  getStatusColor,
} from "@/utils/order-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { ChefHat, Tag } from "lucide-react";
import React, { useEffect, useState } from "react";

interface OrderItemCardProps {
  item: OrderWithDetails["items"][0];
  orderId: string;
  index: number;
  isMyItem?: boolean;
  staffRole: string;
  isUpdating: boolean;
  onStatusUpdate: (
    orderItemId: string,
    newStatus: (typeof ORDER_ITEM_STATUSES)[number],
    orderId: string,
  ) => void;
  variant?: "modal" | "table";
}

export function OrderItemCard({
  item,
  orderId,
  index,
  isMyItem = false,
  staffRole,
  isUpdating,
  onStatusUpdate,
  variant = "modal",
}: OrderItemCardProps) {
  const ItemStatusIcon = getOrderItemStatusIcon(item.status);
  const isOperator = staffRole === "OPERATOR";
  const canManage = !isOperator || isMyItem;

  const [selectedStatus, setSelectedStatus] = useState(item.status);
  useEffect(() => {
    setSelectedStatus(item.status);
  }, [item.status]);

  if (variant === "table") {
    return (
      <div
        className={`p-3 rounded border ${
          isMyItem
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-200 opacity-75"
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-3">
            <span className="font-medium">{item.quantity}x</span>
            <div className="flex items-center space-x-2">
              {item.menuItem.image && (
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  className="w-8 h-8 rounded object-cover"
                />
              )}
              <div>
                <span className="text-sm font-medium">
                  {item.menuItem.name}
                </span>
                {item.variety && (
                  <div className="flex items-center mt-1">
                    <Tag className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">
                      {item.variety.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <span className="text-sm font-medium">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>

        {/* Item Status and Service Point */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">Status:</span>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as (typeof ORDER_ITEM_STATUSES)[number])
              }
              disabled={isUpdating || !canManage}
            >
              <SelectTrigger className="w-44 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_ITEM_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}
                      />
                      <span>{status}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={() => onStatusUpdate(item.id, selectedStatus, orderId)}
              disabled={
                isUpdating || !canManage || selectedStatus === item.status
              }
              className={`ml-2 px-2 py-1 text-xs rounded ${
                isUpdating || !canManage || selectedStatus === item.status
                  ? "bg-gray-200 text-gray-500"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Update
            </button>
            {isUpdating && (
              <span className="text-xs text-gray-500 ml-2">Updating...</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {item.menuItem.servicePoint ? (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {item.menuItem.servicePoint.name}
                </span>
              </>
            ) : (
              <span className="text-gray-500">No service point</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Modal variant
  return (
    <div
      key={`${orderId}-item-${index}`}
      className="p-4 bg-gray-50 rounded border"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <span className="font-medium text-lg">{item.quantity}x</span>
          <div className="flex items-center space-x-3">
            {item.menuItem.image && (
              <img
                src={item.menuItem.image}
                alt={item.menuItem.name}
                className="w-12 h-12 rounded object-cover border"
              />
            )}
            <div>
              <span className="text-sm font-medium text-gray-900">
                {item.menuItem.name}
              </span>
              {item.variety && (
                <div className="flex items-center mt-1">
                  <Tag className="h-3 w-3 mr-1 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">
                    {item.variety.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>

      {/* Item Status and Service Point */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ItemStatusIcon className="h-4 w-4" />
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderItemStatusStyle(item.status)}`}
          >
            {item.status}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {item.menuItem.servicePoint ? (
            <div className="flex items-center space-x-1">
              <ChefHat className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-600">
                {item.menuItem.servicePoint.name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-500">No service point</span>
          )}
        </div>
      </div>

      {/* Item Actions */}
      <div className="flex flex-wrap gap-2">
        {/* Operator Item Indicator */}
        {isOperator && (
          <div className="w-full mb-2">
            {isMyItem ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-green-700 font-medium">
                  You can manage this item
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                <span className="text-xs text-gray-500">
                  Managed by other service point
                </span>
              </div>
            )}
          </div>
        )}

        {/* Status Update Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600 font-medium">Status:</span>
          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              setSelectedStatus(value as (typeof ORDER_ITEM_STATUSES)[number])
            }
            disabled={isUpdating || !canManage}
          >
            <SelectTrigger className="w-48 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_ITEM_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}
                    />
                    <span>{status}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => onStatusUpdate(item.id, selectedStatus, orderId)}
            disabled={
              isUpdating || !canManage || selectedStatus === item.status
            }
            className={`ml-2 px-3 py-1 text-xs rounded ${
              isUpdating || !canManage || selectedStatus === item.status
                ? "bg-gray-200 text-gray-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Update
          </button>
          {isUpdating && (
            <span className="text-xs text-gray-500 ml-2">Updating...</span>
          )}
        </div>
      </div>

      {/* Item Special Notes */}
      {item.specialNotes && (
        <div className="mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
          <p className="text-xs text-yellow-800">
            <strong>Notes:</strong> {item.specialNotes}
          </p>
        </div>
      )}
    </div>
  );
}
