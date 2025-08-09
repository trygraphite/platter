"use client";

import type {
  CartItem as CartItemType,
  CategoryGroup,
  MenuCategory,
  MenuItem,
  MenuItemVariety,
  Product,
  RestaurantDetails,
} from "@/types/menu";
import { formatNaira } from "@/utils";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import CartSummary from "./CartSummary";
// import FloatingActions from "./FloatingActions";
import MenuPageSkeleton from "./MenuPageSkeleton";
import MenuProductGrid from "./MenuProductGrid";
import RestaurantHeader from "./RestaurantHeader";

interface MenuPageProps {
  qrId: string;
  categories: MenuCategory[];
  restaurantDetails: RestaurantDetails;
  categoryGroups: CategoryGroup[];
}

// Custom hooks for reusable logic
function useCategories(items: MenuItem[]) {
  return useMemo(() => {
    return Array.from(
      new Set(items.map((item) => item.categoryId).filter(Boolean)),
    ) as string[];
  }, [items]);
}

// Convert MenuItem to Product format for compatibility
function convertMenuItemToProduct(
  item: MenuItem,
  categoryName: string,
): Product {
  return {
    _id: item.id,
    name: item.name,
    price: item.price,
    image: item.image || "",
    outOfStock: !item.isAvailable,
    description: item.description,
    category: {
      name: categoryName,
      group: {
        name: categoryName,
      },
    },
    varieties:
      item.varieties?.map((v) => ({
        _id: v.id,
        name: v.name,
        price: v.price,
        outOfStock: !v.isAvailable,
        description: v.description || undefined,
      })) || [],
  };
}

// MAIN COMPONENT
export function MenuPage({
  qrId,
  categories = [],
  categoryGroups = [],
  restaurantDetails,
}: MenuPageProps) {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModifyingOrder, setIsModifyingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | undefined>();

  // Flatten all menu items from all categories
  const allMenuItems = useMemo(() => {
    return categories.flatMap((category) =>
      category.menuItems.map((item) => ({
        ...item,
        categoryName: category.name,
      })),
    );
  }, [categories]);

  // Convert to Product format for MenuProductGrid
  const products = useMemo(() => {
    return allMenuItems.map((item) =>
      convertMenuItemToProduct(item, item.categoryName),
    );
  }, [allMenuItems]);

  // Get unique category names
  const categoryNames = useMemo(() => {
    return Array.from(new Set(categories.map((cat) => cat.name)));
  }, [categories]);

  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    if (categoryNames.length && !activeCategory) {
      setActiveCategory(categoryNames[0] || "");
    }
  }, [categoryNames, activeCategory]);

  // Load cart from localStorage or modify order data
  useEffect(() => {
    // Check if we're modifying an order
    const modifyOrderData = sessionStorage.getItem("modifyOrderData");
    if (modifyOrderData && categories.length > 0) {
      try {
        const orderData = JSON.parse(modifyOrderData);

        // Convert order items to cart items
        const cartItems =
          orderData.order.items?.map((orderItem: any) => {
            const menuItem = orderItem.menuItem;
            const variety = orderItem.variety;

            // Find the category for this menu item
            const category = categories.find((cat) =>
              cat.menuItems.some((item) => item.id === menuItem.id),
            );

            return {
              // MenuItem properties
              id: menuItem.id,
              name: menuItem.name,
              description: menuItem.description || "",
              price: Number(menuItem.price),
              image: menuItem.image,
              isAvailable: true,
              categoryId: category?.name || "General",
              varieties: variety
                ? [
                    {
                      id: variety.id,
                      name: variety.name,
                      description: variety.description || "",
                      price: Number(variety.price),
                      position: 0,
                      isAvailable: true,
                      isDefault: false,
                      menuItemId: menuItem.id,
                    },
                  ]
                : [],
              // CartItem specific properties
              quantity: orderItem.quantity,
              selectedVariety: variety
                ? {
                    id: variety.id,
                    name: variety.name,
                    description: variety.description || "",
                    price: Number(variety.price),
                    position: 0,
                    isAvailable: true,
                    isDefault: false,
                    menuItemId: menuItem.id,
                  }
                : undefined,
            };
          }) || [];

        setCart(cartItems);
        setIsModifyingOrder(true);
        setOrderId(orderData.orderId);
        // Auto-open cart when modifying order
        setIsCartOpen(true);

        // Set special notes if they exist
        if (orderData.specialNotes) {
          setTimeout(() => {
            const specialNotesTextarea = document.getElementById(
              "special-notes",
            ) as HTMLTextAreaElement;
            if (specialNotesTextarea) {
              specialNotesTextarea.value = orderData.specialNotes;
            }
          }, 100);
        }

        // Clear the modify order data from sessionStorage
        sessionStorage.removeItem("modifyOrderData");
      } catch (error) {
        console.error("Error parsing modify order data:", error);
      }
    } else {
      // Load cart from localStorage
      const savedCart = localStorage.getItem(`cart-${qrId}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [qrId, categories]);

  // Save cart to localStorage when it changes (but not when modifying order)
  useEffect(() => {
    if (!isModifyingOrder) {
      localStorage.setItem(`cart-${qrId}`, JSON.stringify(cart));
    }
  }, [cart, qrId, isModifyingOrder]);

  // open modal and set product on product click
  const openModalWithProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
  };

  // Cart handlers
  const addToCart = useCallback((product: Product, varietyId?: string) => {
    if (product.outOfStock) return;

    const selectedVarietyRaw = varietyId
      ? product.varieties?.find((v: any) => v._id === varietyId)
      : product.varieties && product.varieties.length === 1
        ? product.varieties[0]
        : undefined;

    const selectedVariety = selectedVarietyRaw
      ? {
          id: selectedVarietyRaw._id,
          name: selectedVarietyRaw.name,
          price: selectedVarietyRaw.price,
          isAvailable: !selectedVarietyRaw.outOfStock,
          description: selectedVarietyRaw.description,
          position: 0,
          isDefault: false,
          menuItemId: product._id,
        }
      : undefined;

    const menuItem: MenuItem = {
      id: product._id,
      name: product.name,
      price: selectedVariety?.price || product.price,
      image: product.image || "",
      isAvailable: !product.outOfStock,
      description: product.description,
      categoryId: product.category?.name || "General",
      varieties:
        product.varieties?.map((v) => ({
          id: v._id,
          name: v.name,
          price: v.price,
          isAvailable: !v.outOfStock,
          description: v.description,
          position: 0,
          isDefault: false,
          menuItemId: product._id,
        })) || [],
    };

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.id === menuItem.id &&
          (varietyId
            ? item.selectedVariety?.id === varietyId
            : !item.selectedVariety),
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === menuItem.id &&
          (varietyId
            ? item.selectedVariety?.id === varietyId
            : !item.selectedVariety)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      const newCartItem: CartItemType = {
        ...menuItem,
        quantity: 1,
        selectedVariety,
        price: selectedVariety?.price || menuItem.price,
      };

      return [...prevCart, newCartItem];
    });
  }, []);

  // Robust cart quantity handler
  const handleCartQuantityChange = useCallback(
    (product: Product, increment: boolean, varietyId?: string) => {
      const cartItem = cart.find(
        (item) =>
          item.id === product._id &&
          (varietyId
            ? item.selectedVariety?.id === varietyId
            : !item.selectedVariety),
      );

      if (cartItem) {
        if (!increment && cartItem.quantity === 1) {
          setCart((prevCart) =>
            prevCart.filter(
              (item) =>
                !(
                  item.id === product._id &&
                  (varietyId
                    ? item.selectedVariety?.id === varietyId
                    : !item.selectedVariety)
                ),
            ),
          );
        } else {
          setCart((prevCart) =>
            prevCart.map((item) =>
              item.id === product._id &&
              (varietyId
                ? item.selectedVariety?.id === varietyId
                : !item.selectedVariety)
                ? { ...item, quantity: item.quantity + (increment ? 1 : -1) }
                : item,
            ),
          );
        }
      } else if (increment) {
        addToCart(product, varietyId);
      }
    },
    [cart, addToCart],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setIsCartOpen(false);
    // Reset modify order state
    setIsModifyingOrder(false);
    setOrderId(undefined);
  }, []);

  // Calculate cart totals
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const itemPrice = item.selectedVariety
        ? item.selectedVariety.price
        : item.price;
      return total + Number(itemPrice) * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Mock functions for floating actions
  const callWaiter = (): void => {
    console.log("Calling waiter...");
  };

  const requestBill = (): void => {
    console.log("Requesting bill...");
  };

  // Handle home button click
  const handleHomeClick = (): void => {
    window.location.href = `/${qrId}`;
  };

  // Loading state
  if (!categories.length) {
    return <MenuPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-1000">
      <div className="animate-in slide-in-from-bottom-4 duration-700">
        <RestaurantHeader
          restaurant={restaurantDetails}
          qr={qrId}
          isLoading={false}
          onHomeClick={handleHomeClick}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-4 animate-in fade-in duration-1000 delay-300">
        <MenuProductGrid
          menuItems={products}
          categories={categoryNames}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          openModalWithProduct={openModalWithProduct}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          selectedProduct={selectedProduct}
          handleCartQuantityChange={handleCartQuantityChange}
          isLoading={false}
        />
      </div>

      <div className="animate-in fade-in duration-700 delay-500">
        <CartSummary
          cart={cart}
          cartTotal={cartTotal}
          cartItemsCount={cartItemsCount}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          handleCartQuantityChange={handleCartQuantityChange}
          clearCart={clearCart}
          qr={qrId}
          isModifyingOrder={isModifyingOrder}
          orderId={orderId}
        />
      </div>

      {/* Floating Actions - Commented out as requested */}
      {/* <FloatingActions
        callWaiter={callWaiter}
        requestBill={requestBill}
        cart={cart}
      /> */}
    </div>
  );
}
