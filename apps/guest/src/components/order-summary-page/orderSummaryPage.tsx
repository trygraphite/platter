"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@platter/ui/components/card";
import { ArrowLeft, ShoppingBag, Trash2 } from "@platter/ui/lib/icons";
import { toast } from "@platter/ui/components/sonner";
import { createOrder } from "@/app/actions/create-order";

interface OrderSummaryPageProps {
  qrId: string;
  domain: string;
  tableDetails: {
    id: string;
    number: string;
    capacity: number;
    isAvailable: boolean;
  };
  restaurantDetails: {
    name: string;
    description: string;
    image: string;
    cuisine: string;
  };
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function OrderSummaryPage({
  qrId,
  tableDetails,
  restaurantDetails,
}: OrderSummaryPageProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${qrId}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [qrId]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== itemId);
      localStorage.setItem(`cart-${qrId}`, JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleBackToMenu = () => {
    router.push(`/${qrId}/menu`);
  };

  const handleBackToHome = () => {
    router.push(`/${qrId}`);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      if (!tableDetails?.id) {
        toast.error("Table details not found");
        return;
      }

      const orderData = {
        tableId: tableDetails.id,
        qrId,
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        totalAmount: calculateTotal(),
      };

      console.log("Client-side order data:", orderData);
      const result = await createOrder(orderData);

      if (result.success && result.orderId) {
        // Clear the cart
        localStorage.removeItem(`cart-${qrId}`);
        setCart([]);
        // Redirect to order status page
        router.push(`/${qrId}/order-status/${result.orderId}`);
      } else {
        toast.error(
          result.error || "Failed to create order. Please try again.",
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="ghost"
        className="mb-6 hover:bg-transparent"
        onClick={handleBackToHome}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <CardTitle>
                Order Summary for {restaurantDetails.name} Table{" "}
                {tableDetails.number}
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {restaurantDetails.cuisine}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button onClick={handleBackToMenu}>Return to Menu</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    {/* Image and Item Details */}
                    <div className="flex items-center gap-4 flex-1">
                      {/* Image */}
                      <img
                        src={item.image} // Replace with the correct path to the item's image
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded" // Adjust size and styling as needed
                      />

                      {/* Item Details */}
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ₦{Number(item.price).toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Total Price and Remove Button */}
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">
                        ₦{(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>₦{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {cart.length > 0 && (
            <CardFooter className="flex flex-col sm:flex-row gap-4 p-6 bg-muted/10">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleBackToMenu}
              >
                Modify Order
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? "Creating Order..." : "Place Order"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
