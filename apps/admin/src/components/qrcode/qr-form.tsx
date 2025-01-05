// components/qr/QRForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@platter/ui/components/button";
import { Input } from "@platter/ui/components/input";
import { Label } from "@platter/ui/components/label";
import { Loader2 } from "lucide-react";

const qrFormSchema = z.object({
  tableNumber: z
    .number()
    .min(1, "Table number must be at least 1")
    .max(999, "Table number must be less than 1000"),
});

interface QRFormProps {
  onSubmit: (tableNumber: number) => Promise<void>;
  isLoading: boolean;
}

export function QRForm({ onSubmit, isLoading }: QRFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ tableNumber: number }>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: {
      tableNumber: 1,
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data.tableNumber))}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tableNumber">Table Number</Label>
          <Input
            id="tableNumber"
            type="number"
            {...register("tableNumber", { valueAsNumber: true })}
            aria-invalid={!!errors.tableNumber}
          />
          {errors.tableNumber && (
            <p className="text-sm text-red-500">{errors.tableNumber.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Generating..." : "Generate QR Code"}
        </Button>
      </div>
    </form>
  );
}
