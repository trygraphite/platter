"use client"
import { useState } from "react";
import { MenuCard } from "./menu-card";



interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

interface MenuItemsProps {
  menuItems: MenuItem[];
  selectedCategory: string | null;
}

export function MenuItems({ menuItems, selectedCategory }: MenuItemsProps) {
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.categoryId === selectedCategory)
    : menuItems;

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category.name]) {
      acc[item.category.name] = [];
    }
    (acc[item.category.name] as MenuItem[]).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <main className="container max-w-6xl mx-auto px-4 py-8">
      {Object.entries(groupedItems).map(([categoryName, items]) => (
        <div key={categoryName} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">{categoryName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}

