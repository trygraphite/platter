export type OrderUpdateData = {
  status?: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';
  tableId?: string;
  specialNotes?: string;
};
export type CreateOrderInput = {
  userId: string;
  tableId?: string;
  items: { menuItemId: string; quantity: number }[];
  specialNotes?: string;
    order: any

};