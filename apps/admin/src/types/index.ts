
export interface Complaint {
  id: string;
  content: string;
  category: string;
  status: string;
  title?: string;
  createdAt: Date;
  qrCode?: { code: string,   target?: string; };
  table?: { number: number };
}


export interface MenuItemVarietyInput {
  id?: string; // Optional for new varieties
  name: string;
  description?: string | null;
  price: number;
  position: number;
  isAvailable: boolean;
  isDefault: boolean;
}