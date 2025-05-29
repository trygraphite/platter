import { updateCategoryGroupPosition, updateCategoryPosition, updateMenuItemPosition } from "@/components/resturant/updatePosition";
import { assignCategoryToGroup, createCategoryGroup, deleteCategoryGroup, updateCategoryGroup } from "@/lib/actions/category-group";
import { createCategory } from "@/lib/actions/create-category";
import { createMenuItem } from "@/lib/actions/create-menu-item";
import { deleteCategory } from "@/lib/actions/delete-category";
import { deleteMenuItem } from "@/lib/actions/delete-menu-item";
import { updateCategory } from "@/lib/actions/update-category";
import { updateMenuItem } from "@/lib/actions/update-menu-item";
import { useSession } from "@/lib/auth/client";
import { useEdgeStore } from "@/lib/edgestore/edgestore";
import { MenuItemVarietyInput } from "@/types";
import { toast } from "@platter/ui/components/sonner";
import type { Category, CategoryGroup, MenuItem, User } from "@prisma/client";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { useUploadThing } from "utils/uploadThing";
type MenuItemVariety = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  position: number;
  isAvailable: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  menuItemId: string;
  userId: string;
};
type MenuItemWithVarieties = MenuItem & { 
  varieties: MenuItemVariety[] 
};
type CategoryWithMenuItems = Category & { menuItems: MenuItemWithVarieties[] };
type CategoryGroupWithCategories = CategoryGroup & { categories: CategoryWithMenuItems[] };

type MenuItemInput = Partial<Omit<MenuItem, "image">> & {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  isAvailable: boolean;
  image: string | null;
  varieties?: MenuItemVarietyInput[];
};

type CategoryInput = Partial<Omit<Category, "image">> & {
  name: string;
  description?: string;
  groupId?: string | null;
  image: File | string | null | undefined | any;
};

interface RestaurantContextType {
  user: User | null;
  categories: CategoryWithMenuItems[];
  categoryGroups: CategoryGroupWithCategories[];
  isLoading: boolean;
  error: string | null;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  fetchUserAndCategories: () => Promise<void>;
  handleAddCategory: (categoryData: CategoryInput) => Promise<void>;
  handleAddMenuItem: (categoryId: string, formData: FormData) => Promise<void>;
  handleUpdateCategory: (
    categoryId: string,
    formData: FormData,
  ) => Promise<void>;
  handleUpdateMenuItem: (
    menuItemId: string,
    formData: FormData,
  ) => Promise<void>;
  handleDeleteCategory: (categoryId: string) => Promise<void>;
  handleDeleteMenuItem: (menuItemId: string) => Promise<void>;
  // Category group methods
  handleAddCategoryGroup: (groupData: Partial<CategoryGroup>) => Promise<void>;
  handleUpdateCategoryGroup: (
    groupId: string,
    groupData: Partial<CategoryGroup>,
  ) => Promise<void>;
  handleDeleteCategoryGroup: (groupId: string) => Promise<void>;
  handleAssignCategoryToGroup: (categoryId: string, groupId: string | null) => Promise<void>;
  // Position management methods
  handleUpdateCategoryPosition: (categoryId: string, direction: "up" | "down") => Promise<void>;
  handleUpdateMenuItemPosition: (menuItemId: string, direction: "up" | "down") => Promise<void>;
  handleUpdateCategoryGroupPosition: (groupId: string, direction: "up" | "down") => Promise<void>;
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
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroupWithCategories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // UploadThing hooks
  const { startUpload: startCategoryImageUpload, isUploading: isCategoryImageUploading } = useUploadThing("categoryImageUploader");
  const { startUpload: startMenuItemImageUpload, isUploading: isMenuItemImageUploading } = useUploadThing("menuItemImageUploader");

  const fetchUserAndCategories = useCallback(async () => {
    if (!session?.user?.id) {
      toast.error("Loading Menu");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [userResponse, categoriesResponse, categoryGroupsResponse] = await Promise.all([
        fetch("/api/user"),
        fetch(`/api/categories?userId=${session.user.id}`),
        fetch(`/api/category-groups?userId=${session.user.id}`),
      ]);

      if (!userResponse.ok || !categoriesResponse.ok || !categoryGroupsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const userData = await userResponse.json();
      const categoriesData: CategoryWithMenuItems[] = await categoriesResponse.json();
      const categoryGroupsData: CategoryGroupWithCategories[] = await categoryGroupsResponse.json();

      setUser(userData);
      setCategories(categoriesData || []);
      setCategoryGroups(categoryGroupsData || []);
      console.log("categoriesData", categoriesData);
      console.log("categoryGroupsData", categoryGroupsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load user data. Please try again.");
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const handleAddCategory = async (categoryData: CategoryInput) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const categoryToCreate: Partial<Category> = {
        name: categoryData.name,
        description: categoryData.description || "",
        groupId: categoryData.groupId || null,
      };

      // Handle image upload if present
      const imageFile = categoryData.image;
      
      if (imageFile instanceof File) {
        toast.loading("Uploading image...");
        
        const uploadResult = await startCategoryImageUpload([imageFile]);
        
        if (uploadResult && uploadResult[0]) {
          categoryToCreate.image = uploadResult[0].ufsUrl;
          toast.dismiss();
        } else {
          throw new Error("Failed to upload image");
        }
      }

      await createCategory(session.user.id, categoryToCreate);
      toast.success("Category added");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
      throw error;
    }
  };


  const handleUpdateCategory = async (
    categoryId: string,
    formData: FormData,
  ) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const updatedData: Partial<Category> = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      };

      const imageFile = formData.get("image") as File | null;
      const existingImage = formData.get("existingImage") as string | null;

      if (imageFile instanceof File) {
        toast.loading("Uploading image...");
        
        const uploadResult = await startCategoryImageUpload([imageFile]);
        
        if (uploadResult && uploadResult[0]) {
          updatedData.image = uploadResult[0].ufsUrl;
          toast.dismiss();
        } else {
          throw new Error("Failed to upload image");
        }
      } else if (existingImage) {
        updatedData.image = existingImage;
      }

      await updateCategory(session.user.id, categoryId, updatedData);
      toast.success("Category updated");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
      throw error;
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

  // Updated client-side functions with variety support

  const handleAddMenuItem = async (categoryId: string, formData: FormData) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }
  
    try {
      const imageFile = formData.get("image") as File | null;
  
      const menuItemData: MenuItemInput = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        categoryId: formData.get("categoryId") as string,
        isAvailable: formData.get("isAvailable") === "true",
        image: null,
      };
  
      // Extract varieties data from formData
      const varieties: MenuItemVarietyInput[] = [];
      const varietyCount = Number(formData.get("varietyCount") || "0");
      
      for (let i = 0; i < varietyCount; i++) {
        const varietyName = formData.get(`variety_${i}_name`) as string;
        const varietyDescription = formData.get(`variety_${i}_description`) as string;
        const varietyPrice = Number(formData.get(`variety_${i}_price`));
        const varietyPosition = Number(formData.get(`variety_${i}_position`) || i);
        const varietyIsAvailable = formData.get(`variety_${i}_isAvailable`) === "true";
        const varietyIsDefault = formData.get(`variety_${i}_isDefault`) === "true";
  
        if (varietyName && !isNaN(varietyPrice)) {
          varieties.push({
            name: varietyName,
            description: varietyDescription || null,
            price: varietyPrice,
            position: varietyPosition,
            isAvailable: varietyIsAvailable,
            isDefault: varietyIsDefault,
          });
        }
      }
  
      // Transform varieties to match expected type (remove undefined from description)
      const transformedVarieties = varieties.map(variety => ({
        name: variety.name,
        description: variety.description ?? null, // Convert undefined to null
        price: variety.price,
        position: variety.position,
        isAvailable: variety.isAvailable,
        isDefault: variety.isDefault,
      }));
  
      console.log("menu items", menuItemData);
      console.log("varieties", transformedVarieties);
  
      // Handle image upload if present
      if (imageFile instanceof File) {
        toast.loading("Uploading image...");
        
        const uploadResult = await startMenuItemImageUpload([imageFile]);
        
        if (uploadResult && uploadResult[0]) {
          menuItemData.image = uploadResult[0].ufsUrl;
          toast.dismiss();
        } else {
          throw new Error("Failed to upload image");
        }
      } else {
        menuItemData.image = null;
      }
  
      await createMenuItem(menuItemData, transformedVarieties, session.user.id);
      fetchUserAndCategories();
  
      toast.success("Menu item added successfully");
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error("Failed to add menu item");
      throw error;
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
        isAvailable: formData.get("isAvailable") === "true",
      };

      // Extract varieties data from formData
      const varieties: MenuItemVarietyInput[] = [];
      const varietyCount = Number(formData.get("varietyCount") || "0");
      
      for (let i = 0; i < varietyCount; i++) {
        const varietyId = formData.get(`variety_${i}_id`) as string;
        const varietyName = formData.get(`variety_${i}_name`) as string;
        const varietyDescription = formData.get(`variety_${i}_description`) as string;
        const varietyPrice = Number(formData.get(`variety_${i}_price`));
        const varietyPosition = Number(formData.get(`variety_${i}_position`) || i);
        const varietyIsAvailable = formData.get(`variety_${i}_isAvailable`) === "true";
        const varietyIsDefault = formData.get(`variety_${i}_isDefault`) === "true";

        if (varietyName && !isNaN(varietyPrice)) {
          varieties.push({
            id: varietyId || undefined, // Include ID for existing varieties
            name: varietyName,
            description: varietyDescription ? varietyDescription : null,
            price: varietyPrice,
            position: varietyPosition,
            isAvailable: varietyIsAvailable,
            isDefault: varietyIsDefault,
          });
        }
      }

      const imageFile = formData.get("image") as File | null;
      const existingImage = formData.get("existingImage") as string | null;

      if (imageFile instanceof File) {
        toast.loading("Uploading image...");
        
        const uploadResult = await startMenuItemImageUpload([imageFile]);
        
        if (uploadResult && uploadResult[0]) {
          updatedData.image = uploadResult[0].ufsUrl;
          toast.dismiss();
        } else {
          throw new Error("Failed to upload image");
        }
      } else if (existingImage) {
        updatedData.image = existingImage;
      }

      await updateMenuItem(session.user.id, menuItemId, updatedData, varieties);
      toast.success("Menu item updated");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast.error("Failed to update menu item");
      throw error;
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


  // Category group methods
  const handleAddCategoryGroup = async (groupData: Partial<CategoryGroup>) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await createCategoryGroup(session.user.id, groupData);
      toast.success("Category group added");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error adding category group:", error);
      toast.error("Failed to add category group");
    }
  };

  const handleUpdateCategoryGroup = async (
    groupId: string,
    groupData: Partial<CategoryGroup>,
  ) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await updateCategoryGroup(session.user.id, groupId, groupData);
      toast.success("Category group updated");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error updating category group:", error);
      toast.error("Failed to update category group");
    }
  };

  const handleDeleteCategoryGroup = async (groupId: string) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await deleteCategoryGroup(session.user.id, groupId);
      toast.success("Category group deleted");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error deleting category group:", error);
      toast.error("Failed to delete category group");
    }
  };

  const handleAssignCategoryToGroup = async (categoryId: string, groupId: string | null) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await assignCategoryToGroup(session.user.id, categoryId, groupId);
      toast.success(groupId ? "Category assigned to group" : "Category removed from group");
      fetchUserAndCategories();
    } catch (error) {
      console.error("Error assigning category to group:", error);
      toast.error("Failed to assign category to group");
    }
  };

  // Position management methods
  const handleUpdateCategoryPosition = async (categoryId: string, direction: "up" | "down") => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const result = await updateCategoryPosition(session.user.id, categoryId, direction);
      if (result.success) {
        toast.success(`Category moved ${direction}`);
        fetchUserAndCategories();
      } else {
        toast.error(result.error || `Cannot move ${direction}`);
      }
    } catch (error) {
      console.error(`Error moving category ${direction}:`, error);
      toast.error(`Failed to move category ${direction}`);
    }
  };

  const handleUpdateMenuItemPosition = async (menuItemId: string, direction: "up" | "down") => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const result = await updateMenuItemPosition(session.user.id, menuItemId, direction);
      if (result.success) {
        toast.success(`Menu item moved ${direction}`);
        fetchUserAndCategories();
      } else {
        toast.error(result.error || `Cannot move ${direction}`);
      }
    } catch (error) {
      console.error(`Error moving menu item ${direction}:`, error);
      toast.error(`Failed to move menu item ${direction}`);
    }
  };

  const handleUpdateCategoryGroupPosition = async (groupId: string, direction: "up" | "down") => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const result = await updateCategoryGroupPosition(session.user.id, groupId, direction);
      if (result.success) {
        toast.success(`Group moved ${direction}`);
        fetchUserAndCategories();
      } else {
        toast.error(result.error || `Cannot move ${direction}`);
      }
    } catch (error) {
      console.error(`Error moving category group ${direction}:`, error);
      toast.error(`Failed to move category group ${direction}`);
    }
  };

  const value = {
    user,
    categories,
    categoryGroups,
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
    handleAddCategoryGroup,
    handleUpdateCategoryGroup,
    handleDeleteCategoryGroup,
    handleAssignCategoryToGroup,
    handleUpdateCategoryPosition,
    handleUpdateMenuItemPosition,
    handleUpdateCategoryGroupPosition,
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