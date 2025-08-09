"use client";

import { toast } from "@platter/ui/components/sonner";
import { useState } from "react";
import { QRDisplay } from "@/components/qrcode/qr-display";
import { QRForm } from "@/components/qrcode/qr-form";
import { createQRCodeAction } from "@/lib/actions/create-qrcode";

export default function QRCodePage() {
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [currentTable, setCurrentTable] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [restaurantName, setRestaurantName] = useState<string>("");

  const [currentType, setCurrentType] = useState<"table" | "menu" | "location">(
    "table",
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleGenerateQR = async (data: {
    target: "table" | "menu" | "location";
    tableName?: string | null;
  }) => {
    setIsLoading(true);
    try {
      const result = await createQRCodeAction(
        data.tableName || undefined,
        data.target,
      );

      if (result.success && result.qrCodeUrl) {
        setQRCode(result.qrCodeUrl);
        setCurrentTable(data.tableName ?? null);
        setCurrentType(data.target);
        setLocationName(result.locationName || "");
        setRestaurantName(result.restaurantName || "");

        toast.success("QR Code generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate QR code");
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Generate QR Codes</h1>
          <p className="text-muted-foreground mt-2">
            Create QR codes for your restaurant tables, menu, and location
          </p>
        </div>

        <QRForm onSubmit={handleGenerateQR} isLoading={isLoading} />

        {qrCode && (
          <QRDisplay
            qrCodeUrl={qrCode}
            tableName={currentTable}
            type={currentType}
            locationName={locationName}
            restaurantName={restaurantName}
          />
        )}
      </div>
    </div>
  );
}
