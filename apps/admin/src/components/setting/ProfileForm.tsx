"use client";

import { useSession } from "@/lib/auth/client";
import { states } from "@/lib/constants/states";
import {
  type RestaurantDetailsData,
  restaurantDetailsSchema,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@platter/ui/components/button";
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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { updateRestaurantAction } from "@/lib/actions/update-profile";

interface RestaurantDetailsFormProps {
  initialData: RestaurantDetailsData;
}

export default function UpdateRestaurantDetailsForm({ initialData }: any) {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    reset,
  } = useForm<RestaurantDetailsData>({
    resolver: zodResolver(restaurantDetailsSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    // Set initial values for select fields
    setValue("state", initialData.state);
    setValue("cuisine", initialData.cuisine);
  }, [initialData, setValue]);

  const onSubmit = async (data: RestaurantDetailsData) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    const result = await updateRestaurantAction(data, session.user.id);

    if (result.success) {
      toast.success("Restaurant details updated successfully!");
      reset(data); // Reset form state to mark it as "unmodified"
      router.refresh(); // Refresh the page to show updated data
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Restaurant Name</Label>
          <Input
            id="name"
            {...register("name")}
            defaultValue={initialData.name}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            defaultValue={initialData.description}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register("address")}
            defaultValue={initialData.address}
            aria-invalid={!!errors.address}
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register("city")}
              defaultValue={initialData.city}
              aria-invalid={!!errors.city}
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              onValueChange={(value) => setValue("state", value)}
              defaultValue={initialData.state}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem
                    key={state.abbreviation}
                    value={state.abbreviation}
                  >
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-xs text-red-500">{errors.state.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            {...register("zipCode")}
            defaultValue={initialData.zipCode}
            aria-invalid={!!errors.zipCode}
          />
          {errors.zipCode && (
            <p className="text-xs text-red-500">{errors.zipCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            {...register("phone")}
            type="tel"
            defaultValue={initialData.phone}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            {...register("website")}
            type="url"
            defaultValue={initialData.website}
            aria-invalid={!!errors.website}
          />
          {errors.website && (
            <p className="text-xs text-red-500">{errors.website.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cuisine">Cuisine Type</Label>
          <Select
            onValueChange={(value) => setValue("cuisine", value)}
            defaultValue={initialData.cuisine}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cuisine type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
              <SelectItem value="mexican">Mexican</SelectItem>
              <SelectItem value="indian">Indian</SelectItem>
              <SelectItem value="american">American</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.cuisine && (
            <p className="text-xs text-red-500">{errors.cuisine.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="seatingCapacity">Seating Capacity</Label>
          <Input
            id="seatingCapacity"
            {...register("seatingCapacity")}
            type="number"
            defaultValue={initialData.seatingCapacity}
            aria-invalid={!!errors.seatingCapacity}
          />
          {errors.seatingCapacity && (
            <p className="text-xs text-red-500">
              {errors.seatingCapacity.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="openingHours">Opening Hours</Label>
            <Input
              id="openingHours"
              {...register("openingHours")}
              type="time"
              defaultValue={initialData.openingHours}
              aria-invalid={!!errors.openingHours}
            />
            {errors.openingHours && (
              <p className="text-xs text-red-500">
                {errors.openingHours.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="closingHours">Closing Hours</Label>
            <Input
              id="closingHours"
              {...register("closingHours")}
              type="time"
              defaultValue={initialData.closingHours}
              aria-invalid={!!errors.closingHours}
            />
            {errors.closingHours && (
              <p className="text-xs text-red-500">
                {errors.closingHours.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full mt-8"
        >
          {isSubmitting && (
            <Loader2 className="size-4 animate-spin transition" />
          )}
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
