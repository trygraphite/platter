"use client"
import { motion, AnimatePresence } from "framer-motion"
import type { CartItem, CategoryGroup, MenuCategory, MenuItem } from "@/types/menu"
import { MenuItemCard } from "./menu-item-card"
import { useEffect } from "react"

interface DynamicMenuProps {
  categories: MenuCategory[]
  selectedCategory: string | null
  selectedGroup: string | null
  categoryGroups: CategoryGroup[]
  cart: CartItem[]
  onQuantityChange: (item: MenuItem, increment: boolean) => void
  formatPrice: (price: number | string | null | undefined) => string
}

export function DynamicMenu({
  categories,
  selectedCategory,
  selectedGroup,
  categoryGroups,
  cart,
  onQuantityChange,
  formatPrice
}: DynamicMenuProps) {
  // Log for debugging
  useEffect(() => {
    console.log("Categories received:", categories);
    console.log("Selected category:", selectedCategory);
    console.log("Selected group:", selectedGroup);
  }, [categories, selectedCategory, selectedGroup]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }
  
  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.03,
      },
    },
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${selectedCategory || "all"}-${selectedGroup || "all"}-${categories.length}`}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
        className="space-y-6 md:space-y-10"
      >
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <motion.div key={category.id} variants={categoryVariants} className="mb-6 md:mb-8">
              <div className="flex items-center mb-3 md:mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{category.name}</h2>
                <div className="ml-4 h-px bg-gray-200 flex-grow"></div>
              </div>
              
              {category.menuItems && category.menuItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {category.menuItems.map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <MenuItemCard
                        item={item}
                        inCart={cart.some((cartItem) => cartItem.id === item.id)}
                        quantity={cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0}
                        onQuantityChange={onQuantityChange}
                        formatPrice={formatPrice}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No items in this category</p>
              )}
            </motion.div>
          ))
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 md:py-20">
            <h3 className="text-xl md:text-2xl font-medium text-gray-500">No menu items found</h3>
            <p className="text-gray-400 mt-2 text-sm md:text-base">Try selecting a different category</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}