"use client";

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
import { Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createRestaurantAction } from "@/lib/actions/create-restaurant";
import { useSession } from "@/lib/auth/client";
import { states } from "@/lib/constants/states";
import { useEdgeStore } from "@/lib/edgestore/edgestore";
import {
  type RestaurantDetailsData,
  restaurantDetailsSchema,
} from "@/lib/validations/auth";
import ImageUpload from "../modules/setting/settings-image-component";

export default function RestaurantDetailsForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RestaurantDetailsData>({
    resolver: zodResolver(restaurantDetailsSchema),
    defaultValues: {
      seatingCapacity: 0,
    },
  });

  // Update the form values when the image URLs change
  useEffect(() => {
    setValue("icon", iconUrl);
    setValue("image", imageUrl);
  }, [iconUrl, imageUrl, setValue]);

  // Watch the name field to update subdomain
  const restaurantName = watch("name");

  // Generate subdomain from restaurant name
  useEffect(() => {
    if (restaurantName) {
      const generatedSubdomain = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      // Update the subdomain field in the form state without directly controlling the input
      setValue("subdomain", generatedSubdomain, { shouldDirty: true });
    }
  }, [restaurantName, setValue]);

  const onSubmit = async (data: RestaurantDetailsData) => {
    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }
    // Include the icon and image URLs in the submission data
    const submissionData = {
      ...data,
      hasCompletedOnboarding: true,
      icon: iconUrl,
      image: imageUrl,
    };

    const result = await createRestaurantAction(
      submissionData,
      session.user.id,
    );

    if (result.success) {
      toast.success("Restaurant details saved!");
      router.push("/");
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Restaurant Icon */}
        <ImageUpload
          id="restaurant-icon"
          label="Restaurant Icon"
          description="This icon will be displayed on the guest app QR scan screen"
          initialImage={null}
          imageType="restaurant-icon"
          isCircular={true}
          onImageChange={setIconUrl}
        />

        {/* Restaurant Cover Image */}
        <ImageUpload
          id="restaurant-image"
          label="Restaurant Cover Image"
          description="This image will be displayed on the QR code home screen"
          initialImage={null}
          imageType="restaurant-cover"
          onImageChange={setImageUrl}
        />

        {/* Restaurant Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Restaurant Name</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Subdomain (disabled, auto-generated) */}
        <div className="space-y-2">
          <Label htmlFor="subdomain">Subdomain</Label>
          <div className="flex items-center">
            <Input
              id="subdomain"
              {...register("subdomain")}
              // Don't use value and register together - this causes the controlled/uncontrolled error
              disabled
              className="bg-gray-100 rounded-r-none border-r-0"
              style={{ maxWidth: "150px" }}
            />
            <div className="bg-gray-100 border border-l-0 border-input px-3 py-2 h-10 rounded-r-md text-sm text-gray-500 flex items-center">
              .platterng.com
            </div>
          </div>
          {errors.subdomain && (
            <p className="text-xs text-red-500">{errors.subdomain.message}</p>
          )}
        </div>

        {/* Description */}
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

        {/* Address */}
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

        {/* City and State */}
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
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              )}
            />
            {errors.state && (
              <p className="text-xs text-red-500">{errors.state.message}</p>
            )}
          </div>
        </div>

        {/* ZIP Code */}
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

        {/* Phone Number */}
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

        {/* Website */}
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

        {/* Google Review Link */}
        <div className="space-y-2">
          <Label htmlFor="googleReviewLink">Google Review Link</Label>
          <Input
            id="googleReviewLink"
            {...register("googleReviewLink")}
            type="url"
            aria-invalid={!!errors.googleReviewLink}
            placeholder="https://g.page/r/..."
          />
          {errors.googleReviewLink && (
            <p className="text-xs text-red-500">
              {errors.googleReviewLink.message}
            </p>
          )}
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Info className="size-3" />
            This link is your Google Maps listing link, so users can leave a
            Google review
          </p>
        </div>

        {/* Cuisine Type */}
        <div className="space-y-2">
          <Label htmlFor="cuisine">Cuisine Type</Label>
          <Controller
            name="cuisine"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigerian">Nigerian</SelectItem>
                  <SelectItem value="African">African</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.cuisine && (
            <p className="text-xs text-red-500">{errors.cuisine.message}</p>
          )}
        </div>

        {/* Seating Capacity */}
        <div className="space-y-2">
          <Label htmlFor="seatingCapacity">Seating Capacity</Label>
          <Input
            id="seatingCapacity"
            {...register("seatingCapacity", { valueAsNumber: true })}
            type="number"
            min="0"
            aria-invalid={!!errors.seatingCapacity}
          />
          {errors.seatingCapacity && (
            <p className="text-xs text-red-500">
              {errors.seatingCapacity.message}
            </p>
          )}
        </div>

        {/* Hours */}
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
