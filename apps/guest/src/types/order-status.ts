// types/orderStatus.ts
import { Order as PrismaOrder, OrderStatus, Order, Table, User } from "@prisma/client";

export interface OrderItem {
  id: string;
  price: string;
  quantity: number;
  menuItem: {
    id: string;
    name: string;
    price: string;
  };
}



export interface OrderStatusPageProps {
  initialOrder: Order;
  qrId: string;
  table: Table
  user: User;
}

export interface StatusConfig {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  text: string;
}