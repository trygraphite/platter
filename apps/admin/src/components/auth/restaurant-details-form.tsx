"use client";

import { createRestaurantAction } from "@/lib/actions/create-restaurant";
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

export default function RestaurantDetailsForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RestaurantDetailsData>({
    resolver: zodResolver(restaurantDetailsSchema),
  });

  const onSubmit = async (data: RestaurantDetailsData) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    const result = await createRestaurantAction(data, session.user.id);

    if (result.success) {
      toast.success("Restaurant details saved!");
      router.push("/dashboard");
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Restaurant Name</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
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
              aria-invalid={!!errors.city}
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select onValueChange={(value) => setValue("state", value)}>
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
            aria-invalid={!!errors.website}
          />
          {errors.website && (
            <p className="text-xs text-red-500">{errors.website.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cuisine">Cuisine Type</Label>
          <Select onValueChange={(value) => setValue("cuisine", value)}>
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
              aria-invalid={!!errors.closingHours}
            />
            {errors.closingHours && (
              <p className="text-xs text-red-500">
                {errors.closingHours.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full mt-8">
          {isSubmitting && (
            <Loader2 className="size-4 animate-spin transition" />
          )}
          {isSubmitting ? "Processing..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
