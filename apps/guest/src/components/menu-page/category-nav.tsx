'use client';

import { cn } from '@platter/ui/lib/utils';
import { useState } from 'react';


interface Category {
  id: string;
  name: string;
}

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryNav({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container max-w-6xl mx-auto">
        <div className="overflow-x-auto flex space-x-2 py-4 px-4">
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap transition-colors",
              selectedCategory === null
                ? "bg-primary text-white"
                : "bg-secondary hover:bg-gray-200 text-gray-700"
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full whitespace-nowrap transition-colors",
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-secondary hover:bg-gray-200 text-gray-700"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

