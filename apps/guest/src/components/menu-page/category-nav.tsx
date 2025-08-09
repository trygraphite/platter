"use client";

import { ChevronLeft, ChevronRight } from "@platter/ui/lib/icons";
import { cn } from "@platter/ui/lib/utils";
import { useEffect, useRef, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  categories: Category[];
}

interface CategoryNavProps {
  categoryGroups: CategoryGroup[];
  ungroupedCategories: Category[];
  selectedGroup: string | null;
  selectedCategory: string | null;
  onSelectGroup: (groupId: string | null) => void;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryNav({
  categoryGroups,
  ungroupedCategories,
  selectedGroup,
  selectedCategory,
  onSelectGroup,
  onSelectCategory,
}: CategoryNavProps): JSX.Element {
  const groupsScrollContainerRef = useRef<HTMLDivElement>(null);
  const categoriesScrollContainerRef = useRef<HTMLDivElement>(null);

  const [showLeftGroupScroll, setShowLeftGroupScroll] = useState(false);
  const [showRightGroupScroll, setShowRightGroupScroll] = useState(false);
  const [showLeftCategoryScroll, setShowLeftCategoryScroll] = useState(false);
  const [showRightCategoryScroll, setShowRightCategoryScroll] = useState(false);

  // Check if group scroll buttons should be visible
  const checkGroupScrollButtons = () => {
    if (groupsScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        groupsScrollContainerRef.current;
      setShowLeftGroupScroll(scrollLeft > 0);
      setShowRightGroupScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Check if category scroll buttons should be visible
  const checkCategoryScrollButtons = () => {
    if (categoriesScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        categoriesScrollContainerRef.current;
      setShowLeftCategoryScroll(scrollLeft > 0);
      setShowRightCategoryScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Handle scroll events
  useEffect(() => {
    const groupsScrollContainer = groupsScrollContainerRef.current;
    const categoriesScrollContainer = categoriesScrollContainerRef.current;

    if (groupsScrollContainer) {
      groupsScrollContainer.addEventListener("scroll", checkGroupScrollButtons);
      checkGroupScrollButtons();
    }

    if (categoriesScrollContainer) {
      categoriesScrollContainer.addEventListener(
        "scroll",
        checkCategoryScrollButtons,
      );
      checkCategoryScrollButtons();
    }

    // Check on window resize
    window.addEventListener("resize", () => {
      checkGroupScrollButtons();
      checkCategoryScrollButtons();
    });

    return () => {
      if (groupsScrollContainer) {
        groupsScrollContainer.removeEventListener(
          "scroll",
          checkGroupScrollButtons,
        );
      }
      if (categoriesScrollContainer) {
        categoriesScrollContainer.removeEventListener(
          "scroll",
          checkCategoryScrollButtons,
        );
      }
      window.removeEventListener("resize", checkGroupScrollButtons);
      window.removeEventListener("resize", checkCategoryScrollButtons);
    };
  }, [checkCategoryScrollButtons, checkGroupScrollButtons]);

  // Scroll functions for groups
  const scrollGroupsLeft = () => {
    if (groupsScrollContainerRef.current) {
      groupsScrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollGroupsRight = () => {
    if (groupsScrollContainerRef.current) {
      groupsScrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  // Scroll functions for categories
  const scrollCategoriesLeft = () => {
    if (categoriesScrollContainerRef.current) {
      categoriesScrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollCategoriesRight = () => {
    if (categoriesScrollContainerRef.current) {
      categoriesScrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  // Handle "All" button click
  const handleAllClick = () => {
    onSelectGroup(null);
    onSelectCategory(null);
  };

  // Get categories for the selected group
  const getActiveCategories = () => {
    if (!selectedGroup) return ungroupedCategories;
    const group = categoryGroups.find((g) => g.id === selectedGroup);
    return group ? group.categories : [];
  };

  // Scroll selected category into view
  useEffect(() => {
    if (selectedCategory && categoriesScrollContainerRef.current) {
      const selectedButton = categoriesScrollContainerRef.current.querySelector(
        `[data-category-id="${selectedCategory}"]`,
      ) as HTMLElement;

      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedCategory]);

  // Scroll selected group into view
  useEffect(() => {
    if (selectedGroup && groupsScrollContainerRef.current) {
      const selectedButton = groupsScrollContainerRef.current.querySelector(
        `[data-group-id="${selectedGroup}"]`,
      ) as HTMLElement;

      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedGroup]);

  return (
    <div className="sticky top-0 z-10 bg-white shadow-md">
      <div className="container max-w-6xl mx-auto">
        {/* Section Label for Groups */}
        <div className="px-4 pt-3 pb-1">
          <h3 className="text-sm font-medium text-gray-500">Groups</h3>
        </div>

        {/* Groups Navigation */}
        <div className="relative">
          {showLeftGroupScroll && (
            <button
              onClick={scrollGroupsLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
          )}

          <div
            ref={groupsScrollContainerRef}
            className="overflow-x-auto flex space-x-2 py-3 px-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              onClick={handleAllClick}
              className={cn(
                "px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0",
                !selectedGroup && !selectedCategory
                  ? "bg-primary text-white shadow-md"
                  : "bg-secondary hover:bg-gray-200 text-gray-700",
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
                  "px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0",
                  selectedGroup === group.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-secondary hover:bg-gray-200 text-gray-700",
                )}
              >
                {group.name}
              </button>
            ))}
          </div>

          {showRightGroupScroll && (
            <button
              onClick={scrollGroupsRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md"
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
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
          )}

          <div
            ref={categoriesScrollContainerRef}
            className="overflow-x-auto flex space-x-2 py-3 px-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              onClick={() => onSelectCategory(null)}
              className={cn(
                "px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0",
                selectedGroup && !selectedCategory
                  ? "bg-primary text-white shadow-md"
                  : "bg-secondary hover:bg-gray-200 text-gray-700",
              )}
            >
              All Categories
            </button>

            {getActiveCategories().map((category) => (
              <button
                key={category.id}
                data-category-id={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0",
                  selectedCategory === category.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-secondary hover:bg-gray-200 text-gray-700",
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {showRightCategoryScroll && (
            <button
              onClick={scrollCategoriesRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
