"use client";

import type { StaffUser } from "@/utils/auth";
import { Button } from "@platter/ui/components/button";
import { Switch } from "@platter/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@platter/ui/components/tabs";
import { HourglassLoader } from "@platter/ui/components/timeLoader";
import type { Category } from "@prisma/client";
import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { StaffAddCategoryGroupModal } from "./StaffAddCategoryGroupModal";
// Import staff-specific components
import { StaffAddCategoryModal } from "./StaffAddCategoryModal";
import { StaffCategoryCard } from "./StaffCategoryCard";
import { StaffCategoryGroupManagerModal } from "./StaffCategoryGroupManagerModal";
import { StaffEditCategoryModal } from "./StaffEditCategoryModal";
import { useStaffMenu } from "./StaffMenuProvider";

interface StaffMenuContentProps {
  staff: StaffUser;
}

export function StaffMenuContent({ staff }: StaffMenuContentProps) {
  // State to control which tab is active
  const [activeTab, setActiveTab] = useState("grouped");
  // State for edit category modal
  const [editCategoryModal, setEditCategoryModal] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({ isOpen: false, category: null });
  // State for category group manager modal
  const [isGroupManagerModalOpen, setIsGroupManagerModalOpen] = useState(false);

  // Function to handle opening edit category modal
  const openEditCategoryModal = (category: Category) => {
    setEditCategoryModal({ isOpen: true, category });
  };

  // Function to close edit category modal
  const closeEditCategoryModal = () => {
    setEditCategoryModal({ isOpen: false, category: null });
  };

  // Function to handle opening group manager modal
  const openGroupManagerModal = () => {
    setIsGroupManagerModalOpen(true);
  };

  // Function to close group manager modal
  const closeGroupManagerModal = () => {
    setIsGroupManagerModalOpen(false);
  };

  const {
    categories,
    categoryGroups,
    isLoading,
    error,
    editMode,
    setEditMode,
    fetchCategories,
  } = useStaffMenu();
  console.log(categories, categoryGroups);
  useEffect(() => {
    if (!categories.length && !categoryGroups.length) {
      fetchCategories();
    }
  }, [categories.length, categoryGroups.length, fetchCategories]);

  if (isLoading) {
    return (
      <div>
        <HourglassLoader label="Loading Menu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p>{error}</p>
        <Button onClick={() => window.history.back()} className="mt-4">
          Back
        </Button>
      </div>
    );
  }

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
            <span className="text-sm mr-2">
              {editMode ? "Edit Mode On" : "View Mode"}
            </span>
            <Switch checked={editMode} onCheckedChange={setEditMode} />
          </div>
        </div>
        <p className="text-lg text-muted-foreground mb-6">
          Organize your menu items into categories and groups to improve
          customer experience
        </p>

        <div className="flex justify-end space-x-3">
          <StaffAddCategoryModal />
          <StaffAddCategoryGroupModal />
        </div>
      </header>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="grouped">Grouped View</TabsTrigger>
          <TabsTrigger value="all">All Categories</TabsTrigger>
        </TabsList>

        {/* Grouped Categories Tab */}
        <TabsContent value="grouped">
          {categoryGroups.length > 0 || categories.length > 0 ? (
            <div className="space-y-10">
              {categoryGroups.map((group) => (
                <div key={group.id} className="border-b pb-8 last:border-b-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold">{group.name}</h2>
                      {group.description && (
                        <p className="text-muted-foreground">
                          {group.description}
                        </p>
                      )}
                    </div>
                    {editMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openGroupManagerModal}
                      >
                        Edit Group
                      </Button>
                    )}
                  </div>

                  {group.categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.categories.map((category) => (
                        <div key={category.id} className="relative">
                          <StaffCategoryCard category={category} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No categories in this group yet
                    </p>
                  )}
                </div>
              ))}

              {/* Ungrouped categories */}
              {categories.filter((c) => !c.groupId).length > 0 && (
                <div className="border-b pb-8 last:border-b-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold">Ungrouped</h2>
                      <p className="text-muted-foreground">
                        Categories without a group
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories
                      .filter((c) => !c.groupId)
                      .map((category) => (
                        <div key={category.id} className="relative">
                          <StaffCategoryCard category={category} />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                No Category Groups Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Create groups to organize your menu categories
              </p>
              <StaffAddCategoryGroupModal />
            </div>
          )}
        </TabsContent>

        {/* All Categories Tab */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="relative">
                  <StaffCategoryCard category={category} />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  No Categories Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Add categories to start building your menu
                </p>
                <StaffAddCategoryModal />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Category Modal */}
      {editCategoryModal.category && (
        <StaffEditCategoryModal
          isOpen={editCategoryModal.isOpen}
          onClose={closeEditCategoryModal}
          category={editCategoryModal.category}
        />
      )}

      {/* Category Group Manager Modal */}
      <StaffCategoryGroupManagerModal
        isOpen={isGroupManagerModalOpen}
        onClose={closeGroupManagerModal}
      />
    </div>
  );
}
