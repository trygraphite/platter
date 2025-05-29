// Updated DynamicMenu component with varieties
"use client"

import { useState } from "react"
import { CategoryNav } from "./category-nav"
import { MenuItems } from "./menu-Items"

interface MenuItemVariety {
  id: string
  name: string
  description: string | null
  price: number
  position: number
  isAvailable: boolean
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
  menuItemId: string
  userId: string
}

interface CategoryGroup {
  id: string
  name: string
  description?: string | null
  categories: Category[]
}

interface Category {
  id: string
  name: string
  description?: string | null
  groupId?: string | null
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  categoryId: string
  varieties: MenuItemVariety[]
  category: {
    id: string
    name: string
    categoryGroup?: {
      id: string
      name: string
    } | null
  }
}

interface DynamicMenuProps {
  initialCategoryGroups: CategoryGroup[]
  initialUngroupedCategories: Category[]
  initialMenuItems: MenuItem[]
}

export function DynamicMenu({ initialCategoryGroups, initialUngroupedCategories, initialMenuItems }: DynamicMenuProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)

    // If a category is selected, we don't filter by group
    if (categoryId) {
      // Find which group this category belongs to
      for (const group of initialCategoryGroups) {
        if (group.categories.some((cat) => cat.id === categoryId)) {
          setSelectedGroup(group.id)
          return
        }
      }
      // If not found in any group, it's an ungrouped category
      setSelectedGroup(null)
    }
  }

  // Handle group selection
  const handleGroupSelect = (groupId: string | null) => {
    setSelectedGroup(groupId)
    setSelectedCategory(null)
  }

  return (
    <div className="pb-20">
      <CategoryNav
        categoryGroups={initialCategoryGroups}
        ungroupedCategories={initialUngroupedCategories}
        selectedGroup={selectedGroup}
        selectedCategory={selectedCategory}
        onSelectGroup={handleGroupSelect}
        onSelectCategory={handleCategorySelect}
      />
      <MenuItems
        menuItems={initialMenuItems}
        categoryGroups={initialCategoryGroups}
        ungroupedCategories={initialUngroupedCategories}
        selectedGroup={selectedGroup}
        selectedCategory={selectedCategory}
      />
    </div>
  )
}