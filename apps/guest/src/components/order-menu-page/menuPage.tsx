"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@platter/ui/components/button";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@platter/ui/components/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@platter/ui/components/accordion";
import { MinusCircle, PlusCircle, ShoppingBag } from "@platter/ui/lib/icons";
import {  MenuItem } from "@platter/db/client";

interface MenuPageProps {
  qrId: string;
  category: Category[];
  restaurantDetails: {
    name: string;
    description: string;
    image: string;
    cuisine: string;
    openingHours: string;
    closingHours: string;
  };
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  menuItems: MenuItem[];
}

const formatPrice = (price: number | string | null | undefined): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : Number(price);
  return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
};

export function MenuPage({ qrId, category, restaurantDetails }: MenuPageProps) {
  const [categories, setCategories] = useState<Category[]>(category);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${qrId}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (category.length > 0 && category[0]?.id) {
      setActiveCategory(category[0].id);
    }
  }, [qrId, category]);

  useEffect(() => {
    localStorage.setItem(`cart-${qrId}`, JSON.stringify(cart));
  }, [cart, qrId]);

  const handleQuantityChange = (item: MenuItem, increment: boolean) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        if (!increment && existingItem.quantity === 1) {
          return prevCart.filter((cartItem) => cartItem.id !== item.id);
        }
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: increment
                  ? cartItem.quantity + 1
                  : cartItem.quantity - 1,
              }
            : cartItem,
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );
  };

  return (
    <div className="container mx-auto p-4 pb-32 md:pb-4">
      {/* Restaurant Details Header */}
      <div className="mb-8">
        {restaurantDetails.image && (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={restaurantDetails.image}
              alt={restaurantDetails.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold">{restaurantDetails.name}</h1>
        <p className="text-muted-foreground">{restaurantDetails.description}</p>
        <div className="flex gap-4 mt-2 text-sm">
          <span>{restaurantDetails.cuisine}</span>
          <span>•</span>
          <span>{restaurantDetails.openingHours} - {restaurantDetails.closingHours}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Menu Section */}
        <div className="w-full md:w-2/3">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={activeCategory}
            onValueChange={setActiveCategory}
          >
            {categories.map((category) => (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border rounded-lg mb-4"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
                  <span className="text-lg font-semibold">{category.name}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-2">
                  <div className="grid gap-4">
                    {category.menuItems.map((item) => (
                      <Card
                        key={item.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-row p-4">
                          <div className="flex-1 pr-4 space-y-4">
                            <h3 className="text-lg font-semibold mb-2">
                              {item.name}
                            </h3>
                            <p className="text-muted-foreground mb-2">
                              {item.description}
                            </p>
                            <span className="text-lg font-bold">
                              ₦{formatPrice(Number(item.price))}
                            </span>
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            {item.image && (
                              <div className="relative w-[105px] h-24 mb-2">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-md"
                                />
                              </div>
                            )}
                            {cart.find((cartItem) => cartItem.id === item.id) ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item, false)}
                                >
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">
                                  {cart.find((cartItem) => cartItem.id === item.id)?.quantity}
                                </span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item, true)}
                                >
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button onClick={() => handleQuantityChange(item, true)}>
                                Add to Cart
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Cart Section */}
        <div className="w-full md:w-1/3">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Your Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ₦{formatPrice(Number(item.price))} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₦{formatPrice(Number(item.price) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span>₦{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push(`/${qrId}/order-summary`)}
                    className="w-full mt-4"
                    size="lg"
                  >
                    Review Order
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}