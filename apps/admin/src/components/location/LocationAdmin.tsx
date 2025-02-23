"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@platter/ui/components/button";
import { Input } from "@platter/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@platter/ui/components/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { z } from "zod";
import { useEffect, useState, useCallback } from "react";
import type { User } from "better-auth";
import {
  addRestaurantToLocation,
  createLocation,
  getLocations,
  removeRestaurantFromLocation,
} from "@/lib/actions/location-actions";
import { toast } from "@platter/ui/components/sonner";
import { JoinRequests } from "./JoinRequest";
import { Trash2Icon } from "lucide-react";

const locationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  seatingCapacity: z.number().min(1, "Seating capacity is required"),
  description: z.string().optional(),
});

export function LocationAdmin({ restaurants }: { restaurants: User[] }) {
  const [locations, setLocations] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      seatingCapacity: 0,
      description: "",
    },
  });
  // ADD SEATING AMOUNT IN LOCATIONS
  const handleCreateLocation = async (
    values: z.infer<typeof locationSchema>,
  ) => {
    try {
      setIsSubmitting(true);
      const result = await createLocation(values);

      if (result?.success) {
        toast.success(result.success);
        form.reset();
        await loadLocations();
      } else if (result?.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRestaurant = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const locationId = formData.get("locationId") as string;
    const restaurantId = formData.get("restaurantId") as string;

    try {
      const result = await addRestaurantToLocation({
        locationId,
        restaurantId,
      });
      if (result.success) {
        toast.success(result.success);
        await loadLocations();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to add restaurant");
    }
  };

  const loadLocations = useCallback(async () => {
    try {
      const data = await getLocations();
      setLocations(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load locations");
      setLocations([]);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return (
    <div className="space-y-6 mb-6">
      <JoinRequests />
      <Card>
        <CardHeader>
          <CardTitle>Create New Location</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateLocation)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seatingCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seating Capacity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Location"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Restaurants in Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locations?.map((location) => (
              <div key={location?.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">
                    {location?.name || "Unnamed Location"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Seating Capacity: {location?.seatingCapacity}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {location?.users?.length || 0} restaurants
                  </span>
                </div>

                <form
                  onSubmit={handleAddRestaurant}
                  className="flex gap-2 items-end mb-6"
                >
                  <input type="hidden" name="locationId" value={location.id} />
                  <select
                    name="restaurantId"
                    className="border p-2 rounded w-full bg-background"
                    required
                  >
                    <option value="">Select a restaurant to add</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="outline">
                    Add Restaurant
                  </Button>
                </form>

                <div className="space-y-2">
                  {location?.users.map((restaurant: User) => (
                    <div
                      key={restaurant.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{restaurant.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {restaurant.email}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const result = await removeRestaurantFromLocation(
                            restaurant.id,
                          );
                          if (result?.success) {
                            toast.success(result.success);
                            loadLocations();
                          } else if (result?.error) {
                            toast.error(result.error);
                          }
                        }}
                      >
                        <Trash2Icon className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
