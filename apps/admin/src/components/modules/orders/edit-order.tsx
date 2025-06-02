import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@platter/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { Button } from "@platter/ui/components/button";
import { Label } from "@platter/ui/components/label";
import { Textarea } from "@platter/ui/components/textarea";
import type { Order, OrderStatus, Table } from "@prisma/client";

interface EditOrderModalProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onSave: (updatedOrder: Order) => void;
  tables: Table[];
}

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  // "CONFIRMED",
  "PREPARING",
  "DELIVERED",
  "CANCELLED",
];

export default function EditOrderModal({
  open = true,
  order,
  onClose,
  onSave,
  tables,
}: EditOrderModalProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [tableId, setTableId] = useState(order.tableId);
  const [specialNotes, setSpecialNotes] = useState(order.specialNotes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...order,
      status,
      tableId,
      specialNotes: specialNotes || null,
    });
    onClose();
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
            >
              <SelectTrigger className="col-span-3 uppercase">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((orderStatus) => (
                  <SelectItem key={orderStatus} value={orderStatus} className="uppercase">
                    {orderStatus.charAt(0) + orderStatus.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
