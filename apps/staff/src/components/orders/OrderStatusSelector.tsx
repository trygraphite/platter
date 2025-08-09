import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import type { OrderStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  getStatusButtonText,
  getStatusColor,
  ORDER_STATUSES,
} from "@/utils/order-utils";

interface OrderStatusSelectorProps {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
}

export function OrderStatusSelector({
  currentStatus,
  onStatusChange,
  disabled = false,
  className = "w-64",
  showLabel = true,
}: OrderStatusSelectorProps) {
  const [selected, setSelected] = useState(currentStatus);
  useEffect(() => {
    setSelected(currentStatus);
  }, [currentStatus]);
  return (
    <div className="flex items-center space-x-3">
      {showLabel && (
        <span className="text-sm text-gray-600 font-medium">Status:</span>
      )}
      <Select
        value={selected}
        onValueChange={(value) => setSelected(value as OrderStatus)}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}
                />
                <span>{getStatusButtonText(status)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button
        type="button"
        onClick={() => onStatusChange(selected)}
        disabled={disabled || selected === currentStatus}
        className={`px-3 py-1 text-xs rounded ${
          disabled || selected === currentStatus
            ? "bg-gray-200 text-gray-500"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Update
      </button>
      {disabled && (
        <span className="text-sm text-gray-500 ml-2">Updating...</span>
      )}
    </div>
  );
}
