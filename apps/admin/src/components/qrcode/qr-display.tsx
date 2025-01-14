import { Button } from "@platter/ui/components/button";
import { Card } from "@platter/ui/components/card";
import { Download } from "lucide-react";
import Image from "next/image";

interface QRDisplayProps {
  qrCodeUrl: string;
  tableNumber?: number | null;
  type: 'table' | 'menu';
}

export function QRDisplay({ qrCodeUrl, tableNumber, type }: QRDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = type === 'table' 
      ? `table-${tableNumber}-qr.png`
      : 'menu-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">
        {type === 'table' ? `Table ${tableNumber} QR Code` : 'Menu QR Code'}
      </h3>
      <div className="relative w-64 h-64">
        <Image
          src={qrCodeUrl}
          alt={type === 'table' ? `QR Code for table ${tableNumber}` : 'QR Code for menu'}
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