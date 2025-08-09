"use client";

import { Button } from "@platter/ui/components/button";
import { Checkbox } from "@platter/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@platter/ui/components/dialog";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { Textarea } from "@platter/ui/components/textarea";
import type { MenuItem } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { ImageLoadingPlaceholder } from "utils";
import { useRestaurant } from "@/context/resturant-context";
import { getServicePoints } from "@/lib/actions/get-service-points";

interface MenuItemVariety {
  id?: string;
  name: string;
  description: string;
  price: string;
  position: number;
  isAvailable: boolean;
  isDefault: boolean;
}

interface EditMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem & {
    varieties?: MenuItemVariety[];
    servicePoint?: {
      id: string;
      name: string;
      description: string | null;
      isActive: boolean;
    } | null;
  };
}

export function EditMenuItemModal({
  isOpen,
  onClose,
  menuItem,
}: EditMenuItemModalProps) {
  const [name, setName] = useState(menuItem.name);
  const [description, setDescription] = useState(menuItem.description || "");
  const [price, setPrice] = useState(menuItem.price.toString());
  const [isAvailable, setIsAvailable] = useState(menuItem.isAvailable);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    menuItem.image || null,
  );
  const [varieties, setVarieties] = useState<MenuItemVariety[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [servicePoints, setServicePoints] = useState<
    {
      id: string;
      name: string;
      description: string | null;
      isActive: boolean;
    }[]
  >([]);
  const [selectedServicePoint, setSelectedServicePoint] =
    useState<string>("none");
  const { handleUpdateMenuItem, user } = useRestaurant();

  useEffect(() => {
    setName(menuItem.name);
    setDescription(menuItem.description || "");
    setPrice(menuItem.price.toString());
    setIsAvailable(menuItem.isAvailable);
    setImagePreview(menuItem.image || null);
    setImage(null);
    setSelectedServicePoint(menuItem.servicePoint?.id || "none");

    // Initialize varieties from menuItem
    if (menuItem.varieties && menuItem.varieties.length > 0) {
      const initVarieties = menuItem.varieties
        .sort((a, b) => a.position - b.position)
        .map((variety) => ({
          id: variety.id,
          name: variety.name,
          description: variety.description || "",
          price: variety.price.toString(),
          position: variety.position,
          isAvailable: variety.isAvailable,
          isDefault: variety.isDefault,
        }));
      setVarieties(initVarieties);
      return;
    }
    setVarieties([]);
  }, [menuItem]);

  // Fetch service points when modal opens
  useEffect(() => {
    if (isOpen && user?.id) {
      const fetchServicePoints = async () => {
        try {
          const points = await getServicePoints(user.id);
          setServicePoints(points);
        } catch (error) {
          console.error("Error fetching service points:", error);
        }
      };
      fetchServicePoints();
    }
  }, [isOpen, user?.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addVariety = () => {
    const newVariety: MenuItemVariety = {
      id: `variety-${Date.now()}-${Math.random()}`,
      name: "",
      description: "",
      price: "",
      position: varieties.length,
      isAvailable: true,
      isDefault: varieties.length === 0,
    };
    setVarieties([...varieties, newVariety]);
  };

  const removeVariety = (index: number) => {
    const updatedVarieties = varieties.filter((_, i) => i !== index);
    // Reassign positions and ensure we have a default
    const repositionedVarieties = updatedVarieties.map((variety, i) => ({
      ...variety,
      position: i,
      isDefault:
        i === 0 && updatedVarieties.length > 0
          ? true
          : variety.isDefault && i !== 0
            ? false
            : variety.isDefault,
    }));
    setVarieties(repositionedVarieties);
  };

  const updateVariety = (
    index: number,
    field: keyof MenuItemVariety,
    value: string | boolean,
  ) => {
    const updatedVarieties = varieties.map((variety, i) => {
      if (i === index) {
        const updatedVariety = { ...variety, [field]: value };

        // If setting this variety as default, unset others
        if (field === "isDefault" && value === true) {
          return updatedVariety;
        }
        return updatedVariety;
      }
      if (field === "isDefault" && value === true) {
        // Unset default for other varieties
        return { ...variety, isDefault: false };
      }
      return variety;
    });
    setVarieties(updatedVarieties);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description || "");
      formData.append("price", price || "0");
      formData.append("isAvailable", isAvailable.toString());

      // Add service point if selected
      if (selectedServicePoint && selectedServicePoint !== "none") {
        formData.append("servicePointId", selectedServicePoint);
      }

      // Only append image if it exists
      if (image) {
        formData.append("image", image);
      }

      // Add varieties data
      formData.append("varietyCount", varieties.length.toString());
      varieties.forEach((variety, index) => {
        if (variety.id) {
          formData.append(`variety_${index}_id`, variety.id);
        }
        formData.append(`variety_${index}_name`, variety.name);
        formData.append(`variety_${index}_description`, variety.description);
        formData.append(`variety_${index}_price`, variety.price);
        formData.append(
          `variety_${index}_position`,
          variety.position.toString(),
        );
        formData.append(
          `variety_${index}_isAvailable`,
          variety.isAvailable.toString(),
        );
        formData.append(
          `variety_${index}_isDefault`,
          variety.isDefault.toString(),
        );
      });

      // Pass the FormData to handleUpdateMenuItem
      await handleUpdateMenuItem(menuItem.id, formData);

      onClose();
    } catch (error) {
      console.error("Error updating menu item:", error);
      // Handle error here if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="price">Base Price</Label>
            <Input
              id="price"
              type="number"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/* Service Point Selection */}
          <div>
            <Label htmlFor="servicePoint">Service Point (Optional)</Label>
            <Select
              value={selectedServicePoint}
              onValueChange={setSelectedServicePoint}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service point" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Service Point</SelectItem>
                {servicePoints.map((point) => (
                  <SelectItem key={point.id} value={point.id}>
                    {point.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <Suspense fallback={<ImageLoadingPlaceholder />}>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                </Suspense>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAvailable"
              checked={isAvailable}
              onCheckedChange={(checked) => setIsAvailable(checked as boolean)}
            />
            <Label htmlFor="isAvailable">Available</Label>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Varieties</Label>
              <Button
                type="button"
                onClick={addVariety}
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Variety
              </Button>
            </div>
            {varieties.map((variety, index) => (
              <div
                key={variety.id || `variety-${index}`}
                className="border rounded-lg p-4 mb-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Variety {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeVariety(index)}
                    size="sm"
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`variety-${index}-name`}>Name</Label>
                    <Input
                      id={`variety-${index}-name`}
                      value={variety.name}
                      onChange={(e) =>
                        updateVariety(index, "name", e.target.value)
                      }
                      placeholder="e.g., Small, Medium, Large"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`variety-${index}-price`}>Price</Label>
                    <Input
                      id={`variety-${index}-price`}
                      type="number"
                      step="1"
                      value={variety.price}
                      onChange={(e) =>
                        updateVariety(index, "price", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor={`variety-${index}-description`}>
                    Description
                  </Label>
                  <Textarea
                    id={`variety-${index}-description`}
                    value={variety.description}
                    onChange={(e) =>
                      updateVariety(index, "description", e.target.value)
                    }
                    placeholder="Optional description"
                  />
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`variety-${index}-isAvailable`}
                      checked={variety.isAvailable}
                      onCheckedChange={(checked) =>
                        updateVariety(index, "isAvailable", checked as boolean)
                      }
                    />
                    <Label htmlFor={`variety-${index}-isAvailable`}>
                      Available
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`variety-${index}-isDefault`}
                      checked={variety.isDefault}
                      onCheckedChange={(checked) =>
                        updateVariety(index, "isDefault", checked as boolean)
                      }
                    />
                    <Label htmlFor={`variety-${index}-isDefault`}>
                      Default
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Menu Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
