"use client";

import { Button } from "@platter/ui/components/button";
import { useEffect } from "react";

import { AddCategoryModal } from "@/components/resturant/AddCategoryModel";
import { CategoryCard } from "@/components/resturant/CategoryCard";
import { Switch } from "@platter/ui/components/switch";
import { HourglassLoader } from "@platter/ui/components/timeLoader";
import { useRestaurant } from "../../../context/resturant-context";

export default function RestaurantContent() {
  const {
    user,
    categories,
    isLoading,
    error,
    editMode,
    setEditMode,
    fetchUserAndCategories,
  } = useRestaurant();

  useEffect(() => {
    fetchUserAndCategories();
  }, [fetchUserAndCategories]);
  if (isLoading) {
    return <div><HourglassLoader  label="Loading Menu..."/></div>;
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p>{error || "User not found"}</p>
        <Button onClick={() => window.history.back()} className="mt-4">
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Restaurant: {user.name}</h1>
      <p className="text-lg mb-4">{user.description}</p>
      <div className="flex items-center justify-between mb-6">
        <AddCategoryModal />
        <div className="flex items-center space-x-2">
          <span>Edit Mode</span>
          <Switch checked={editMode} onCheckedChange={setEditMode} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
