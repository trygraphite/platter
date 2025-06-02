"use client"

import { CartItem as CartItemType, MenuItemVariety } from "@/types/menu"
import type { CategoryGroup, MenuCategory, MenuItem, RestaurantDetails } from "@/types/menu"
import { Card, CardContent, CardHeader, CardTitle } from "@platter/ui/components/card"
import { ShoppingBag, X } from "@platter/ui/lib/icons"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useMemo } from "react"
import { CategoryNav } from "./category-nav"
import { DynamicMenu } from "./dynamic-menu"
import { CartItem } from "./cart-items"
import { Button } from "@platter/ui/components/button"

interface MenuPageProps {
  qrId: string
  categories: MenuCategory[]
  restaurantDetails: RestaurantDetails
  categoryGroups: CategoryGroup[]
}

export const formatPrice = (price: number | string | null | undefined): string => {
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : Number(price)

  if (Number.isNaN(numPrice)) return "0.00"

  // Format with commas after each 3 zeros
  return numPrice.toLocaleString("en-NG")
}

export function MenuPage({ qrId, categories = [], categoryGroups = [], restaurantDetails }: MenuPageProps) {
  const [cart, setCart] = useState<CartItemType[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const router = useRouter()

  // Use useMemo to prevent recreating this function on every render
  const organizedCategories = useMemo(() => {
    const grouped: Record<string, MenuCategory[]> = {}

    // Initialize with category groups
    if (categoryGroups && categoryGroups.length > 0) {
      categoryGroups.forEach((group) => {
        grouped[group.id] = []
      })
    }

    // Add a special group for ungrouped categories
    grouped["ungrouped"] = []

    // Organize categories
    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        const groupId = category.groupId || "ungrouped"
        if (grouped[groupId]) {
          grouped[groupId].push(category)
        } else if (grouped["ungrouped"]) {
          grouped["ungrouped"].push(category)
        }
      })
    }

    return grouped
  }, [categories, categoryGroups])

  // Using useMemo for currentCategories instead of useState + useEffect
  // This prevents the infinite loop by making it purely derived state
  const currentCategories = useMemo(() => {
    let newCategories: MenuCategory[] = [];
    
    // Handle "All Categories" case
    if (selectedGroup === null && selectedCategory === null) {
      // If neither group nor category is selected, show all categories
      return categories;
    }
    // Handle specific category selection
    else if (selectedCategory) {
      // If a specific category is selected, return only that category
      const foundCategory = categories.find(cat => cat.id === selectedCategory);
      newCategories = foundCategory ? [foundCategory] : [];
    }
    // Handle group selection
    else if (selectedGroup && organizedCategories[selectedGroup]) {
      // If a group is selected but no specific category, return all categories in that group
      newCategories = organizedCategories[selectedGroup];
    }
    // Handle "ungrouped" categories
    else {
      // If selection is "ungrouped", return ungrouped categories
      newCategories = organizedCategories["ungrouped"] || [];
    }
    
    return newCategories;
  }, [selectedCategory, selectedGroup, categories, organizedCategories]);

  // Load cart from localStorage - only runs once
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart-${qrId}`)
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [qrId])

  // Set initial state - runs only once on component mount
  useEffect(() => {
    // Using a ref to ensure this only runs once
    const shouldInitializeCategories = selectedGroup === null && selectedCategory === null;
    
    if (shouldInitializeCategories) {
      // By default, we'll show all categories (keeping both null)
      // Only set a specific category if there are no category groups
      if (!categoryGroups?.length && categories?.length > 0 && categories[0]) {
        setSelectedCategory(categories[0].id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array to ensure this runs only once on mount

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(`cart-${qrId}`, JSON.stringify(cart))
  }, [cart, qrId])

  // Lock body scroll when cart is open on mobile
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isCartOpen])

  // Updated handleQuantityChange to support varieties
  const handleQuantityChange = useCallback((item: MenuItem, increment: boolean, variety?: MenuItemVariety) => {
    setCart((prevCart) => {
      // Create a unique identifier for the cart item (item + variety combination)
      const cartItemId = variety ? `${item.id}-${variety.id}` : item.id
      
      const existingItem = prevCart.find((cartItem) => {
        if (variety) {
          return cartItem.id === item.id && cartItem.selectedVariety?.id === variety.id
        }
        return cartItem.id === item.id && !cartItem.selectedVariety
      })

      if (existingItem) {
        if (!increment && existingItem.quantity === 1) {
          // Remove item from cart
          return prevCart.filter((cartItem) => {
            if (variety) {
              return !(cartItem.id === item.id && cartItem.selectedVariety?.id === variety.id)
            }
            return !(cartItem.id === item.id && !cartItem.selectedVariety)
          })
        }
        // Update quantity
        return prevCart.map((cartItem) => {
          const isMatchingItem = variety 
            ? (cartItem.id === item.id && cartItem.selectedVariety?.id === variety.id)
            : (cartItem.id === item.id && !cartItem.selectedVariety)
          
          return isMatchingItem
            ? {
                ...cartItem,
                quantity: increment ? cartItem.quantity + 1 : cartItem.quantity - 1,
              }
            : cartItem
        })
      }
      
      // Add new item to cart
      const newCartItem: CartItemType = {
        ...item,
        quantity: 1,
        selectedVariety: variety,
        // Update price to variety price if variety is selected
        price: variety ? variety.price : item.price
      }
      
      return [...prevCart, newCartItem]
    })
  }, [])

  const calculateTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const itemPrice = item.selectedVariety ? item.selectedVariety.price : item.price
      return total + Number(itemPrice) * item.quantity
    }, 0)
  }, [cart])

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string | null) => {
    // If we're selecting the same category again, do nothing to prevent unnecessary re-renders
    if (categoryId === selectedCategory) return;
    
    setSelectedCategory(categoryId)

    // If a category is selected, find which group it belongs to
    if (categoryId) {
      for (const [groupId, groupCategories] of Object.entries(organizedCategories)) {
        if (groupCategories.some((cat) => cat.id === categoryId)) {
          if (groupId === "ungrouped") {
            // Only update if needed to prevent unnecessary re-renders
            if (selectedGroup !== null) setSelectedGroup(null);
          } else if (groupId !== selectedGroup) {
            setSelectedGroup(groupId);
          }
          return
        }
      }
    }
  }, [organizedCategories, selectedCategory, selectedGroup])

  // Handle group selection
  const handleGroupSelect = useCallback((groupId: string | null) => {
    // If we're selecting the same group again, do nothing to prevent unnecessary re-renders
    if (groupId === selectedGroup) return;
    
    // Set the selected group
    setSelectedGroup(groupId)
    
    // When selecting a group, clear category selection
    setSelectedCategory(null)
  }, [selectedGroup])

  // Function to handle cart click - direct redirect to order summary
  const handleCartClick = useCallback(() => {
    if (cart.length > 0) {
      router.push(`/${qrId}/order-summary`)
    }
  }, [cart.length, router, qrId])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="relative">
        {restaurantDetails?.image && restaurantDetails.image.startsWith("http") && (
          <div className="relative w-full h-48 md:h-64">
            <Image
              src={restaurantDetails.image || "/placeholder.svg"}
              alt={restaurantDetails.name || "Restaurant"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
          </div>
        )}

        <div
          className={`container mx-auto p-4 ${
            restaurantDetails?.image ? "relative -mt-24 md:-mt-32 z-10 text-white" : ""
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurantDetails?.name || "Restaurant Menu"}</h1>
          <p
            className={`${
              restaurantDetails?.image ? "text-white/90" : "text-muted-foreground"
            } max-w-2xl text-sm md:text-base`}
          >
            {restaurantDetails?.description || ""}
          </p>
          <div className="flex gap-4 mt-3 text-xs md:text-sm">
            <span className={restaurantDetails?.image ? "text-white/80" : ""}>{restaurantDetails?.cuisine || ""}</span>
            {restaurantDetails?.cuisine && restaurantDetails?.openingHours && (
              <span className={restaurantDetails?.image ? "text-white/80" : ""}>•</span>
            )}
            {restaurantDetails?.openingHours && restaurantDetails?.closingHours && (
              <span className={restaurantDetails?.image ? "text-white/80" : ""}>
                {restaurantDetails.openingHours} - {restaurantDetails.closingHours}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryNav
        categories={categories || []}
        categoryGroups={categoryGroups || []}
        categoriesByGroup={organizedCategories}
        selectedGroup={selectedGroup}
        selectedCategory={selectedCategory}
        onSelectGroup={handleGroupSelect}
        onSelectCategory={handleCategorySelect}
      />

      <div className="container mx-auto p-4 pb-24 md:pb-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Menu Section */}
          <div className="w-full md:w-2/3">
            <DynamicMenu
              categories={currentCategories}
              selectedCategory={selectedCategory}
              selectedGroup={selectedGroup}
              categoryGroups={categoryGroups || []}
              cart={cart}
              onQuantityChange={handleQuantityChange}
              formatPrice={formatPrice}
            />
          </div>

          {/* Desktop Cart Section */}
          <div className="hidden md:block w-full md:w-1/3">
            <Card className="sticky top-4 shadow-md border-0">
              <CardHeader className="bg-primary text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Your Cart
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                      {cart.map((item, index) => (
                        <CartItem
                          key={`${item.id}-${item.selectedVariety?.id || 'no-variety'}-${index}`}
                          item={item}
                          formatPrice={formatPrice}
                          onQuantityChange={handleQuantityChange}
                        />
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total:</span>
                        <span>₦{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleCartClick}
                      className="w-full mt-4 bg-primary hover:bg-primary/90"
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

      {/* Mobile Cart Button - Now directly redirects to order summary */}
      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg z-20">
          <Button onClick={handleCartClick} className="w-full bg-primary hover:bg-primary/90 py-6 rounded-lg">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <span>
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                </span>
              </div>
              <span className="font-bold">₦{formatPrice(calculateTotal())}</span>
            </div>
          </Button>
        </div>
      )}

      {/* Mobile Cart Drawer - Kept for potential future use or if needed for other interactions */}
      {isCartOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex flex-col">
          <div className="mt-auto bg-white rounded-t-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Your Cart
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="overflow-y-auto flex-grow p-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <CartItem
                      key={`${item.id}-${item.selectedVariety?.id || 'no-variety'}-${index}`}
                      item={item}
                      formatPrice={formatPrice}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t mt-auto">
                <div className="flex justify-between items-center font-bold text-lg mb-4">
                  <span>Total:</span>
                  <span>₦{formatPrice(calculateTotal())}</span>
                </div>
                <Button
                  onClick={handleCartClick}
                  className="w-full bg-primary hover:bg-primary/90 py-6"
                  size="lg"
                >
                  Review Order
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}