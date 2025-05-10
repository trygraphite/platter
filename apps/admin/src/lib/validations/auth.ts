import { z } from "zod";

export const accountSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password too long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const restaurantDetailsSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Restaurant name must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().length(2, "Please select a valid state"),
  zipCode: z.string().min(1, "Invalid ZIP code format"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").or(z.string().length(0)),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  cuisine: z.string().min(1, "Please select a cuisine type"),
  // Handle all the new fields and fix type issues
  googleReviewLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  seatingCapacity: z.coerce.number().min(1, "Seating capacity is required").or(z.literal(0)),
  openingHours: z.string().min(1, "Opening hours are required").optional(),
  closingHours: z.string().min(1, "Closing hours are required").optional(),
  // Add new fields with appropriate validations
  subdomain: z.string().min(1, "Subdomain is required"),
  icon: z.any().optional(),
  image: z.any().optional(),
});

export type AccountData = z.infer<typeof accountSchema>;
export type RestaurantDetailsData = z.infer<typeof restaurantDetailsSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password too long"),
});

export type LoginData = z.infer<typeof loginSchema>;
