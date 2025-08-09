import { Button } from "@platter/ui/components/button";
import { Checkbox } from "@platter/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@platter/ui/components/dialog";
import { Label } from "@platter/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { Textarea } from "@platter/ui/components/textarea";
import type { Order, OrderStatus, Table } from "@prisma/client";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface EditOrderModalProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onSave: (updatedOrder: Order) => void;
  onUpdateAllOrderItemsStatus: (
    orderId: string,
    newStatus: OrderStatus,
  ) => Promise<void>;
  tables: Table[];
}

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "DELIVERED",
  "CANCELLED",
];

export default function EditOrderModal({
  open = true,
  order,
  onClose,
  onSave,
  onUpdateAllOrderItemsStatus,
  tables,
}: EditOrderModalProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [tableId, _setTableId] = useState(order.tableId);
  const [specialNotes, setSpecialNotes] = useState(order.specialNotes || "");
  const [applyToAllItems, setApplyToAllItems] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If applyToAllItems is checked, update all order items first
      if (applyToAllItems) {
        await onUpdateAllOrderItemsStatus(order.id, status);
      }

      // Then save the order changes
      onSave({
        ...order,
        status,
        tableId,
        specialNotes: specialNotes || null,
      });
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>
            Make changes to the order details here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value: OrderStatus) => setStatus(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="col-span-3 uppercase">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((orderStatus) => (
                  <SelectItem
                    key={orderStatus}
                    value={orderStatus}
                    className="uppercase"
                  >
                    {orderStatus.charAt(0) + orderStatus.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 flex items-center space-x-2">
              <Checkbox
                id="applyToAllItems"
                checked={applyToAllItems}
                onCheckedChange={(checked) =>
                  setApplyToAllItems(checked as boolean)
                }
                disabled={isLoading}
              />
              <Label htmlFor="applyToAllItems" className="text-sm">
                Apply this status to all order items
              </Label>
            </div>
          </div>
          {/*TO EDIT TABLE NUMBER OF AN ORDER */}
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="table" className="text-right">
              Table
            </Label>
            <Select
              value={tableId.toString()}
              onValueChange={(value) => setTableId((value))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.id} value={table.id.toString()}>
                    Table {table.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Special Notes
            </Label>
            <Textarea
              id="notes"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Enter any special instructions"
              className="col-span-3"
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
