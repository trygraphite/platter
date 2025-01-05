// components/qr/QRDisplay.tsx
import { Button } from "@platter/ui/components/button";
import { Card } from "@platter/ui/components/card";
import { Download } from "lucide-react";
import Image from "next/image";

interface QRDisplayProps {
  qrCodeUrl: string;
  tableNumber: number;
}

export function QRDisplay({ qrCodeUrl, tableNumber }: QRDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `table-${tableNumber}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Table {tableNumber} QR Code</h3>
      <div className="relative w-64 h-64">
        <Image
          src={qrCodeUrl}
          alt={`QR Code for table ${tableNumber}`}
          fill
          className="object-contain"
        />
      </div>
      <Button onClick={handleDownload} className="w-full">
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </Card>
  );
}
