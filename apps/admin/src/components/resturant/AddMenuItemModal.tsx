"use client";

import { useRestaurant } from "@/context/resturant-context";
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
import { Textarea } from "@platter/ui/components/textarea";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { useState } from "react";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
}

interface Variety {
  name: string;
  description: string;
  price: string;
  position: number;
  isAvailable: boolean;
  isDefault: boolean;
}

export function AddMenuItemModal({
  isOpen,
  onClose,
  categoryId,
}: AddMenuItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { handleAddMenuItem } = useRestaurant();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addVariety = () => {
    const newVariety: Variety = {
      name: "",
      description: "",
      price: "",
      position: varieties.length,
      isAvailable: true,
      isDefault: varieties.length === 0, // First variety is default
    };
    setVarieties([...varieties, newVariety]);
  };

  const removeVariety = (index: number) => {
    const updatedVarieties = varieties.filter((_, i) => i !== index);
    // Reassign positions and ensure we have a default
    const repositionedVarieties = updatedVarieties.map((variety, i) => ({
      ...variety,
      position: i,
      isDefault: i === 0 && updatedVarieties.length > 0 ? true : (variety.isDefault && i !== 0 ? false : variety.isDefault)
    }));
    setVarieties(repositionedVarieties);
  };

  const updateVariety = (index: number, field: keyof Variety, value: string | boolean) => {
    const updatedVarieties = varieties.map((variety, i) => {
      if (i === index) {
        const updatedVariety = { ...variety, [field]: value };
        
        // If setting this variety as default, unset others
        if (field === 'isDefault' && value === true) {
          return updatedVariety;
        }
        return updatedVariety;
      } else if (field === 'isDefault' && value === true) {
        // Unset default for other varieties
        return { ...variety, isDefault: false };
      }
      return variety;
    });
    setVarieties(updatedVarieties);
  };

  // const moveVariety = (index: number, direction: 'up' | 'down') => {
  //   const newIndex = direction === 'up' ? index - 1 : index + 1;
  //   if (newIndex < 0 || newIndex >= varieties.length) return;

  //   const updatedVarieties = [...varieties];
  //   [updatedVarieties[index], updatedVarieties[newIndex]] = [updatedVarieties[newIndex], updatedVarieties[index]];
    
  //   // Update positions
  //   updatedVarieties.forEach((variety, i) => {
  //     variety.position = i;
  //   });
    
  //   setVarieties(updatedVarieties);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description || "");
      formData.append("categoryId", categoryId);
      formData.append("price", price || "0");
      formData.append("isAvailable", isAvailable.toString());

      // Only append image if it exists
      if (image) {
        formData.append("image", image);
      }

      // Add varieties data
      formData.append("varietyCount", varieties.length.toString());
      varieties.forEach((variety, index) => {
        formData.append(`variety_${index}_name`, variety.name);
        formData.append(`variety_${index}_description`, variety.description);
        formData.append(`variety_${index}_price`, variety.price);
        formData.append(`variety_${index}_position`, variety.position.toString());
        formData.append(`variety_${index}_isAvailable`, variety.isAvailable.toString());
        formData.append(`variety_${index}_isDefault`, variety.isDefault.toString());
      });

      // Pass the FormData to handleAddMenuItem
      await handleAddMenuItem(categoryId, formData);

      // Reset form state after successful submission
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setImagePreview(null);
      setIsAvailable(true);
      setVarieties([]);
      onClose();
    } catch (error) {
      console.error("Error adding menu item:", error);
      // Handle error here if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
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
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 max-w-full h-32 object-cover"
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isAvailable" 
              checked={isAvailable}
              onCheckedChange={(checked) => setIsAvailable(checked === true)}
            />
            <Label htmlFor="isAvailable">Available</Label>
          </div>

          {/* Varieties Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Varieties (Optional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addVariety}>
                <Plus className="w-4 h-4 mr-2" />
                Add Variety
              </Button>
            </div>
            
            {varieties.length > 0 && (
              <div className="space-y-4 border rounded-lg p-4">
                {varieties.map((variety, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Variety {index + 1}</span>
                      <div className="flex items-center gap-2">
                        {/* <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveVariety(index, 'up')}
                          disabled={index === 0}
                        >
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveVariety(index, 'down')}
                          disabled={index === varieties.length - 1}
                        >
                          <MoveDown className="w-4 h-4" />
                        </Button> */}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVariety(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`variety-name-${index}`}>Name</Label>
                        <Input
                          id={`variety-name-${index}`}
                          value={variety.name}
                          onChange={(e) => updateVariety(index, 'name', e.target.value)}
                          placeholder="e.g., Small, Medium, Large"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variety-price-${index}`}>Price</Label>
                        <Input
                          id={`variety-price-${index}`}
                          type="number"
                          step="1"
                          value={variety.price}
                          onChange={(e) => updateVariety(index, 'price', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`variety-description-${index}`}>Description (Optional)</Label>
                      <Input
                        id={`variety-description-${index}`}
                        value={variety.description}
                        onChange={(e) => updateVariety(index, 'description', e.target.value)}
                        placeholder="Optional description"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`variety-available-${index}`}
                          checked={variety.isAvailable}
                          onCheckedChange={(checked) => updateVariety(index, 'isAvailable', checked === true)}
                        />
                        <Label htmlFor={`variety-available-${index}`}>Available</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`variety-default-${index}`}
                          checked={variety.isDefault}
                          onCheckedChange={(checked) => updateVariety(index, 'isDefault', checked === true)}
                        />
                        <Label htmlFor={`variety-default-${index}`}>Default</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant={isLoading ? "secondary" : "default"}
            className={isLoading ? "opacity-70 cursor-not-allowed" : ""}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding Menu Item...
              </span>
            ) : (
              "Add Menu Item"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}