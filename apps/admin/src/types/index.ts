
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