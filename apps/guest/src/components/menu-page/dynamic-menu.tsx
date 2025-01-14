'use client';

import { useState } from 'react';
import { MenuItems } from './menu-Items';
import { CategoryNav } from './category-nav';


interface Category {
  id: string;
  name: string;
}

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

interface DynamicMenuProps {
  initialCategories: Category[];
  initialMenuItems: MenuItem[];
}

export function DynamicMenu({ initialCategories, initialMenuItems }: DynamicMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <>
      <CategoryNav 
        categories={initialCategories} 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <MenuItems 
        menuItems={initialMenuItems} 
        selectedCategory={selectedCategory}
      />
    </>
  );
}

