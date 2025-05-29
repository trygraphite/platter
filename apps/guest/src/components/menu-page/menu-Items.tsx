"use client"
import { MenuItemVariety } from "@platter/db/client"
import { MenuCard } from "./menu-card"
import { motion, AnimatePresence } from "framer-motion"


interface Category {
  id: string
  name: string
}

interface CategoryGroup {
  id: string
  name: string
  description?: string | null
  categories: Category[]
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

interface MenuItemsProps {
  menuItems: MenuItem[]
  categoryGroups: CategoryGroup[]
  ungroupedCategories: Category[]
  selectedGroup: string | null
  selectedCategory: string | null
}

export function MenuItems({
  menuItems,
  categoryGroups,
  ungroupedCategories,
  selectedGroup,
  selectedCategory,
}: MenuItemsProps) {
  // Filter items based on selection
  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory) {
      return item.categoryId === selectedCategory
    }

    if (selectedGroup) {
      const categoryInGroup = categoryGroups
        .find((group) => group.id === selectedGroup)
        ?.categories.some((cat) => cat.id === item.categoryId)
      return !!categoryInGroup
    }

    return true
  })

  // Group items by category group, then by category
  const organizeMenuItems = () => {
    const organized: Record<
      string,
      {
        groupName: string
        groupId: string | null
        categories: Record<
          string,
          {
            categoryName: string
            items: MenuItem[]
          }
        >
      }
    > = {}

    // Initialize with category groups
    categoryGroups.forEach((group) => {
      organized[group.id] = {
        groupName: group.name,
        groupId: group.id,
        categories: {},
      }
    })

    // Add a special group for ungrouped categories
    organized["ungrouped"] = {
      groupName: "Other Items",
      groupId: null,
      categories: {},
    }

    // Organize filtered items
    filteredItems.forEach((item) => {
      const groupId = item.category.categoryGroup?.id || "ungrouped"
      const categoryId = item.category.id

      // Skip if we don't need to show this group
      if (selectedGroup && groupId !== selectedGroup && groupId !== "ungrouped") {
        return
      }

      // Ensure the group exists
      if (!organized[groupId]) {
        organized[groupId] = {
          groupName: item.category.categoryGroup?.name || "Other Items",
          groupId: item.category.categoryGroup?.id || null,
          categories: {},
        }
      }

      // Ensure the category exists in the group
      if (!organized[groupId].categories[categoryId]) {
        organized[groupId].categories[categoryId] = {
          categoryName: item.category.name,
          items: [],
        }
      }

      // Add the item to its category
      organized[groupId].categories[categoryId].items.push(item)
    })

    return organized
  }

  const organizedItems = organizeMenuItems()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const groupVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <main className="container max-w-6xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedGroup}-${selectedCategory}`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="space-y-16"
        >
          {Object.entries(organizedItems).map(([groupId, group]) => {
            // Skip empty groups
            if (Object.keys(group.categories).length === 0) return null

            return (
              <motion.div key={groupId} variants={groupVariants} className="mb-12">
                {/* Only show group headers if we're not filtering by category */}
                {!selectedCategory && Object.keys(organizedItems).length > 1 && (
                  <div className="relative mb-8">
                    <h2 className="text-3xl font-bold text-primary inline-block relative">
                      {group.groupName}
                      <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary/30 rounded-full"></span>
                    </h2>
                    {group.groupId && (
                      <p className="text-gray-600 mt-2 max-w-2xl">
                        {categoryGroups.find((g) => g.id === group.groupId)?.description}
                      </p>
                    )}
                  </div>
                )}

                {Object.entries(group.categories).map(([categoryId, category]) => (
                  <motion.div key={categoryId} className="mb-10" variants={itemVariants}>
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                      <span className="mr-3">{category.categoryName}</span>
                      <span className="h-px bg-gray-300 flex-grow"></span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.items.map((item) => (
                        <motion.div key={item.id} variants={itemVariants}>
                          <MenuCard item={item} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )
          })}

          {filteredItems.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <h3 className="text-2xl font-medium text-gray-500">No menu items found</h3>
              <p className="text-gray-400 mt-2">Try selecting a different category or group</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}