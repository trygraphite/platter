"use client";

import { createOrder } from "@/lib/actions/order-actions";
import type { Table } from "@prisma/client";

interface MenuItemWithServicePoint {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  categoryId: string;
  servicePointId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  servicePoint?: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
  } | null;
}
import { Info, Minus, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { Input } from "@platter/ui/components/input";
import { ScrollArea } from "@platter/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { Separator } from "@platter/ui/components/separator";

interface CreateOrderProps {
  onCancel: () => void;
  userId: string;
  tables: Table[];
}

export default function CreateOrder({
  onCancel,
  userId,
  tables,
}: CreateOrderProps) {
  const [selectedItems, setSelectedItems] = useState<
    Array<{
      menuItemId: string;
      name: string;
      quantity: number;
      price: number;
      servicePoint?: {
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
      } | null;
    }>
  >([]);
  const [tableId, setTableId] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItemWithServicePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<"TABLE" | "PICKUP">("TABLE");
  const [lastOrderNumber, setLastOrderNumber] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const fetchLastOrderNumber = async () => {
      try {
        const response = await fetch(`/api/orders/last?userId=${userId}`);
        const data = await response.json();
        setLastOrderNumber(data.lastOrderNumber);
      } catch (error) {
        console.error("Error fetching last order number:", error);
      }
    };
    fetchLastOrderNumber();
  }, [userId]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/menu-items?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError("An error occurred while fetching menu items");
        console.error("Error fetching menu items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [userId]);

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addItem = (menuItem: MenuItemWithServicePoint) => {
    const existingItem = selectedItems.find(
      (item) => item.menuItemId === menuItem.id,
    );
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          quantity: 1,
          price: menuItem.price,
          servicePoint: menuItem.servicePoint,
        },
      ]);
    }
  };

  const removeItem = (menuItemId: string) => {
    setSelectedItems(
      selectedItems.filter((item) => item.menuItemId !== menuItemId),
    );
  };

  const updateQuantity = (menuItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(menuItemId);
      return;
    }
    setSelectedItems(
      selectedItems.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0 || isSubmitting) return;

    // Validate table selection for table orders
    if (orderType === "TABLE" && !tableId) {
      setError("Please select a table for table orders");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      userId,
      orderType,
      tableId: orderType === "TABLE" ? tableId : null, // Explicit null for pickup
      items: selectedItems.map(({ menuItemId, quantity, price, name }) => ({
        id: menuItemId,
        quantity,
        price,
        name,
      })),
      totalAmount,
    };

    try {
      const result = await createOrder(orderData);

      if (result.success) {
        router.refresh();
        onCancel();
      } else {
        setError(result.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return <div className="text-center py-8">Loading menu items...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create Manual Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className={isSubmitting ? "opacity-50" : ""}
        >
          <div className="space-y-6">
            {/* Search Menu Items */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Menu Items Grid */}
            <ScrollArea className="h-60 w-full rounded-md border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {filteredMenuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="flex justify-between items-center w-full"
                    type="button"
                    onClick={() => addItem(item)}
                  >
                    <span>
                      {item.name}
                      {item.servicePoint && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({item.servicePoint.name})
                        </span>
                      )}
                    </span>
                    <Badge variant="secondary">₦{item.price.toFixed(2)}</Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Selected Items</h3>
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="flex items-center justify-between p-3 bg-secondary/20 rounded-md"
                    >
                      <span className="flex-1">
                        {item.name}
                        {item.servicePoint && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({item.servicePoint.name})
                          </span>
                        )}
                      </span>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() =>
                            updateQuantity(item.menuItemId, item.quantity - 1)
                          }
                        >
                          <Minus size={16} />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() =>
                            updateQuantity(item.menuItemId, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => removeItem(item.menuItemId)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Type Selection */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={orderType === "TABLE" ? "default" : "outline"}
                  onClick={() => setOrderType("TABLE")}
                >
                  Table Order
                </Button>
                <Button
                  type="button"
                  variant={orderType === "PICKUP" ? "default" : "outline"}
                  onClick={() => setOrderType("PICKUP")}
                >
                  Pickup Order
                </Button>
              </div>

              {orderType === "TABLE" ? (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Table
                  </label>
                  <Select value={tableId} onValueChange={setTableId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a table" />
                    </SelectTrigger>
                    <SelectContent>
                      {tables.map((table) => (
                        <SelectItem key={table.id} value={table.id}>
                          Table {table.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>
                    Pickup orders will use system-generated order numbers
                  </span>
                </div>
              )}

              {/* Special Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Special Notes (Optional)
                </label>
                <Input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Enter special instructions"
                />
              </div>
            </div>

            <Separator className="my-4" />

            {/* Total and Actions */}
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold">
                Total: ₦{totalAmount.toFixed(2)}
              </div>
              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    selectedItems.length === 0 ||
                    (orderType === "TABLE" && !tableId) ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? "Creating Order..." : "Create Order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
