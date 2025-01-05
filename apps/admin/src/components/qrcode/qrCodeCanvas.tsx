// "use client";

// import React, { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';

// interface QRCodeCanvasProps {
//   qrCodeUrl: string;
//   width: number;
//   height: number;
//   target: string;
//   targetId: string;
// }

// const backgroundImages = {
//   "restaurant-table": "/qrimages/restaurant-table-bg.jpg",
// };

// export function QRCodeCanvas({ qrCodeUrl, width, height, target, targetId }: QRCodeCanvasProps) {
//   const [combinedImageUrl, setCombinedImageUrl] = useState<string | null>(null);

//   useEffect(() => {
//     let sketch: any;

//     const generateCombinedImage = async () => {
//       const p5 = await import('p5');
//       sketch = new p5.default((p: any) => {
//         let qrCode: any;
//         let backgroundImage: any;

//         p.preload = () => {
//           qrCode = p.loadImage(qrCodeUrl);
//           backgroundImage = p.loadImage(backgroundImages["restaurant-table"]);
//         };

//         p.setup = () => {
//           const canvas = p.createCanvas(width, height);
//           p.image(backgroundImage, 0, 0, width, height);

//           // Draw QR Code
//           const qrSize = Math.min(width, height) * 0.5;
//           const x = (width - qrSize) / 2;
//           const y = (height - qrSize) / 2;
//           p.image(qrCode, x, y, qrSize, qrSize);

//           // Draw text at the top
//           p.textSize(40);
//           p.textAlign(p.CENTER, p.TOP);
//           p.fill(255);
//           p.text('Scan to Explore Our Menu & Order Now!', width / 2, 20);

//           // Draw "Table" and the target ID below
//           p.textSize(60);
//           p.textAlign(p.LEFT, p.CENTER);
//           p.text('TABLE', 20, height / 2 - 40);
//           p.text(targetId, 20, height / 2 + 40);

//           setCombinedImageUrl(canvas.elt.toDataURL());
//           p.remove();
//         };
//       });
//     };

//     generateCombinedImage();

//     return () => {
//       if (sketch) {
//         sketch.remove();
//       }
//     };
//   }, [qrCodeUrl, width, height, target, targetId]);

//   if (!combinedImageUrl) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="w-full h-full flex items-center justify-center">
//       <img
//         src={combinedImageUrl}
//         alt="QR Code with Background"
//         className="max-w-full max-h-full object-contain"
//       />
//     </div>
//   );
// }
