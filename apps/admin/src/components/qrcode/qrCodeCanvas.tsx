// components/qrcode/qrcode-canvas.tsx (updated)
"use client";

import { HourglassLoader } from "@platter/ui/components/timeLoader";
import { useEffect, useState } from "react";

interface QRCodeCanvasProps {
  qrCodeUrl: string;
  width: number;
  height: number;
  target: "table" | "menu" | "location";
  targetId: string;
  locationName?: string;
  onImageGenerated?: (url: string) => void;
  restaurantName?: string;
}
const backgroundImages = {
  table:
    "https://hhvjh1chgk.ufs.sh/f/31hJxXO5ls8pOpSo9By02cXudOvWY6AM75Nzg1TjRoEaIqSy",
  menu: "https://hhvjh1chgk.ufs.sh/f/31hJxXO5ls8pIOOxxjEnJ46GFk3TzvKm9yZAHRjqO2PpUlXg",
  location:
    "https://hhvjh1chgk.ufs.sh/f/31hJxXO5ls8pYAIjmzw4tyquXSKRj5cT7zxNHUfVlDZgr2Ea",
  default:
    "https://hhvjh1chgk.ufs.sh/f/31hJxXO5ls8pZQZhL8iNDmaVRkOEFwqGIW7QrxljB5ULosuX",
};

export function QRCodeCanvas({
  qrCodeUrl,
  width,
  height,
  target,
  targetId,
  locationName,
  restaurantName,
  onImageGenerated,
}: QRCodeCanvasProps) {
  const [combinedImageUrl, setCombinedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let sketch: any;

    const generateCombinedImage = async () => {
      const p5 = await import("p5");
      sketch = new p5.default((p: any) => {
        let qrCode: any;
        let backgroundImage: any;

        p.preload = () => {
          qrCode = p.loadImage(qrCodeUrl);
          const bgImage = backgroundImages[target] || backgroundImages.default;
          backgroundImage = p.loadImage(bgImage);
        };

        p.setup = () => {
          const canvas = p.createCanvas(width, height);
          // Draw background
          p.image(backgroundImage, 0, 0, width, height);

          // Text styling constants
          const titleMargin = 30;
          const _qrMargin = 60;
          const textBelowMargin = 40;

          // Helper function to add text shadow
          const addTextShadow = (intensity = 0.8) => {
            p.drawingContext.shadowColor = `rgba(0, 0, 0, ${intensity})`;
            p.drawingContext.shadowBlur = 4;
            p.drawingContext.shadowOffsetX = 2;
            p.drawingContext.shadowOffsetY = 2;
          };

          // Helper function to reset shadow
          const resetShadow = () => {
            p.drawingContext.shadowColor = "transparent";
            p.drawingContext.shadowBlur = 0;
            p.drawingContext.shadowOffsetX = 0;
            p.drawingContext.shadowOffsetY = 0;
          };

          // Draw restaurant name at the top (if provided)
          let currentY = titleMargin;
          if (restaurantName) {
            p.textAlign(p.CENTER, p.TOP);
            p.fill(255, 255, 255, 250); // Bright white
            p.textSize(32);
            p.textStyle(p.BOLD);

            // Strong shadow for restaurant name
            addTextShadow(0.9);

            p.text(restaurantName.toUpperCase(), width / 2, currentY);

            resetShadow();

            currentY += 60;
          }

          // Draw subtitle/call-to-action
          p.textAlign(p.CENTER, p.TOP);
          p.fill(255, 255, 255, 240);
          p.textSize(24);
          p.textStyle(p.BOLD); // Made bold

          // Strong shadow for call-to-action
          addTextShadow(0.8);

          p.text("Scan to Place an Order Now!", width / 2, currentY);

          resetShadow();

          // Calculate QR code position
          const qrSize = Math.min(width, height) * 0.45;
          const qrX = width / 2 - qrSize / 2;
          const qrY = currentY + 130; // Space below subtitle

          // QR code container styling
          p.drawingContext.shadowColor = "rgba(0, 0, 0, 0.3)";
          p.drawingContext.shadowBlur = 25;
          p.drawingContext.shadowOffsetY = 15;

          // Draw QR code background
          p.fill(255);
          p.noStroke();
          p.rect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 20);

          // Reset shadow
          resetShadow();

          // Draw QR code
          p.image(qrCode, qrX, qrY, qrSize, qrSize);

          // Add QR code border
          p.stroke(255, 220);
          p.strokeWeight(4);
          p.noFill();
          p.rect(qrX, qrY, qrSize, qrSize, 12);

          // Target information below QR code
          const infoStartY = qrY + qrSize + textBelowMargin;

          // Add decorative line above info
          p.stroke(255, 180);
          p.strokeWeight(2);
          p.line(
            width / 2 - 80,
            infoStartY - 10,
            width / 2 + 80,
            infoStartY - 10,
          );

          // Location name or target type
          p.textAlign(p.CENTER, p.TOP);
          p.fill(255, 255, 255, 250);
          p.textSize(28);
          p.textStyle(p.BOLD); // Made bold

          // Strong shadow for location/target text
          addTextShadow(0.8);

          if (target === "location" && locationName) {
            p.text(locationName.toUpperCase(), width / 2, infoStartY + 10);
          } else {
            p.text(target.toUpperCase(), width / 2, infoStartY + 10);
          }

          if (targetId) {
            // Target ID (table number) - already bold, enhance shadow
            p.textSize(36);
            p.textStyle(p.BOLD);
            p.fill(255, 255, 255, 255); // Pure white

            // Extra strong shadow for target ID
            addTextShadow(0.9);

            const idText =
              target === "location" ? `TABLE ${targetId}` : targetId;
            p.text(idText, width / 2, infoStartY + 50);
          }

          // Reset shadow
          resetShadow();

          const dataUrl = canvas.elt.toDataURL();
          setCombinedImageUrl(dataUrl);
          onImageGenerated?.(dataUrl);
          p.remove();
        };
      });
    };

    generateCombinedImage();

    return () => sketch?.remove();
  }, [
    qrCodeUrl,
    width,
    height,
    target,
    targetId,
    locationName,
    restaurantName,
    onImageGenerated,
  ]);

  if (!combinedImageUrl) {
    return (
      <div>
        <HourglassLoader label="Generating QR Code..." />
      </div>
    );
  }

  return (
    <img
      src={combinedImageUrl}
      alt="Combined QR Code"
      className="w-full h-full object-contain"
    />
  );
}
