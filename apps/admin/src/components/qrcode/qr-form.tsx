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
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the base form fields with nullable tableName to ensure consistent typing
const formFields = {
  target: z.enum(["menu", "table", "location"]),
  tableName: z.string().nullable(),
};

// Define form schema with validation logic based on target
const qrFormSchema = z.object(formFields).refine(
  (data) => {
    // For table and location, tableName must be provided and not empty
    if (
      (data.target === "table" || data.target === "location") &&
      (data.tableName === null || data.tableName.trim() === "")
    ) {
      return false;
    }
    return true;
  },
  {
    message: "Table name is required",
    path: ["tableName"],
  },
);

type QRFormValues = z.infer<typeof qrFormSchema>;

interface QRFormProps {
  onSubmit: (data: {
    target: "table" | "menu" | "location";
    tableName: string | null;
  }) => Promise<void>;
  isLoading: boolean;
}

export function QRForm({ onSubmit, isLoading }: QRFormProps) {
  const form = useForm<QRFormValues>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: {
      target: "table" as const,
      tableName: null,
    },
  });

  const targetValue = form.watch("target");

  // Reset table name when switching to menu
  const handleTargetChange = (value: "table" | "menu" | "location") => {
    form.setValue("target", value);
    if (value === "menu") {
      form.setValue("tableName", null);
    }
  };

  const handleSubmit = (values: QRFormValues) => {
    onSubmit({
      target: values.target,
      tableName: values.tableName,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>QR Code Type</Label>
        <Select
          onValueChange={handleTargetChange}
          defaultValue={targetValue}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select QR code type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="table">Table QR Code</SelectItem>
            <SelectItem value="menu">Menu QR Code</SelectItem>
            {/* <SelectItem value="location">Location QR Code</SelectItem> */}
          </SelectContent>
        </Select>
        {form.formState.errors.target && (
          <p className="text-sm text-red-500">
            {form.formState.errors.target.message as string}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Choose whether to create a table or menu QR code
        </p>
      </div>

      {(targetValue === "table" || targetValue === "location") && (
        <div className="space-y-2">
          <Label>Table Name</Label>
          <Input
            type="text"
            placeholder="Enter table name (e.g., A1, B2, VIP1)"
            value={form.watch("tableName") ?? ""}
            onChange={(e) =>
              form.setValue(
                "tableName",
                e.target.value === "" ? null : e.target.value,
              )
            }
            disabled={isLoading}
          />
          {form.formState.errors.tableName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.tableName.message as string}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Enter the table name for this QR code (e.g., A1, B2, VIP1, etc.)
          </p>
        </div>
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
  );
}
