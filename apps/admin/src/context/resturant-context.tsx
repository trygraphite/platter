import { createCategory } from "@/lib/actions/create-category";
import { createMenuItem } from "@/lib/actions/create-menu-item";
import { deleteCategory } from "@/lib/actions/delete-category";
import { deleteMenuItem } from "@/lib/actions/delete-menu-item";
import { updateCategory } from "@/lib/actions/update-category";
import { updateMenuItem } from "@/lib/actions/update-menu-item";
import { useSession } from "@/lib/auth/client";
import { useEdgeStore } from "@/lib/edgestore/edgestore";
import { toast } from "@platter/ui/components/sonner";
import type { Category, MenuItem, User } from "@prisma/client";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

type CategoryWithMenuItems = Category & { menuItems: MenuItem[] };

type MenuItemInput = Partial<Omit<MenuItem, "image">> & {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  isAvailable: boolean;
  image: string | null;
};

interface RestaurantContextType {
  user: User | null;
  categories: CategoryWithMenuItems[];
  isLoading: boolean;
  error: string | null;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  fetchUserAndCategories: () => Promise<void>;
  handleAddCategory: (categoryData: Partial<Category>) => Promise<void>;
  handleAddMenuItem: (categoryId: string, formData: FormData) => Promise<void>;
  handleUpdateCategory: (
    categoryId: string,
    categoryData: Partial<Category>,
  ) => Promise<void>;
  handleUpdateMenuItem: (
    menuItemId: string,
    formData: FormData,
  ) => Promise<void>;
  handleDeleteCategory: (categoryId: string) => Promise<void>;
  handleDeleteMenuItem: (menuItemId: string) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined,
);

export const RestaurantProvider: React.FC<React.PropsWithChildren> = ({
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
      toast.error("Loading Menu");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [userResponse, categoriesResponse] = await Promise.all([
        fetch("/api/user"),
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

  const handleAddMenuItem = async (categoryId: string, formData: FormData) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      // Extract file from FormData
      const imageFile = formData.get("image") as File | null;

      // Convert FormData to menu item data
      const menuItemData: MenuItemInput = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        categoryId: formData.get("categoryId") as string,
        isAvailable: formData.get("isAvailable") === "true",
        image: null,
      };

      console.log("menu items", menuItemData);

      // Handle image upload if present
      if (imageFile instanceof File) {
        if (!edgestore?.publicFiles) {
          throw new Error("EdgeStore not initialized");
        }

        const res = await edgestore.publicFiles.upload({
          file: imageFile,
          input: { type: "Platter-menuItem" },
        });

        menuItemData.image = res.url;
      } else {
        menuItemData.image = null;
      }

      // Create menu item
      await createMenuItem(menuItemData, session.user.id);
      fetchUserAndCategories();

      toast.success("Menu item added successfully");
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error("Failed to add menu item");
      throw error; // Re-throw to handle in the component
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
    formData: FormData,
  ) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const updatedData: Partial<MenuItem> = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
      };

      // Handle image upload
      const imageFile = formData.get("image") as File | null;
      const existingImage = formData.get("existingImage") as string | null;

      if (imageFile instanceof File) {
        if (!edgestore?.publicFiles) {
          throw new Error("EdgeStore not initialized");
        }
        const res = await edgestore.publicFiles.upload({
          file: imageFile,
          input: { type: "Platter-menuItem" },
        });
        updatedData.image = res.url;
      } else if (existingImage) {
        updatedData.image = existingImage;
      }

      await updateMenuItem(session.user.id, menuItemId, updatedData);
      toast.success("Menu item updated");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast.error("Failed to update menu item");
      throw error; // Re-throw to handle in the component
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
