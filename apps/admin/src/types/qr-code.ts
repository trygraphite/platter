// types/qr-code.ts
export interface QRCodeData {
  tableNumber: number;
  restaurantName: string;
  subdomain: string;
}

export interface QRCodeFormData {
  tableNumber: number;
}

export interface QRCodeResponse {
  success: boolean;
  qrCodeUrl?: string;
  locationName? : string;
  error?: string;
  restaurantName?: string;
}
