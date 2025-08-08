"use client";

import { getServicePoints } from "@/actions/menu";
import { useUploadThing } from "@/utils/uploadThing";
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
import { toast } from "@platter/ui/components/sonner";
import { Textarea } from "@platter/ui/components/textarea";
import { MoveDown, MoveUp, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useStaffMenu } from "./StaffMenuProvider";

interface StaffAddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
}

interface Variety {
  id: string;
  name: string;
  description: string;
  price: string;
  position: number;
  isAvailable: boolean;
  isDefault: boolean;
}

export function StaffAddMenuItemModal({
  isOpen,
  onClose,
  categoryId,
}: StaffAddMenuItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [servicePoints, setServicePoints] = useState<
    Array<{
      id: string;
      name: string;
      description: string | null;
      isActive: boolean;
    }>
  >([]);
  const [selectedServicePoint, setSelectedServicePoint] = useState<string>("");
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { fetchCategories, handleAddMenuItem } = useStaffMenu();
  const { startUpload: startMenuItemImageUpload } = useUploadThing(
    "menuItemImageUploader",
  );

  useEffect(() => {
    if (!isOpen) return;
    // Reset form when modal opens
    setName("");
    setDescription("");
    setPrice("");
    setImage(null);
    setIsAvailable(true);
    setSelectedServicePoint("");
    setVarieties([]);

    // Fetch service points
    fetchServicePoints();
  }, [isOpen]);

  const fetchServicePoints = async () => {
    try {
      const data = await getServicePoints();
      setServicePoints(data);
    } catch (error) {
      console.error("Error fetching service points:", error);
    }
  };

  const addVariety = () => {
    const newVariety: Variety = {
      id: `temp-${Date.now()}`,
      name: "",
      description: "",
      price: "",
      position: varieties.length + 1,
      isAvailable: true,
      isDefault: varieties.length === 0,
    };
    setVarieties([...varieties, newVariety]);
  };

  const removeVariety = (id: string) => {
    const updatedVarieties = varieties.filter((v) => v.id !== id);
    // If we removed the default variety, make the first one default
    if (updatedVarieties.length > 0) {
      const hasDefault = updatedVarieties.some((v) => v.isDefault);
      if (!hasDefault) {
        const adjusted = updatedVarieties.map((v, idx) =>
          idx === 0 ? { ...v, isDefault: true } : v,
        );
        setVarieties(adjusted);
        return;
      }
    }
    setVarieties(updatedVarieties);
  };

  const updateVariety = (
    id: string,
    field: keyof Variety,
    value: string | number | boolean,
  ) => {
    setVarieties(
      varieties.map((variety) =>
        variety.id === id ? { ...variety, [field]: value } : variety,
      ),
    );
  };

  const moveVariety = (id: string, direction: "up" | "down") => {
    const index = varieties.findIndex((v) => v.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === varieties.length - 1)
    ) {
      return;
    }

    const newVarieties = [...varieties];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const a = newVarieties[index];
    const b = newVarieties[targetIndex];
    if (!a || !b) return;
    newVarieties[index] = b;
    newVarieties[targetIndex] = a;

    // Update positions
    newVarieties.forEach((variety, idx) => {
      variety.position = idx + 1;
    });

    setVarieties(newVarieties);
  };

  const handleDefaultChange = (id: string, isDefault: boolean) => {
    if (isDefault) {
      // Only one variety can be default
      setVarieties(
        varieties.map((variety) => ({
          ...variety,
          isDefault: variety.id === id,
        })),
      );
    }
  };

  const formatPrice = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Parse as number and format
    const number = Number.parseFloat(numericValue);
    if (Number.isNaN(number)) return "";

    return number.toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price.trim()) {
      toast.error("Name and price are required");
      return;
    }

    const numericPrice = Number.parseFloat(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    // Validate varieties
    for (const variety of varieties) {
      if (!variety.name.trim()) {
        toast.error("All varieties must have a name");
        return;
      }
      const varietyPrice = Number.parseFloat(variety.price);
      if (Number.isNaN(varietyPrice) || varietyPrice <= 0) {
        toast.error("All varieties must have a valid price");
        return;
      }
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", numericPrice.toString());
      formData.append("categoryId", categoryId);
      formData.append("isAvailable", isAvailable.toString());

      if (selectedServicePoint) {
        formData.append("servicePointId", selectedServicePoint);
      }

      // Upload image first (if any) to get a URL
      if (image) {
        const upload = await startMenuItemImageUpload([image]);
        const file = (upload?.[0] ?? {}) as { ufsUrl?: string; url?: string };
        const uploadedUrl = file.ufsUrl ?? file.url;
        if (uploadedUrl) {
          formData.append("image", uploadedUrl);
        }
      }

      // Add varieties
      formData.append("varietyCount", varieties.length.toString());
      varieties.forEach((variety, index) => {
        formData.append(`variety_${index}_name`, variety.name.trim());
        formData.append(
          `variety_${index}_description`,
          variety.description.trim(),
        );
        formData.append(
          `variety_${index}_price`,
          Number.parseFloat(variety.price).toString(),
        );
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

      await handleAddMenuItem(formData);
      toast.success("Menu item created successfully");
      await fetchCategories();
      onClose();
    } catch (error) {
      console.error("Error creating menu item:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create menu item",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const displayPrice = (value: string) => {
    const number = Number.parseFloat(value);
    if (Number.isNaN(number)) return "";
    return `₦${number.toLocaleString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter menu item name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="price">Price * (₦)</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(formatPrice(e.target.value))}
                  placeholder="0"
                  required
                />
                {price && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Display: {displayPrice(price)}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="servicePoint">Service Point</Label>
                <Select
                  value={selectedServicePoint}
                  onValueChange={setSelectedServicePoint}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service point (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicePoints.map((sp) => (
                      <SelectItem key={sp.id} value={sp.id}>
                        {sp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAvailable"
                  checked={isAvailable}
                  onCheckedChange={(checked) =>
                    setIsAvailable(checked === true)
                  }
                />
                <Label htmlFor="isAvailable">Available for ordering</Label>
              </div>
            </div>
          </div>

          {/* Varieties Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Varieties (Optional)</h3>
              <Button
                type="button"
                onClick={addVariety}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Variety
              </Button>
            </div>

            {varieties.length > 0 && (
              <div className="space-y-3">
                {varieties.map((variety, index) => (
                  <div
                    key={variety.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Variety {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveVariety(variety.id, "up")}
                          disabled={index === 0}
                        >
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveVariety(variety.id, "down")}
                          disabled={index === varieties.length - 1}
                        >
                          <MoveDown className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariety(variety.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={variety.name}
                          onChange={(e) =>
                            updateVariety(variety.id, "name", e.target.value)
                          }
                          placeholder="Variety name"
                          required
                        />
                      </div>

                      <div>
                        <Label>Price * (₦)</Label>
                        <Input
                          value={variety.price}
                          onChange={(e) =>
                            updateVariety(
                              variety.id,
                              "price",
                              formatPrice(e.target.value),
                            )
                          }
                          placeholder="0"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Input
                          value={variety.description}
                          onChange={(e) =>
                            updateVariety(
                              variety.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Variety description"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={variety.isAvailable}
                            onCheckedChange={(checked) =>
                              updateVariety(variety.id, "isAvailable", checked)
                            }
                          />
                          <Label>Available</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={variety.isDefault}
                            onCheckedChange={(checked) =>
                              handleDefaultChange(variety.id, !!checked)
                            }
                          />
                          <Label>Default option</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Menu Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
