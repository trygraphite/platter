"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@platter/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import { Input } from "@platter/ui/components/input";
import { Button } from "@platter/ui/components/button";
import { Loader2 } from "lucide-react";

// Define form schema with fixed validation
const qrFormSchema = z.discriminatedUnion("target", [
  z.object({
    target: z.literal("menu"),
    tableNumber: z.number().nullable().optional(),
  }),
  z.object({
    target: z.literal("table"),
    tableNumber: z.number().min(1, "Table number is required"),
  }),
  z.object({
    target: z.literal("location"),
    tableNumber: z.number().min(1, "Table number is required"),
  }),
]);

type QRFormValues = z.infer<typeof qrFormSchema>;

interface QRFormProps {
  onSubmit: (data: {
    target: "table" | "menu" | "location";
    tableNumber?: number | null;
  }) => Promise<void>;
  isLoading: boolean;
}

export function QRForm({ onSubmit, isLoading }: QRFormProps) {
  const form = useForm<QRFormValues>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: {
      target: "table",
      tableNumber: undefined,
    },
  });

  const targetValue = form.watch("target");

  // Reset table number when switching to menu
  const handleTargetChange = (value: "table" | "menu" | "location") => {
    form.setValue("target", value);
    if (value === "menu") {
      form.setValue("tableNumber", null);
    }
  };

  const handleSubmit = (values: QRFormValues) => {
    onSubmit({
      target: values.target,
      tableNumber: values.target === "menu" ? null : values.tableNumber,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel>QR Code Type</FormLabel>
              <Select
                onValueChange={handleTargetChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select QR code type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="table">Table QR Code</SelectItem>
                  <SelectItem value="menu">Menu QR Code</SelectItem>
                  <SelectItem value="location">Location QR Code</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose whether to create a table, menu, or location QR code
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {(targetValue === "table" || targetValue === "location") && (
          <FormField
            control={form.control}
            name="tableNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Table Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter table number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    value={field.value === null ? "" : field.value}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Enter the table number for this QR code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate QR Code"
          )}
        </Button>
      </form>
    </Form>
  );
}