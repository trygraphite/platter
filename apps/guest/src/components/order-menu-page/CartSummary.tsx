import { createOrder } from "@/app/actions/create-order";
import { modifyOrder } from "@/app/actions/modify-order";
import type { CartItem } from "@/types/menu";
import { formatNaira } from "@/utils";
import { Button } from "@platter/ui/components/button";
import { ChocoLoader } from "@platter/ui/components/choco-loader";
import { Minus, Plus, ShoppingCart, X } from "@platter/ui/lib/icons";
import Image from "next/image";
import * as React from "react";

interface CartSummaryProps {
  cart: CartItem[];
  cartTotal: number;
  cartItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  handleCartQuantityChange: (
    product: any,
    increment: boolean,
    varietyId?: string,
  ) => void;
  clearCart: () => void;
  qr: string;
  isModifyingOrder?: boolean;
  orderId?: string;
}

function CartItemRow({
  item,
  handleCartQuantityChange,
}: {
  item: CartItem;
  handleCartQuantityChange: (
    product: any,
    increment: boolean,
    varietyId?: string,
  ) => void;
}) {
  // Convert back to Product format for addToCart
  const product = {
    _id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    outOfStock: !item.isAvailable,
    varieties: item.varieties?.map((v) => ({
      _id: v.id,
      name: v.name,
      price: v.price,
      outOfStock: !v.isAvailable,
    })),
    category: { name: item.categoryId },
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCartQuantityChange(product, true, item.selectedVariety?.id);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCartQuantityChange(product, false, item.selectedVariety?.id);
  };

  const isOutOfStock = item.selectedVariety
    ? !item.selectedVariety.isAvailable
    : !item.isAvailable;

  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
      {item.image && (
        <Image
          src={item.image}
          alt={item.name}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-lg"
        />
      )}
      <div className="flex-1">
        <h3 className="font-medium text-base">{item.name}</h3>
        <p className="text-muted-foreground text-sm">
          {formatNaira(item.selectedVariety?.price || item.price)}
        </p>
        {item.selectedVariety && (
          <p className="text-xs text-blue-600 font-medium">
            {item.selectedVariety.name}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemove}
          className="w-8 h-8 p-0"
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="w-8 h-8 p-0"
          disabled={isOutOfStock}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      <div className="text-right">
        <p className="font-medium">
          {formatNaira(
            (item.selectedVariety?.price || item.price) * item.quantity,
          )}
        </p>
      </div>
    </div>
  );
}

function CartSummary({
  cart,
  cartTotal,
  cartItemsCount,
  isCartOpen,
  setIsCartOpen,
  handleCartQuantityChange,
  clearCart,
  qr,
  isModifyingOrder = false,
  orderId,
}: CartSummaryProps) {
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    // Close the drawer immediately when order is being placed
    setIsCartOpen(false);

    try {
      // Get table details from QR code
      const qrCodeData = await fetch(`/api/qr/${qr}`).then((res) => res.json());

      if (!qrCodeData.success || !qrCodeData.data?.tableId) {
        throw new Error("Table details not found");
      }

      const orderData = {
        tableId: qrCodeData.data.tableId,
        qrId: qr,
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.selectedVariety?.price || item.price,
          name: item.name,
          selectedVarietyId: item.selectedVariety?.id,
        })),
        totalAmount: cartTotal,
        specialNotes:
          (
            document.getElementById("special-notes") as HTMLTextAreaElement
          )?.value?.trim() || undefined,
      };

      let result;

      if (isModifyingOrder && orderId) {
        // Modify existing order
        result = await modifyOrder({
          orderId,
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          specialNotes: orderData.specialNotes,
        });
      } else {
        // Create new order
        result = await createOrder(orderData);
      }

      if (result.success && result.orderId) {
        clearCart();
        // Clear modify order data from sessionStorage
        sessionStorage.removeItem("modifyOrderData");
        // Keep loading state for a moment to show the loader
        setTimeout(() => {
          // Navigate to order status page
          window.location.href = `/${qr}/order-status/${result.orderId}`;
        }, 1000);
      } else {
        throw new Error(result.error || "Failed to place order");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to place order");
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      {/* Full-screen loading overlay */}
      {isPlacingOrder && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
          <ChocoLoader
            label="Placing your order..."
            subLabel="Please wait while we process your order"
          />
        </div>
      )}

      {/* Cart Button - Only show if cart has items */}
      <div className="fixed bottom-20 right-10 z-40 flex items-end space-x-3">
        {cart.length > 0 && (
          <Button
            onClick={() => setIsCartOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-6 rounded-xl shadow-lg w-[300px] animate-in slide-in-from-bottom-4 duration-500"
          >
            <div className="flex justify-between items-center w-full">
              <span className="text-xl font-medium">Cart</span>
              <span className="text-xl font-bold text-white drop-shadow-sm">
                {formatNaira(cartTotal)}
              </span>
            </div>
          </Button>
        )}
      </div>

      {/* Bottom Slider - Only show if cart has items */}
      {isCartOpen && cart.length > 0 && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Slider Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md rounded-t-3xl h-[70vh] overflow-hidden shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Order</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-gray-500 hover:text-red-500"
                    title="Clear cart"
                  >
                    Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="overflow-y-auto h-[calc(70vh-230px)]">
              {cart.map((item) => (
                <CartItemRow
                  key={item.id + (item.selectedVariety?.id || "")}
                  item={item}
                  handleCartQuantityChange={handleCartQuantityChange}
                />
              ))}

              {/* Special Notes */}
              <div className="p-4 border-t border-gray-200">
                <label
                  htmlFor="special-notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Special Notes
                </label>
                <textarea
                  id="special-notes"
                  placeholder="Any special requests or instructions..."
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={2}
                />
              </div>
            </div>

            {/* Footer with Total and Checkout */}
            <div className="px-6 py-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-xl font-bold">
                  {formatNaira(cartTotal)}
                </span>
              </div>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-2xl py-6 rounded-xl"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isModifyingOrder ? "Update Order" : "Proceed to Order"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartSummary;
