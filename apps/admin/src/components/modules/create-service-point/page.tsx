"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import { toast } from "@platter/ui/components/sonner";
import { Switch } from "@platter/ui/components/switch";
import { Textarea } from "@platter/ui/components/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  type CreateServicePointFormData,
  createServicePoint,
} from "@/lib/actions/create-service-point";

const servicePointSchema = z.object({
  name: z.string().min(1, { message: "Service point name is required" }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof servicePointSchema>;

export default function CreateServicePointPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(servicePointSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const result = await createServicePoint(
        params.restaurantId,
        data as CreateServicePointFormData,
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Service point created successfully");
      router.push("/manage-service-point");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Service Point</CardTitle>
          <CardDescription>
            Add a new service point to organize your menu items and staff
            assignments
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Point Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Kitchen, Bar, Coffee Station, Outside Grill"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Brief description of this service point's purpose or location"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Active service points can be assigned to menu items and staff
                members
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/manage-service-point")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Service Point"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
