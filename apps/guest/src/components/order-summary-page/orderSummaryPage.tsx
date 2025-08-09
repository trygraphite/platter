"use client";

import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { ChocoLoader } from "@platter/ui/components/choco-loader";
import { Label } from "@platter/ui/components/label";
import { toast } from "@platter/ui/components/sonner";
import { Textarea } from "@platter/ui/components/textarea";
import {
  ArrowLeft,
  Edit3,
  MessageSquare,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "@platter/ui/lib/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createOrder } from "@/app/actions/create-order";
import { formatNaira } from "@/utils";

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

interface MenuItemVariety {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  position: number;
  isAvailable: boolean;
  isDefault: boolean;
  menuItemId: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedVariety?: MenuItemVariety;
}

export function OrderSummaryPage({
  qrId,
  tableDetails,
  restaurantDetails,
}: OrderSummaryPageProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [specialNotes, setSpecialNotes] = useState("");
  const [showNotesField, setShowNotesField] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${qrId}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [qrId]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.selectedVariety?.price ?? item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const getItemDisplayPrice = (item: CartItem) => {
    return item.selectedVariety?.price ?? item.price;
  };

  const updateCartInStorage = (newCart: CartItem[]) => {
    localStorage.setItem(`cart-${qrId}`, JSON.stringify(newCart));
  };

  const handleRemoveItem = (itemId: string, varietyId?: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => {
        if (varietyId) {
          return !(
            item.id === itemId && item.selectedVariety?.id === varietyId
          );
        }
        return item.id !== itemId;
      });
      updateCartInStorage(newCart);
      return newCart;
    });
  };

  const handleQuantityChange = (
    itemId: string,
    varietyId: string | undefined,
    newQuantity: number,
  ) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId, varietyId);
      return;
    }

    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        if (varietyId) {
          if (item.id === itemId && item.selectedVariety?.id === varietyId) {
            return { ...item, quantity: newQuantity };
          }
        } else if (item.id === itemId && !item.selectedVariety) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      updateCartInStorage(newCart);
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
        setIsLoading(false);
        return;
      }

      const orderData = {
        tableId: tableDetails.id,
        qrId,
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: getItemDisplayPrice(item),
          name: item.name,
          selectedVarietyId: item.selectedVariety?.id,
        })),
        totalAmount: calculateTotal(),
        specialNotes: specialNotes.trim() || undefined,
      };
      const result = await createOrder(orderData);

      if (result.success && result.orderId) {
        localStorage.removeItem(`cart-${qrId}`);
        router.push(`/${qrId}/order-status/${result.orderId}`);
        toast.success("Order placed successfully!");
      } else {
        toast.error(
          result.error || "Failed to create order. Please try again.",
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <ChocoLoader />
          <p className="text-muted-foreground mt-4 text-center">
            Creating your order...
          </p>
        </div>
      );
    }

    return (
      <>
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some delicious items to get started
            </p>
            <Button onClick={handleBackToMenu} className="min-w-[140px]">
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item, index) => {
                const displayPrice = getItemDisplayPrice(item);
                const totalItemPrice = displayPrice * item.quantity;
                const uniqueKey = `${item.id}-${item.selectedVariety?.id || "default"}-${index}`;

                return (
                  <div
                    key={uniqueKey}
                    className="bg-card border rounded-lg p-4  hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder-food.jpg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-food.jpg";
                          }}
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg leading-tight mb-1">
                              {item.name}
                            </h3>

                            {/* Variety Information */}
                            {item.selectedVariety && (
                              <div className="mb-2">
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary border-red-500 text-sm rounded-md font-medium">
                                  <span>{item.selectedVariety.name}</span>
                                </div>
                                {item.selectedVariety.description && (
                                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    {item.selectedVariety.description}
                                  </p>
                                )}
                              </div>
                            )}

                            <p className="text-lg font-bold text-primary mb-3">
                              {formatNaira(displayPrice)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                            onClick={() =>
                              handleRemoveItem(
                                item.id,
                                item.selectedVariety?.id,
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Quantity Controls and Total */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-r-none border-r"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.selectedVariety?.id,
                                    item.quantity - 1,
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-4 py-2 min-w-[50px] text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-l-none border-l"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.selectedVariety?.id,
                                    item.quantity + 1,
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {formatNaira(totalItemPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special Notes Section */}
            <div className="border-t pt-6">
              <div className="space-y-4">
                {!showNotesField ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowNotesField(true)}
                    className="w-full justify-start gap-2 h-12 text-left"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Add special instructions or notes
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="special-notes"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Special Instructions
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowNotesField(false);
                          setSpecialNotes("");
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </Button>
                    </div>
                    <Textarea
                      id="special-notes"
                      placeholder="Any special requests, allergies, or cooking preferences..."
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      rows={3}
                      maxLength={500}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {specialNotes.length}/500 characters
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatNaira(calculateTotal())}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {cart.length} item{cart.length !== 1 ? "s" : ""} • Table{" "}
                  {tableDetails.number}
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderFooter = () => {
    if (isLoading) return null;

    if (cart.length > 0) {
      return (
        <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 bg-muted/20 border-t">
          <Button
            variant="outline"
            className="w-full sm:w-auto min-w-[140px]"
            onClick={handleBackToMenu}
          >
            Modify Order
          </Button>
          <Button
            className="w-full sm:flex-1 h-12 text-base font-semibold"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading
              ? "Creating Order..."
              : `Place Order • ${formatNaira(calculateTotal())}`}
          </Button>
        </CardFooter>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6 hover:bg-muted/50 transition-colors"
        onClick={handleBackToHome}
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Order Summary</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {restaurantDetails.name} • Table {tableDetails.number} •{" "}
                  {restaurantDetails.cuisine}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">{renderContent()}</CardContent>
          {renderFooter()}
        </Card>
      </div>
    </div>
  );
}
