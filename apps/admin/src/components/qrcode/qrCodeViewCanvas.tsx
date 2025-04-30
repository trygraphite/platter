"use client";

import { HourglassLoader } from "@platter/ui/components/timeLoader";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode"; // You'll need to install this package

interface QRCodeCanvasProps {
  qrCodeUrl: string; // This is the URL the QR code will link to
  width: number;
  height: number;
  target: "table" | "menu" | "location";
  targetId: string;
  locationName?: string;
  onImageGenerated?: (url: string) => void;
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

export function QRCodeViewCanvas({
  qrCodeUrl,
  width,
  height,
  target,
  targetId,
  locationName,
  onImageGenerated,
}: QRCodeCanvasProps) {
  const [combinedImageUrl, setCombinedImageUrl] = useState<string | null>(null);
  const [qrCodeImageDataUrl, setQrCodeImageDataUrl] = useState<string | null>(null);

  // First generate the QR code as a data URL
  useEffect(() => {
    const generateQrCode = async () => {
      try {
        // Generate QR code as data URL
        const dataUrl = await QRCode.toDataURL(qrCodeUrl, {
          width: Math.min(width, height) * 0.5,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrCodeImageDataUrl(dataUrl);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };
    
    generateQrCode();
  }, [qrCodeUrl, width, height]);

  // Then combine the QR code with the background
  useEffect(() => {
    if (!qrCodeImageDataUrl) return;
    
    let sketch: any;

    const generateCombinedImage = async () => {
      const p5 = await import("p5");
      sketch = new p5.default((p: any) => {
        let qrCode: any;
        let backgroundImage: any;

        p.preload = () => {
          // Load the generated QR code image
          qrCode = p.loadImage(qrCodeImageDataUrl);
          const bgImage = backgroundImages[target] || backgroundImages.default;
          backgroundImage = p.loadImage(bgImage);
        };

        p.setup = () => {
          // Rest of your existing setup code
          const canvas = p.createCanvas(width, height);
          // Draw background
          p.image(backgroundImage, 0, 0, width, height);

          // Text styling constants
          const titleMargin = 50;
          const textBelowMargin = 40;

          // Draw title above QR code
          p.textAlign(p.CENTER, p.TOP);
          p.fill(255);
          p.textSize(26);
          p.textStyle(p.BOLD);
          p.text("Scan to Explore Our Menu & Order Now!", width / 2, titleMargin);

          // Calculate QR code position
          const qrSize = Math.min(width, height) * 0.5;
          const qrX = width / 2 - qrSize / 2;
          const qrY = titleMargin + 160; // Space below title

          // QR code container styling
          p.drawingContext.shadowColor = "rgba(0, 0, 0, 0.3)";
          p.drawingContext.shadowBlur = 25;
          p.drawingContext.shadowOffsetY = 15;

          // Draw QR code background
          p.fill(255);
          p.noStroke();
          p.rect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 20);

          // Reset shadow
          p.drawingContext.shadowColor = "transparent";

          // Draw QR code
          p.image(qrCode, qrX, qrY, qrSize, qrSize);

          // Add QR code border
          p.stroke(255, 0.9);
          p.strokeWeight(6);
          p.noFill();
          p.rect(qrX, qrY, qrSize, qrSize, 12);

          // Target information below QR code
          const infoStartY = qrY + qrSize + textBelowMargin;

          // Location name or target type
          p.textSize(34);
          p.textStyle(p.NORMAL);
          p.fill(255);

          if (target === "location" && locationName) {
            p.text(locationName.toUpperCase(), width / 2, infoStartY);
          } else {
            p.text(target.toUpperCase(), width / 2, infoStartY);
          }

          if (targetId) {
            // Target ID (table number)
            p.textSize(42);
            p.textStyle(p.BOLD);
            p.fill(255);
            const idText = target === "location" ? `TABLE ${targetId}` : targetId;
            p.text(idText, width / 2, infoStartY + 50);
          }

          // Add decorative line
          p.stroke(255, 0.8);
          p.strokeWeight(2);
          p.line(
            width / 2 - 60,
            infoStartY - 20,
            width / 2 + 60,
            infoStartY - 20,
          );

          const dataUrl = canvas.elt.toDataURL();
          setCombinedImageUrl(dataUrl);
          onImageGenerated?.(dataUrl);
          p.remove();
        };
      });
    };

    generateCombinedImage();

    return () => sketch?.remove();
  }, [qrCodeImageDataUrl, width, height, target, targetId, locationName, onImageGenerated]);

  if (!combinedImageUrl) {
    return (
      <div><HourglassLoader label="Generating QR Code..."/></div>
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