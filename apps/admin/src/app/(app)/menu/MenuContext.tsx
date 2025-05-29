"use client";

import { Button } from "@platter/ui/components/button";
import { useEffect } from "react";

import { AddCategoryModal } from "@/components/resturant/AddCategoryModel";
import { AddCategoryGroupModal } from "@/components/resturant/AddCategoryGroupModal";
import { CategoryGroupManager } from "@/components/resturant/CategoryGroupManager";
import { CategoryCard } from "@/components/resturant/CategoryCard";
import { Switch } from "@platter/ui/components/switch";
import { HourglassLoader } from "@platter/ui/components/timeLoader";
import { useRestaurant } from "../../../context/resturant-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@platter/ui/components/tabs";
import { MenuIcon } from "lucide-react";

export default function MenuPage() {
  const {
    user,
    categories,
    categoryGroups,
    isLoading,
    error,
    editMode,
    setEditMode,
    fetchUserAndCategories,
  } = useRestaurant();

  useEffect(() => {
    fetchUserAndCategories();
  }, [fetchUserAndCategories]);
// console.log(categories, "categories in menu page");
  if (isLoading) {
    return <div><HourglassLoader label="Loading Menu..." /></div>;
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

  // Get categories without groups for ungrouped view
  const ungroupedCategories = categories.filter(category => !category.groupId);
  
  // Get categories with groups
  const groupedCategories = categories.filter(category => category.groupId);

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <MenuIcon className="h-8 w-8 mr-2" />
            <h1 className="text-3xl font-bold">Menu Management</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm mr-2">{editMode ? "Edit Mode On" : "View Mode"}</span>
            <Switch checked={editMode} onCheckedChange={setEditMode} />
          </div>
        </div>
        <p className="text-lg text-muted-foreground mb-6">
          Organize your menu items into categories and groups to improve customer experience
        </p>
        
        <div className="flex justify-end space-x-3">
          <AddCategoryModal />
          <AddCategoryGroupModal />
        </div>
      </header>

      {/* Tabs for different views */}
      <Tabs defaultValue="grouped" className="mb-6">
        {/* <TabsList className="mb-6">
          <TabsTrigger value="grouped">Grouped Categories</TabsTrigger>
        </TabsList> */}
        
        {/* Grouped Categories Tab */}
        <TabsContent value="grouped">
          {categoryGroups.length > 0 ? (
            <div className="space-y-10">
              {categoryGroups.map((group) => (
                <div key={group.id} className="border-b pb-8 last:border-b-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold">{group.name}</h2>
                      {group.description && (
                        <p className="text-muted-foreground">{group.description}</p>
                      )}
                    </div>
                    {editMode && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // This would open an edit group modal. You can implement this later.
                          alert(`Edit group: ${group.name}`);
                        }}
                      >
                        Edit Group
                      </Button>
                    )}
                  </div>
                  
                  {group.categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No categories in this group yet</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Category Groups Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create groups to organize your menu categories
              </p>
              <AddCategoryGroupModal />
            </div>
          )}
        </TabsContent>
        
        {/* Ungrouped Categories Tab */}
        {/* <TabsContent value="ungrouped">
          {ungroupedCategories.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Ungrouped Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ungroupedCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Ungrouped Categories</h3>
              <p className="text-muted-foreground mb-4">
                All your categories are assigned to groups
              </p>
              <AddCategoryModal />
            </div>
          )}
        </TabsContent> */}
        
        {/* All Categories Tab */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                // console.log(category, "category mapped to menu page"),
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">No Categories Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add categories to start building your menu
                </p>
                <AddCategoryModal />
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Manage Groups Tab */}
        {/* <TabsContent value="manage">
          <CategoryGroupManager />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}