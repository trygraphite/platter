import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@platter/ui/components/dialog";
import { Button } from "@platter/ui/components/button";

interface DeleteOrderModalProps {
  open: boolean;
  orderId: string;
  onClose: () => void;
  onConfirmDelete: (orderId: string) => void;
}

export default function DeleteOrderModal({
  open,
  orderId,
  onClose,
  onConfirmDelete,
}: DeleteOrderModalProps) {
  const handleDelete = () => {
    onConfirmDelete(orderId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
