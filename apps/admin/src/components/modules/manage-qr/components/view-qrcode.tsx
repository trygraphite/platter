"use client";

import { Button } from "@platter/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@platter/ui/components/dialog";
import { Separator } from "@platter/ui/components/separator";
import type { QRCode } from "@prisma/client";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { QRViewDisplay } from "@/components/qrcode/qr-view-display";

type QRCodeWithRelations = QRCode & {
  user?: { name: string; email: string } | null;
  table?: { name: string; number: string } | null;
  location?: { name: string } | null;
  restaurant?: { name: string } | null;
};

interface ViewQRCodeDialogProps {
  qrCode: QRCodeWithRelations;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewQRCodeDialog({
  qrCode,
  isOpen,
  onClose,
}: ViewQRCodeDialogProps) {
  const [isLoading] = useState(false);
  const getQRCodeType = (): "table" | "menu" | "location" => {
    if (!qrCode.target) return "table";
    return qrCode.target.toLowerCase() === "menu"
      ? "menu"
      : qrCode.target.toLowerCase() === "location"
        ? "location"
        : "table";
  };

  const handleShare = () => {
    // Implement share functionality
    // console.log('Sharing QR code:', qrCode.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Details</DialogTitle>
          <DialogDescription>
            {`QR code for ${getQRCodeType()}${qrCode.targetNumber ? ` #${qrCode.targetNumber}` : ""}`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          {qrCode.link ? (
            <QRViewDisplay
              qrCodeUrl={qrCode.link}
              tableName={qrCode.targetNumber || null}
              type={getQRCodeType()}
              locationName={qrCode.location?.name || ""}
              restaurantName={qrCode.user?.name || ""}
            />
          ) : (
            <div className="text-center p-8 bg-gray-100 rounded-md w-full">
              <p>No QR code URL available</p>
            </div>
          )}

          <div className="w-full mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Target
                </p>
                <p className="text-sm">{qrCode.target || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Table Name
                </p>
                <p className="text-sm">{qrCode.targetNumber || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={!qrCode.link || isLoading}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
