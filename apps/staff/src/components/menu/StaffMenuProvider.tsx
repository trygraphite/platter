"use client";

import { toast } from "@platter/ui/components/sonner";
import type {
  Category,
  CategoryGroup,
  MenuItem,
  MenuItemVariety,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  assignCategoryToGroupAction,
  createCategoryAction,
  createCategoryGroupAction,
  createMenuItemAction,
  deleteCategoryAction,
  deleteMenuItemAction,
  getMenuData,
  updateCategoryAction,
  updateCategoryGroupAction,
  updateMenuItemAction,
} from "@/actions/menu";
import type { StaffUser } from "@/utils/auth";

type MenuItemWithVarieties = MenuItem & {
  varieties: MenuItemVariety[];
  servicePoint?: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
  } | null;
};

type CategoryWithMenuItems = Category & { menuItems: MenuItemWithVarieties[] };
type CategoryGroupWithCategories = CategoryGroup & {
  categories: CategoryWithMenuItems[];
};

interface StaffMenuContextType {
  categories: CategoryWithMenuItems[];
  categoryGroups: CategoryGroupWithCategories[];
  isLoading: boolean;
  error: string | null;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  fetchCategories: () => Promise<void>;
  handleAddCategory: (categoryData: {
    name: string;
    description?: string;
    image?: File | null;
    groupId?: string | null;
  }) => Promise<void>;
  handleAddMenuItem: (formData: FormData) => Promise<void>;
  handleUpdateCategory: (
    categoryId: string,
    formData: FormData,
  ) => Promise<void>;
  handleDeleteCategory: (categoryId: string) => Promise<void>;
  handleAddCategoryGroup: (groupData: {
    name: string;
    description?: string;
  }) => Promise<void>;
  handleUpdateCategoryGroup: (
    groupId: string,
    groupData: { name: string; description?: string },
  ) => Promise<void>;
  handleDeleteCategoryGroup: (groupId: string) => Promise<void>;
  handleAssignCategoryToGroup: (
    categoryId: string,
    groupId: string | null,
  ) => Promise<void>;
  handleDeleteMenuItem: (menuItemId: string) => Promise<void>;
  handleUpdateMenuItem: (
    menuItemId: string,
    formData: FormData,
  ) => Promise<void>;
}

const StaffMenuContext = createContext<StaffMenuContextType | undefined>(
  undefined,
);

interface StaffMenuContextProviderProps {
  staff: StaffUser;
  initialCategories?: CategoryWithMenuItems[];
  initialCategoryGroups?: CategoryGroupWithCategories[];
  children: React.ReactNode;
}

export function StaffMenuContextProvider({
  staff,
  initialCategories,
  initialCategoryGroups,
  children,
}: StaffMenuContextProviderProps) {
  const [categories, setCategories] = useState<CategoryWithMenuItems[]>(
    initialCategories || [],
  );
  const [categoryGroups, setCategoryGroups] = useState<
    CategoryGroupWithCategories[]
  >(initialCategoryGroups || []);
  const [isLoading, setIsLoading] = useState(!initialCategories);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const _router = useRouter();

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { categories: latestCategories, categoryGroups: latestGroups } =
        await getMenuData();
      setCategories(latestCategories);
      setCategoryGroups(latestGroups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to load menu data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddCategory = useCallback(
    async (categoryData: {
      name: string;
      description?: string;
      image?: File | null;
      groupId?: string | null;
    }) => {
      try {
        await createCategoryAction({
          name: categoryData.name,
          description: categoryData.description,
          image: null,
          groupId: categoryData.groupId || null,
        });
        await fetchCategories();
        toast.success("Category created successfully");
      } catch (err) {
        toast.error("Failed to create category");
        throw err;
      }
    },
    [fetchCategories],
  );

  const handleAddMenuItem = useCallback(
    async (formData: FormData) => {
      try {
        await createMenuItemAction(formData);
        await fetchCategories();
        toast.success("Menu item created successfully");
      } catch (err) {
        toast.error("Failed to create menu item");
        throw err;
      }
    },
    [fetchCategories],
  );

  const handleUpdateCategory = useCallback(
    async (categoryId: string, formData: FormData) => {
      try {
        await updateCategoryAction(categoryId, formData);
        await fetchCategories();
        toast.success("Category updated successfully");
      } catch (err) {
        toast.error("Failed to update category");
        throw err;
      }
    },
    [fetchCategories],
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      try {
        await deleteCategoryAction(categoryId);
        await fetchCategories();
        toast.success("Category deleted successfully");
      } catch (err) {
        toast.error("Failed to delete category");
        throw err;
      }
    },
    [fetchCategories],
  );

  const handleAddCategoryGroup = useCallback(
    async (groupData: { name: string; description?: string }) => {
      try {
        await createCategoryGroupAction(groupData);
        await fetchCategories();
        toast.success("Category group created successfully");
      } catch (err) {
        toast.error("Failed to create category group");
        throw err;
      }
    },
    [fetchCategories],
  );

  const handleUpdateCategoryGroup = useCallback(
    async (
      groupId: string,
      groupData: { name: string; description?: string },
    ) => {
      try {
        await updateCategoryGroupAction(groupId, groupData);
        await fetchCategories();
        toast.success("Category group updated successfully");
      } catch (err) {
        toast.error("Failed to update category group");
        throw err;
      }
    },
    [fetchCategories],
  );

  const handleDeleteCategoryGroup = useCallback(
    async (groupId: string) => {
      try {
        // simple delete; consider soft-delete if needed
        await updateCategoryGroupAction(groupId, { name: "", description: "" });
        await fetchCategories();
        toast.success("Category group deleted successfully");
      } catch (err) {
        toast.error("Failed to delete category group");
        throw err;
      }
    },
    [fetchCategories],
  );

  const handleAssignCategoryToGroup = useCallback(
    async (categoryId: string, groupId: string | null) => {
      try {
        await assignCategoryToGroupAction(categoryId, groupId);
        await fetchCategories();
        toast.success("Category assigned successfully");
      } catch (err) {
        toast.error("Failed to assign category to group");
        throw err;
      }
    },
    [fetchCategories],
  );

  const handleDeleteMenuItem = useCallback(
    async (menuItemId: string) => {
      try {
        await deleteMenuItemAction(menuItemId);
        await fetchCategories();
        toast.success("Menu item deleted successfully");
      } catch (err) {
        toast.error("Failed to delete menu item");
        throw err;
      }
    },
    [fetchCategories],
  );

  const handleUpdateMenuItem = useCallback(
    async (menuItemId: string, formData: FormData) => {
      try {
        await updateMenuItemAction(menuItemId, formData);
        await fetchCategories();
        toast.success("Menu item updated successfully");
      } catch (err) {
        toast.error("Failed to update menu item");
        throw err;
      }
    },
    [fetchCategories],
  );

  // Initial fetch
  useEffect(() => {
    if (!initialCategories || !initialCategoryGroups) {
      fetchCategories();
    } else {
      setIsLoading(false);
    }
  }, [fetchCategories, initialCategories, initialCategoryGroups]);

  // Sync with server-provided props during route transitions
  useEffect(() => {
    if (initialCategories) setCategories(initialCategories);
    if (initialCategoryGroups) setCategoryGroups(initialCategoryGroups);
  }, [initialCategories, initialCategoryGroups]);

  const contextValue: StaffMenuContextType = {
    categories,
    categoryGroups,
    isLoading,
    error,
    editMode,
    setEditMode,
    fetchCategories,
    handleAddCategory,
    handleAddMenuItem,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddCategoryGroup,
    handleUpdateCategoryGroup,
    handleDeleteCategoryGroup,
    handleAssignCategoryToGroup,
    handleDeleteMenuItem,
    handleUpdateMenuItem,
  };

  return (
    <StaffMenuContext.Provider value={contextValue}>
      {children}
    </StaffMenuContext.Provider>
  );
}

export const useStaffMenu = () => {
  const context = useContext(StaffMenuContext);
  if (!context) {
    throw new Error("useStaffMenu must be used within a StaffMenuContext");
  }
  return context;
};
