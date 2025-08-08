import type { OrderWithDetails } from "@/types/orders";
import { ORDER_ITEM_STATUSES } from "@/utils/order-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { ChefHat } from "lucide-react";
import React from "react";

interface BulkUpdateSectionProps {
  order: OrderWithDetails;
  staffRole: string;
  isUpdating: boolean;
  onBulkUpdate: (status: (typeof ORDER_ITEM_STATUSES)[number]) => void;
}

export function BulkUpdateSection({
  order,
  staffRole,
  isUpdating,
  onBulkUpdate,
}: BulkUpdateSectionProps) {
  const isOperator = staffRole === "OPERATOR";

  return (
    <>
      {/* General Bulk Update Section */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Order Items</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">
            Update All Items:
          </span>
          <Select
            onValueChange={(value) =>
              onBulkUpdate(value as (typeof ORDER_ITEM_STATUSES)[number])
            }
            disabled={isUpdating}
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_ITEM_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isUpdating && (
            <span className="text-xs text-blue-600">Updating...</span>
          )}
        </div>
      </div>

      {/* Operator-specific bulk update for manageable items */}
      {isOperator && order._metadata?.hasMyItems && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Update All Your Items ({order._metadata.myItemsCount} items)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-blue-700">Set all to:</span>
              <Select
                onValueChange={(value) =>
                  onBulkUpdate(value as (typeof ORDER_ITEM_STATUSES)[number])
                }
                disabled={isUpdating}
              >
                <SelectTrigger className="w-28 h-7 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_ITEM_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isUpdating && (
                <span className="text-xs text-blue-600">Updating...</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
