// components/qrcode/qr-display.tsx
"use client";

import { Button } from "@platter/ui/components/button";
import { Card } from "@platter/ui/components/card";
import { Download } from "lucide-react";
import { useState } from "react";
import { QRCodeCanvas } from "./qrCodeCanvas";

interface QRDisplayProps {
  qrCodeUrl: string;
  tableNumber?: number | null;
  locationName?: string;
  type: "table" | "menu" | "location";
  restaurantName?: string;
}

export function QRDisplay({
  qrCodeUrl,
  tableNumber,
  type,
  restaurantName,
  locationName,
 }: QRDisplayProps) {
  const [combinedImageUrl, setCombinedImageUrl] = useState<string | null>(null);

  const handleDownload = () => {
    if (!combinedImageUrl) return;

    const link = document.createElement("a");
    link.href = combinedImageUrl;
    link.download = getFileName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileName = () => {
    if (type === "location") {
      const sanitizedName = locationName?.toLowerCase().replace(/\s+/g, "-");
      return `${sanitizedName}-table-${tableNumber}-qrcode.png`;
    }
    if (type === "menu") return "menu-qrcode.png";
    return `table-${tableNumber}-qrcode.png`;
  };
  const getTitle = () => {
    if (type === "menu") return "Menu QR Code";
    if (type === "location") return `${locationName} QR Code`;
    return `Table ${tableNumber} QR Code`;
  };

  return (
    <Card className="p-6 flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">{getTitle()}</h3>
      <div className="w-84 h-84">
        <QRCodeCanvas
          qrCodeUrl={qrCodeUrl}
          width={556}
          height={756}
          target={type}
          targetId={tableNumber?.toString() || ""}
          locationName={locationName}
          onImageGenerated={setCombinedImageUrl}
          restaurantName={restaurantName}
        />
      </div>
      <Button
        onClick={handleDownload}
        className="w-full"
        disabled={!combinedImageUrl}
      >
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </Card>
  );
}