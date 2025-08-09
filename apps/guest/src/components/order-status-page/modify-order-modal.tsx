"use client";

import { modifyOrder } from "@/app/actions/modify-order";
import type { CartItem } from "@/types/menu";
import { formatNaira } from "@/utils";
import { Button } from "@platter/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@platter/ui/components/dialog";
import { Input } from "@platter/ui/components/input";
import { toast } from "@platter/ui/components/sonner";
import { Textarea } from "@platter/ui/components/textarea";
import { Minus, Plus, X } from "@platter/ui/lib/icons";
import Image from "next/image";
import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  price: string;
  quantity: number;
  status: string;
  specialNotes?: string;
  menuItem: {
    id: string;
    name: string;
    price: string;
    image?: string | null;
  };
  variety?: {
    id: string;
    name: string;
    price: string;
  };
}

interface ModifyOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    items: OrderItem[];
    specialNotes?: string | null;
    totalAmount: number;
  };
  qrId: string;
  onOrderModified: (updatedOrder: any) => void;
}

export function ModifyOrderModal({
  isOpen,
  onClose,
  order,
  qrId,
  onOrderModified,
}: ModifyOrderModalProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [specialNotes, setSpecialNotes] = useState(order.specialNotes || "");
  const [isModifying, setIsModifying] = useState(false);

  // Initialize cart from order items
  useEffect(() => {
    if (isOpen && order.items) {
      const initialCart: CartItem[] = order.items.map((item) => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: Number(item.menuItem.price),
        image: item.menuItem.image || undefined,
        quantity: item.quantity,
        categoryId: "", // We don't have category info in order items
        isAvailable: true,
        selectedVariety: item.variety
          ? {
              id: item.variety.id,
              name: item.variety.name,
              price: Number(item.variety.price),
              isAvailable: true,
            }
          : undefined,
        varieties: item.variety
          ? [
              {
                id: item.variety.id,
                name: item.variety.name,
                price: Number(item.variety.price),
                isAvailable: true,
              },
            ]
          : undefined,
      }));
      setCart(initialCart);
      setSpecialNotes(order.specialNotes || "");
    }
  }, [isOpen, order]);

  const handleQuantityChange = (itemId: string, increment: boolean) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) => {
            if (item.id === itemId) {
              const newQuantity = increment
                ? item.quantity + 1
                : item.quantity - 1;
              if (newQuantity <= 0) {
                return null; // Remove item if quantity becomes 0
              }
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const cartTotal = cart.reduce(
    (total, item) =>
      total + (item.selectedVariety?.price || item.price) * item.quantity,
    0,
  );

  const handleModifyOrder = async () => {
    if (cart.length === 0) {
      toast.error("Please add at least one item to your order");
      return;
    }

    setIsModifying(true);
    try {
      const result = await modifyOrder({
        orderId: order.id,
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.selectedVariety?.price || item.price,
          name: item.name,
          selectedVarietyId: item.selectedVariety?.id,
        })),
        totalAmount: cartTotal,
        specialNotes: specialNotes.trim() || undefined,
      });

      if (result.success) {
        toast.success("Order modified successfully!");
        onOrderModified(result.order);
        onClose();
      } else {
        toast.error(result.error || "Failed to modify order");
      }
    } catch (error) {
      toast.error("An error occurred while modifying the order");
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Modify Order</DialogTitle>
          <DialogDescription>
            Add or remove items from your order. Changes will reset the order
            status to pending.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No items in cart</p>
                <p className="text-sm">
                  Add items from the menu to modify your order
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id + (item.selectedVariety?.id || "")}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                >
                  {/* Item Image */}
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {item.name}
                    </h4>
                    {item.selectedVariety && (
                      <p className="text-xs text-blue-600 font-medium">
                        {item.selectedVariety.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {formatNaira(item.selectedVariety?.price || item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, false)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, true)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Special Notes */}
          <div className="space-y-2">
            <label htmlFor="special-notes" className="text-sm font-medium">
              Special Notes
            </label>
            <Textarea
              id="special-notes"
              placeholder="Any special requests or instructions..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Total and Actions */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-xl font-bold">{formatNaira(cartTotal)}</span>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isModifying}>
              Cancel
            </Button>
            <Button
              onClick={handleModifyOrder}
              disabled={isModifying || cart.length === 0}
              className="flex-1"
            >
              {isModifying ? "Modifying..." : "Modify Order"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
