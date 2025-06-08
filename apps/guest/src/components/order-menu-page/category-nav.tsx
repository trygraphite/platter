"use client"

import { cn } from "@platter/ui/lib/utils"
import { useRef, useEffect, useState } from "react"
import type { CategoryGroup, MenuCategory } from "@/types/menu"
import { ChevronLeft, ChevronRight } from "@platter/ui/lib/icons"

interface CategoryNavProps {
  categories: MenuCategory[]
  categoryGroups: CategoryGroup[]
  categoriesByGroup: Record<string, MenuCategory[]>
  selectedGroup: string | null
  selectedCategory: string | null
  onSelectGroup: (groupId: string | null) => void
  onSelectCategory: (categoryId: string | null) => void
}

export function CategoryNav({
  categories,
  categoryGroups,
  categoriesByGroup,
  selectedGroup,
  selectedCategory,
  onSelectGroup,
  onSelectCategory,
}: CategoryNavProps) {
  const groupsScrollContainerRef = useRef<HTMLDivElement>(null)
  const categoriesScrollContainerRef = useRef<HTMLDivElement>(null)
  
  const [showLeftGroupScroll, setShowLeftGroupScroll] = useState(false)
  const [showRightGroupScroll, setShowRightGroupScroll] = useState(false)
  const [showLeftCategoryScroll, setShowLeftCategoryScroll] = useState(false)
  const [showRightCategoryScroll, setShowRightCategoryScroll] = useState(false)

  // Check if scroll buttons should be visible for groups
  const checkGroupScrollButtons = () => {
    if (groupsScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = groupsScrollContainerRef.current
      setShowLeftGroupScroll(scrollLeft > 0)
      setShowRightGroupScroll(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Check if scroll buttons should be visible for categories
  const checkCategoryScrollButtons = () => {
    if (categoriesScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesScrollContainerRef.current
      setShowLeftCategoryScroll(scrollLeft > 0)
      setShowRightCategoryScroll(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Handle scroll events
  useEffect(() => {
    const groupsScrollContainer = groupsScrollContainerRef.current
    const categoriesScrollContainer = categoriesScrollContainerRef.current
    
    if (groupsScrollContainer) {
      groupsScrollContainer.addEventListener("scroll", checkGroupScrollButtons)
      checkGroupScrollButtons()
    }
    
    if (categoriesScrollContainer) {
      categoriesScrollContainer.addEventListener("scroll", checkCategoryScrollButtons)
      checkCategoryScrollButtons()
    }

    // Check on window resize
    window.addEventListener("resize", () => {
      checkGroupScrollButtons()
      checkCategoryScrollButtons()
    })

    return () => {
      if (groupsScrollContainer) {
        groupsScrollContainer.removeEventListener("scroll", checkGroupScrollButtons)
      }
      if (categoriesScrollContainer) {
        categoriesScrollContainer.removeEventListener("scroll", checkCategoryScrollButtons)
      }
      window.removeEventListener("resize", checkGroupScrollButtons)
      window.removeEventListener("resize", checkCategoryScrollButtons)
    }
  }, [])

  // Scroll functions for groups
  const scrollGroupsLeft = () => {
    if (groupsScrollContainerRef.current) {
      groupsScrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollGroupsRight = () => {
    if (groupsScrollContainerRef.current) {
      groupsScrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  // Scroll functions for categories
  const scrollCategoriesLeft = () => {
    if (categoriesScrollContainerRef.current) {
      categoriesScrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollCategoriesRight = () => {
    if (categoriesScrollContainerRef.current) {
      categoriesScrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  // Scroll selected category into view
  useEffect(() => {
    if (selectedCategory && categoriesScrollContainerRef.current) {
      const selectedButton = categoriesScrollContainerRef.current.querySelector(
        `[data-category-id="${selectedCategory}"]`
      ) as HTMLElement

      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [selectedCategory])

  // Scroll selected group into view
  useEffect(() => {
    if (selectedGroup && groupsScrollContainerRef.current) {
      const selectedButton = groupsScrollContainerRef.current.querySelector(
        `[data-group-id="${selectedGroup}"]`
      ) as HTMLElement

      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [selectedGroup])

  // Handle "All" button click
  const handleAllClick = () => {
    onSelectGroup(null)
    onSelectCategory(null)
  }

  // Get all categories or filtered by group
  const getDisplayedCategories = () => {
    if (!selectedGroup) return categories;
    return categoriesByGroup[selectedGroup] || [];
  }

  return (
    <div className="sticky top-0 z-10 bg-white shadow-md">
      <div className="container mx-auto">
        {/* Section Label for Groups */}
        <div className="px-4 pt-3 pb-1">
          <h3 className="text-sm font-medium text-gray-500">Groups</h3>
        </div>

        {/* Category Groups Navigation */}
        <div className="relative">
          {showLeftGroupScroll && (
            <button
              onClick={scrollGroupsLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1 shadow-md hidden md:block"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
          )}

          <div
            ref={groupsScrollContainerRef}
            className="overflow-x-auto flex space-x-2 py-2 px-2 md:px-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            <button
              onClick={handleAllClick}
              className={cn(
                "px-3 py-1.5 md:px-4 md:py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0 text-sm",
                !selectedGroup
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700",
              )}
            >
              All
            </button>

            {categoryGroups.map((group) => (
              <button
                key={group.id}
                data-group-id={group.id}
                onClick={() => onSelectGroup(group.id)}
                className={cn(
                  "px-3 py-1.5 md:px-4 md:py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0 text-sm",
                  selectedGroup === group.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                )}
              >
                {group.name}
              </button>
            ))}
          </div>

          {showRightGroupScroll && (
            <button
              onClick={scrollGroupsRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1 shadow-md hidden md:block"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>

        {/* Section Label for Categories */}
        <div className="px-4 pt-3 pb-1 border-t mt-1">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
        </div>

        {/* Categories Navigation */}
        <div className="relative">
          {showLeftCategoryScroll && (
            <button
              onClick={scrollCategoriesLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1 shadow-md hidden md:block"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
          )}

          <div
            ref={categoriesScrollContainerRef}
            className="overflow-x-auto flex space-x-2 py-2 px-2 md:px-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            <button
              onClick={() => onSelectCategory(null)}
              className={cn(
                "px-3 py-1.5 md:px-4 md:py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0 text-sm",
                !selectedCategory
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700",
              )}
            >
              All Categories
            </button>

            {getDisplayedCategories().map((category) => (
              <button
                key={category.id}
                data-category-id={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "px-3 py-1.5 md:px-4 md:py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0 text-sm",
                  selectedCategory === category.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {showRightCategoryScroll && (
            <button
              onClick={scrollCategoriesRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1 shadow-md hidden md:block"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}