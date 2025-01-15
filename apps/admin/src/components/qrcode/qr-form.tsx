// components/qr/QRForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@platter/ui/components/button";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";

const qrFormSchema = z.object({
  target: z.enum(["table", "menu"]),
  tableNumber: z
    .number()
    .min(1, "Table number must be at least 1")
    .max(999, "Table number must be less than 1000")
    .optional()
    .nullable(),
});

type FormData = z.infer<typeof qrFormSchema>;

interface QRFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export function QRForm({ onSubmit, isLoading }: QRFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: {
      target: "table",
      tableNumber: 1,
    },
  });

  const target = watch("target");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>QR Code Type</Label>
          <Select
            defaultValue="table"
            onValueChange={(value: "table" | "menu") => {
              setValue("target", value);
              if (value === "menu") {
                setValue("tableNumber", null);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table QR</SelectItem>
              <SelectItem value="menu">Menu QR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {target === "table" && (
          <div className="space-y-2">
            <Label htmlFor="tableNumber">Table Number</Label>
            <Input
              id="tableNumber"
              type="number"
              {...register("tableNumber", { valueAsNumber: true })}
              aria-invalid={!!errors.tableNumber}
            />
            {errors.tableNumber && (
              <p className="text-sm text-red-500">
                {errors.tableNumber.message}
              </p>
            )}
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Generating..." : "Generate QR Code"}
        </Button>
      </div>
    </form>
  );
}
