import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

type OrderItemStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

interface EditOrderItemStatusProps {
  orderItemId: string;
  currentStatus: OrderItemStatus;
  onStatusUpdate: (
    orderItemId: string,
    newStatus: OrderItemStatus,
  ) => Promise<void>;
  disabled?: boolean;
}

const ORDER_ITEM_STATUSES: {
  value: OrderItemStatus;
  label: string;
  color: string;
}[] = [
  { value: "PENDING", label: "Pending", color: "bg-gray-100 text-gray-800" },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "PREPARING",
    label: "Preparing",
    color: "bg-blue-100 text-blue-800",
  },
  { value: "READY", label: "Ready", color: "bg-green-100 text-green-800" },
  {
    value: "DELIVERED",
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-800",
  },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function EditOrderItemStatus({
  orderItemId,
  currentStatus,
  onStatusUpdate,
  disabled = false,
}: EditOrderItemStatusProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderItemStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: OrderItemStatus) => {
    if (newStatus === currentStatus || isUpdating) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(orderItemId, newStatus);
      setSelectedStatus(newStatus);
    } catch (error) {
      console.error("Error updating order item status:", error);
      // Revert to current status on error
      setSelectedStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: OrderItemStatus) => {
    return (
      ORDER_ITEM_STATUSES.find((s) => s.value === status)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getStatusLabel = (status: OrderItemStatus) => {
    return ORDER_ITEM_STATUSES.find((s) => s.value === status)?.label || status;
  };

  return (
    <div className="flex items-center gap-2">
      {isUpdating ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <Badge className={getStatusColor(selectedStatus)}>
            {getStatusLabel(selectedStatus)}
          </Badge>
        </div>
      ) : (
        <>
          <Select
            value={selectedStatus}
            onValueChange={(value: OrderItemStatus) => setSelectedStatus(value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-36 h-9 border-primary focus:border-primary focus:ring-primary shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_ITEM_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${status.color.replace("bg-", "bg-").replace(" text-", "")}`}
                    />
                    {status.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedStatus !== currentStatus && (
            <Button
              size="sm"
              onClick={() => handleStatusChange(selectedStatus)}
              disabled={disabled}
              className="h-9 px-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Update
            </Button>
          )}
        </>
      )}
    </div>
  );
}
