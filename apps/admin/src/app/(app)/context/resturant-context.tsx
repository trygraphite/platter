import React, { createContext, useContext, useState, useCallback } from "react";
import { Category, MenuItem, User } from "@prisma/client";
import { useSession } from "@/lib/auth/client";
import { toast } from "@platter/ui/components/sonner";
import { useEdgeStore } from "@/lib/edgestore/edgestore";
import { createCategory } from "@/lib/actions/create-category";
import { deleteCategory } from "@/lib/actions/delete-category";
import { deleteMenuItem } from "@/lib/actions/delete-menu-item";
import { updateMenuItem } from "@/lib/actions/update-menu-item";
import { updateCategory } from "@/lib/actions/update-category";
import { createMenuItem } from "@/lib/actions/create-menu-item";

type CategoryWithMenuItems = Category & { menuItems: MenuItem[] };

interface RestaurantContextType {
  user: User | null;
  categories: CategoryWithMenuItems[];
  isLoading: boolean;
  error: string | null;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  fetchUserAndCategories: () => Promise<void>;
  handleAddCategory: (categoryData: Partial<Category>) => Promise<void>;
  handleAddMenuItem: (
    categoryId: string,
    menuItemData: Omit<MenuItem, "id" | "categoryId" | "userId">,
  ) => Promise<void>;
  handleUpdateCategory: (
    categoryId: string,
    categoryData: Partial<Category>,
  ) => Promise<void>;
  handleUpdateMenuItem: (
    menuItemId: string,
    menuItemData: Partial<MenuItem>,
  ) => Promise<void>;
  handleDeleteCategory: (categoryId: string) => Promise<void>;
  handleDeleteMenuItem: (menuItemId: string) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined,
);

export const RestaurantProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<CategoryWithMenuItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { edgestore } = useEdgeStore();

  const fetchUserAndCategories = useCallback(async () => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [userResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/user`),
        fetch(`/api/categories?userId=${session.user.id}`),
      ]);

      if (!userResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const userData = await userResponse.json();
      const categoriesData: CategoryWithMenuItems[] =
        await categoriesResponse.json();

      setUser(userData);
      setCategories(categoriesData || []);
      console.log("categoriesData", categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load user data. Please try again.");
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const handleAddCategory = async (categoryData: Partial<Category>) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await createCategory(session.user.id, categoryData);
      toast.success("Category added");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  const handleAddMenuItem = async (categoryId: string, menuItemData: any) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }
    console.log(" menu items", menuItemData);
    try {
      if ("image" in menuItemData && menuItemData.image instanceof File) {
        const res = await edgestore.publicFiles.upload({
          file: menuItemData.image,
          input: { type: "Platter-menuItem" },
        });
        menuItemData.image = res.url;
      }
      await createMenuItem(menuItemData, session.user.id);
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error("Failed to add menu item");
    }
  };

  const handleUpdateCategory = async (
    categoryId: string,
    categoryData: Partial<Category>,
  ) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await updateCategory(session.user.id, categoryId, categoryData);
      toast.success("Category updated");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const handleUpdateMenuItem = async (
    menuItemId: string,
    menuItemData: any,
  ) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      if ("image" in menuItemData && menuItemData.image instanceof File) {
        const res = await edgestore.publicFiles.upload({
          file: menuItemData.image,
          input: { type: "Platter-menuItem" },
        });
        menuItemData.image = res.url;
      }
      await updateMenuItem(session.user.id, menuItemId, menuItemData);
      toast.success("Menu item updated");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast.error("Failed to update menu item");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await deleteCategory(session.user.id, categoryId);
      toast.success("Category deleted");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleDeleteMenuItem = async (menuItemId: string) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await deleteMenuItem(session.user.id, menuItemId);
      toast.success("Menu item deleted");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  };

  const value = {
    user,
    categories,
    isLoading,
    error,
    editMode,
    setEditMode,
    fetchUserAndCategories,
    handleAddCategory,
    handleAddMenuItem,
    handleUpdateCategory,
    handleUpdateMenuItem,
    handleDeleteCategory,
    handleDeleteMenuItem,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};
